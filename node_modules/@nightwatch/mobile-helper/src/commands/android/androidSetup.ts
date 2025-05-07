import colors from 'ansi-colors';
import boxen from 'boxen';
import {execSync} from 'child_process';
import * as dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
import untildify from 'untildify';
import {prompt} from 'inquirer';

import Logger from '../../logger';
import {getPlatformName, symbols} from '../../utils';
import {getAlreadyRunningAvd, killEmulatorWithoutWait, launchAVD} from './adb';
import {
  ABI, AVAILABLE_OPTIONS, BINARY_TO_PACKAGE_NAME, DEFAULT_CHROME_VERSIONS,
  DEFAULT_FIREFOX_VERSION, NIGHTWATCH_AVD, SETUP_CONFIG_QUES
} from './constants';
import DOWNLOADS from './downloads.json';
import {AndroidSetupResult, Options, OtherInfo, Platform, SdkBinary, SetupConfigs} from './interfaces';
import {getSubcommandHelp} from './subcommands/help';
import {
  checkJavaInstallation, downloadFirefoxAndroid, downloadWithProgressBar,
  getAllAvailableOptions, getBinaryLocation, getBinaryNameForOS,
  getFirefoxApkName, getLatestVersion, getSdkRootFromEnv
} from './utils/common';
import {
  downloadAndSetupAndroidSdk, downloadSdkBuildTools, execBinarySync,
  getBuildToolsAvailableVersions, getDefaultAndroidSdkRoot, installPackagesUsingSdkManager
} from './utils/sdk';



export class AndroidSetup {
  sdkRoot: string;
  javaHome: string;
  options: Options;
  rootDir: string;
  platform: Platform;
  otherInfo: OtherInfo;

  constructor(options: Options = {}, rootDir = process.cwd()) {
    this.sdkRoot = '';
    this.javaHome = '';
    this.options = options;
    this.rootDir = rootDir;
    this.platform = getPlatformName();
    this.otherInfo = {
      androidHomeInGlobalEnv: false,
      javaHomeInGlobalEnv: false
    };
  }

  async run(): Promise<AndroidSetupResult | boolean> {
    const allAvailableOptions = getAllAvailableOptions();
    const unknownOptions = Object.keys(this.options).filter((option) => !allAvailableOptions.includes(option));

    if (this.options.help || unknownOptions.length) {
      this.showOptionsHelp(unknownOptions);

      if (this.options.help) {
        Logger.log('\n' + getSubcommandHelp());
      }

      return this.options.help === true;
    }

    const javaInstalled = checkJavaInstallation(this.rootDir);
    if (!javaInstalled) {
      return false;
    }

    this.loadEnvFromDotEnv();

    let javaHomeFound: boolean | null = false;
    if (this.options.appium) {
      javaHomeFound = this.isJavaHomeEnvSet();

      if (!javaHomeFound) {
        this.javaHomeNotFoundInstructions();

        if (javaHomeFound === false) {
          Logger.log(`${colors.red(
            'ERROR:'
          )} JAVA_HOME env variable could not be set in a .env file. Please set the JAVA_HOME env variable as instructed above.`);

          this.envSetHelp();

          return false;
        }

        // env can be set in dotenv file (javaHomeFound=null).
        process.env.JAVA_HOME = await this.getJavaHomeFromUser();
      }

      this.javaHome = process.env.JAVA_HOME || '';
    }

    const sdkRootEnv = getSdkRootFromEnv(this.rootDir, this.otherInfo.androidHomeInGlobalEnv);

    if (this.options.appium && !sdkRootEnv && this.otherInfo.androidHomeInGlobalEnv) {
      // ANDROID_HOME is set to an invalid path in system env. We can get around this for mobile-web
      // since ANDROID_HOME is not a mandatory requirement there and Nightwatch would complain when it
      // is required, but for Appium to work properly, it should be set to correct path in sys env or .env.
      Logger.log(`${colors.red('ERROR:')} For Appium to work properly, ${colors.cyan(
        'ANDROID_HOME'
      )} env variable must be set to a valid path in your system environment variables.`);

      this.envSetHelp();

      return false;
    }

    this.sdkRoot = sdkRootEnv || await this.getSdkRootFromUser();
    process.env.ANDROID_HOME = this.sdkRoot;

    let result = true;

    const setupConfigs: SetupConfigs = await this.getSetupConfigs(this.options);
    Logger.log();

    const missingRequirements = this.verifySetup(setupConfigs);

    if (missingRequirements.length) {
      if (!this.options.setup) {
        Logger.log(`Some requirements are missing: ${colors.red(missingRequirements.join(', '))}\n`);
        this.options.setup = await this.askToSetupAndroid('Do you wish to download the missing binaries and complete setup?');
      }

      if (this.options.setup) {
        result = await this.setupAndroid(setupConfigs, missingRequirements);
      } else {
        result = false;
      }
    }

    if (setupConfigs.mode !== 'real' && result) {
      // Only verify/install browsers if working with emulator and
      // all processes before have passed.
      result = await this.verifyAndSetupBrowsers(setupConfigs.browsers);
    }

    this.postSetupInstructions(result, setupConfigs);

    if (!this.options.standalone && setupConfigs.mode !== 'emulator') {
      Logger.log(`${colors.bold('Note:')} Please make sure you have required browsers installed on your real-device before running tests.\n`);
    }

    if (!sdkRootEnv || (this.options.appium && !javaHomeFound)) {
      this.envSetInstructions(sdkRootEnv);
    }

    return {
      status: result,
      setup: !!this.options.setup,
      mode: setupConfigs.mode || 'real'
    };
  }

  showOptionsHelp(unknownOptions: string[]) {
    if (unknownOptions.length) {
      Logger.log(colors.red(`unknown option(s) passed: ${unknownOptions.join(', ')}\n`));
    }

    Logger.log(`Usage: ${colors.cyan('npx @nightwatch/mobile-helper android [options]')}`);
    Logger.log('  Verify if all the requirements are met to run tests on an Android device/emulator.\n');

    Logger.log(`${colors.yellow('Options:')}`);

    const switches = Object.keys(AVAILABLE_OPTIONS).reduce((acc: {[T: string]: string}, key) => {
      acc[key] = [key].concat(AVAILABLE_OPTIONS[key].alias || [])
        .map(function(sw) {
          return (sw.length > 1 ? '--' : '-') + sw;
        })
        .join(', ');

      return acc;
    }, {});

    const longest = (xs: string[]) => Math.max.apply(null, xs.map(x => x.length));

    const switchlen = longest(Object.keys(switches).map(function(s) {
      return switches[s] || '';
    }));

    const desclen = longest(Object.keys(AVAILABLE_OPTIONS).map((option) => {
      return AVAILABLE_OPTIONS[option].description;
    }));

    Object.keys(AVAILABLE_OPTIONS).forEach(key => {
      const kswitch = switches[key];
      let desc = AVAILABLE_OPTIONS[key].description;
      const spadding = new Array(Math.max(switchlen - kswitch.length + 3, 0)).join('.');
      const dpadding = new Array(Math.max(desclen - desc.length + 1, 0)).join(' ');

      if (dpadding.length > 0) {
        desc += dpadding;
      }

      const prelude = '  ' + (kswitch) + ' ' + colors.grey(spadding);

      Logger.log(prelude + ' ' + colors.grey(desc));
    });
  }

  loadEnvFromDotEnv(): void {
    this.otherInfo.androidHomeInGlobalEnv = 'ANDROID_HOME' in process.env;

    if (this.options.appium) {
      this.otherInfo.javaHomeInGlobalEnv = 'JAVA_HOME' in process.env;
    }

    dotenv.config({path: path.join(this.rootDir, '.env')});
  }

  isJavaHomeEnvSet(): boolean | null {
    Logger.log('Checking the value of JAVA_HOME environment variable...');

    const javaHome = process.env.JAVA_HOME;
    const fromDotEnv = this.otherInfo.javaHomeInGlobalEnv ? '' : ' (taken from .env)';

    if (javaHome !== undefined && fs.existsSync(javaHome)) {
      Logger.log(`  ${colors.green(symbols().ok)} JAVA_HOME is set to '${javaHome}'${fromDotEnv}`);

      const javaHomeBin = path.resolve(javaHome, 'bin');
      if (fs.existsSync(javaHomeBin)) {
        Logger.log(`  ${colors.green(symbols().ok)} 'bin' subfolder exists under '${javaHome}'\n`);

        return true;
      }

      Logger.log(`  ${colors.red(symbols().fail)} 'bin' subfolder does not exist under '${javaHome}'. Is ${javaHome} set to a proper value?\n`);
      if (this.otherInfo.javaHomeInGlobalEnv) {
        // we cannot set it ourselves
        return false;
      }

      // We can set the env in dotenv file.
      return null;
    }

    if (javaHome === undefined) {
      Logger.log(`  ${colors.red(symbols().fail)} JAVA_HOME env variable is NOT set!\n`);
    } else {
      Logger.log(`  ${colors.red(symbols().fail)} JAVA_HOME is set to '${javaHome}'${fromDotEnv} but this is NOT a valid path!\n`);

      if (this.otherInfo.javaHomeInGlobalEnv) {
        // we cannot set it ourselves
        return false;
      }
    }

    // we can set the env in dotenv file.
    return null;
  }

  javaHomeNotFoundInstructions(): void {
    Logger.log(`${colors.red('NOTE:')} For Appium to work properly, ${colors.cyan(
      'JAVA_HOME'
    )} env variable must be set to the root folder path of your local JDK installation.`);

    let expectedPath;

    if (this.platform === 'windows') {
      expectedPath = 'C:\\Program Files\\Java\\jdk1.8.0_111';
    } else if (this.platform === 'mac') {
      expectedPath = '/Library/Java/JavaVirtualMachines/jdk1.8.0_111.jdk/Contents/Home';
    } else {
      expectedPath = '/usr/lib/jvm/java-8-oracle';
    }

    Logger.log(`${colors.green('Hint:')} On a ${this.platform} system, the JDK installation path should be something similar to '${expectedPath}'.\n`);
  }

  async getJavaHomeFromUser(): Promise<string> {
    let javaHome;

    if (this.platform === 'mac') {
      try {
        const stdout = execSync('/usr/libexec/java_home', {
          stdio: 'pipe'
        });

        javaHome = stdout.toString().trimEnd();

        Logger.log(`${colors.green(symbols().ok)} Auto-detected JAVA_HOME to be: ${colors.green(javaHome)}`);
        // eslint-disable-next-line
      } catch {}
    }

    const answers: {javaHome: string} = await prompt([
      {
        type: 'input',
        name: 'javaHome',
        message: 'Enter the path to the root folder of your local JDK installation:',
        validate: (input) => {
          if (!fs.existsSync(input)) {
            return 'Entered path does not exist';
          }

          if (!fs.existsSync(path.resolve(input, 'bin'))) {
            return `'bin' subfolder does not exist under '${input}'`;
          }

          return true;
        }
      }
    ], {javaHome});
    Logger.log();

    const envPath = path.join(this.rootDir, '.env');
    fs.appendFileSync(envPath, `\nJAVA_HOME=${answers.javaHome}`);

    return answers.javaHome;
  }

  async getSdkRootFromUser(): Promise<string> {
    const answers: {sdkRoot: string} = await prompt([
      {
        type: 'input',
        name: 'sdkRoot',
        message: 'Where do you want the Android SDK setup? Please give the path to your existing setup (if any):',
        default: getDefaultAndroidSdkRoot(this.platform),
        filter: (input: string) => path.resolve(this.rootDir, untildify(input))
      }
    ]);

    const {sdkRoot} = answers;

    if (!this.otherInfo.androidHomeInGlobalEnv) {
      // if ANDROID_HOME is already set in global env, saving it to .env is of no use.
      // this is important if global ANDROID_HOME env is set to '', in which case we
      // should not save the user supplied value to .env.
      const envPath = path.join(this.rootDir, '.env');
      fs.appendFileSync(envPath, `\nANDROID_HOME=${sdkRoot}`);
    }

    return sdkRoot;
  }

  getConfigFromOptions(options: {[key: string]: string | string[] | boolean}): SetupConfigs {
    const configs: SetupConfigs = {};

    if (options.mode && typeof options.mode !== 'boolean') {
      const realMode = options.mode.includes('real');
      const emulatorMode = options.mode.includes('emulator');

      if ((realMode && emulatorMode) || options.mode.includes('both')) {
        configs.mode = 'both';
      } else if (realMode) {
        configs.mode = 'real';
      } else if (emulatorMode) {
        configs.mode = 'emulator';
      }
    }

    if (options.browsers && typeof options.browsers !== 'boolean') {
      const chrome = options.browsers.includes('chrome');
      const firefox = options.browsers.includes('firefox');

      if (options.browsers.includes('none')) {
        configs.browsers = 'none';
      } else if ((chrome && firefox) || options.browsers.includes('both')) {
        configs.browsers = 'both';
      } else if (chrome) {
        configs.browsers = 'chrome';
      } else if (firefox) {
        configs.browsers = 'firefox';
      }
    }

    // For standalone mode, don't ask the browser question (set `configs.browsers` to 'none').
    // But if a user explicitly provides a browser using the `--browsers` flag, use it.
    if (options.standalone && !configs.browsers) {
      configs.browsers = 'none';

      // if just the `--browsers` flag is passed with no argument,
      // ask the browser question even in the case of standalone.
      if (options.browsers === true) {
        delete configs.browsers;
      }
    }

    return configs;
  }

  async getSetupConfigs(options: Options): Promise<SetupConfigs> {
    const configs = this.getConfigFromOptions(options);

    return await prompt(SETUP_CONFIG_QUES, configs);
  }

  async askToSetupAndroid(message: string): Promise<boolean> {
    const answers: {setupAndroid: boolean} = await prompt([
      {
        type: 'list',
        name: 'setupAndroid',
        message: message,
        choices: [{name: 'Yes', value: true}, {name: 'Not now', value: false}],
        default: true
      }
    ]);
    Logger.log();

    return answers.setupAndroid;
  }

  checkBinariesPresent(binaries: SdkBinary[]): SdkBinary[] {
    const missingBinaries: SdkBinary[] = [];

    for (const binaryName of binaries) {
      const binaryPath = getBinaryLocation(this.sdkRoot, this.platform, binaryName);
      if (!binaryPath) {
        missingBinaries.push(binaryName);
      }
    }
    Logger.log();

    return missingBinaries;
  }

  checkBinariesWorking(binaries: SdkBinary[]): SdkBinary[] {
    const nonWorkingBinaries: SdkBinary[] = [];

    for (const binaryName of binaries) {
      const binaryPath = getBinaryLocation(this.sdkRoot, this.platform, binaryName, true);

      let cmd = '--version';
      if (binaryName === 'emulator') {
        cmd = '-version';
      } else if (binaryName === 'avdmanager') {
        cmd = 'list avd';
      }

      if (binaryPath) {
        const binaryWorking = execBinarySync(binaryPath, binaryName, this.platform, cmd);
        if (binaryWorking === null) {
          nonWorkingBinaries.push(binaryName);
        }
      } else {
        Logger.log(`  ${colors.red(symbols().fail)} ${colors.cyan(binaryName)} binary not found.`);
        nonWorkingBinaries.push(binaryName);
      }
    }

    if (nonWorkingBinaries.length) {
      Logger.log();
    }

    return nonWorkingBinaries;
  }

  verifyAvdPresent(): boolean {
    const avdLocation = getBinaryLocation(this.sdkRoot, this.platform, 'avdmanager', true);
    if (!avdLocation) {
      return false;
    }

    let stdout = execBinarySync(
      avdLocation,
      'avdmanager',
      this.platform,
      'list avd'
    );

    if (stdout !== null) {
      const nonWorkingAvdsIndex = stdout.indexOf('could not be loaded');

      if (nonWorkingAvdsIndex > -1) {
        stdout = stdout.slice(0, nonWorkingAvdsIndex);
      }

      if (stdout.includes(NIGHTWATCH_AVD)) {
        return true;
      }
    }

    return false;
  }

  verifyAdbRunning() {
    Logger.log('Making sure adb is running...');

    const adbLocation = getBinaryLocation(this.sdkRoot, this.platform, 'adb', true);
    if (!adbLocation) {
      Logger.log(`  ${colors.red(symbols().fail)} ${colors.cyan('adb')} binary not found.\n`);

      return;
    }

    const serverStarted = execBinarySync(
      adbLocation,
      'adb',
      this.platform,
      'start-server'
    );

    if (serverStarted !== null) {
      Logger.log(`${colors.green('Success!')} adb server is running.\n`);
    } else {
      Logger.log('Please try running the above command by yourself.\n');
    }
  }

  verifySetup(setupConfigs: SetupConfigs): string[] {
    const missingRequirements: string[] = [];

    if (setupConfigs.mode === 'real') {
      Logger.log('Verifying the setup requirements for real devices...');
    } else if (setupConfigs.mode === 'emulator') {
      Logger.log('Verifying the setup requirements for Android emulator...');
    } else {
      Logger.log('Verifying the setup requirements for real devices/emulator...');
    }

    const requiredBinaries: SdkBinary[] = ['adb'];

    if (setupConfigs.mode !== 'real') {
      requiredBinaries.push('avdmanager', 'emulator');
    }

    const missingBinaries = this.checkBinariesPresent(requiredBinaries);
    missingRequirements.push(...missingBinaries);

    // check for build-tools
    if (this.options.appium) {
      const buildToolsPath = path.join(this.sdkRoot, 'build-tools');
      const availableVersions = getBuildToolsAvailableVersions(buildToolsPath);
      if (availableVersions.length > 0) {
        Logger.log(
          `  ${colors.green(symbols().ok)} ${colors.cyan('Android Build Tools')} present at '${buildToolsPath}'.`,
          `Available versions: ${colors.cyan(availableVersions.join(', '))}\n`
        );
      } else {
        Logger.log(
          `  ${colors.red(symbols().fail)} ${colors.cyan('Android Build Tools')} not present at '${buildToolsPath}'\n`
        );
        missingRequirements.push('build-tools');
      }
    }

    // check for platforms subdirectory (required by emulator)
    if (requiredBinaries.includes('emulator')) {
      const platormsPath = path.join(this.sdkRoot, 'platforms');
      if (fs.existsSync(platormsPath)) {
        Logger.log(
          `  ${colors.green(symbols().ok)} ${colors.cyan('platforms')} subdirectory is present at '${platormsPath}'\n`
        );
      } else {
        Logger.log(
          `  ${colors.red(symbols().fail)} ${colors.cyan('platforms')} subdirectory not present at '${platormsPath}'\n`
        );
        missingRequirements.push('platforms');
      }

      const avdPresent = this.verifyAvdPresent();
      if (avdPresent) {
        Logger.log(
          `  ${colors.green(symbols().ok)} ${colors.cyan(NIGHTWATCH_AVD)} AVD is present and ready to be used.\n`
        );
      } else {
        Logger.log(`  ${colors.red(symbols().fail)} ${colors.cyan(NIGHTWATCH_AVD)} AVD not found.\n`);

        missingRequirements.push(NIGHTWATCH_AVD);
      }
    }

    const binariesPresent = requiredBinaries.filter((binary) => !missingBinaries.includes(binary));
    if (binariesPresent.length) {
      const nonWorkingBinaries = this.checkBinariesWorking(binariesPresent);

      missingRequirements.push(...nonWorkingBinaries);
    }

    if (missingRequirements.length === 0) {
      this.verifyAdbRunning();
    }

    return missingRequirements;
  }

  async setupAndroid(setupConfigs: SetupConfigs, missingRequirements: string[]): Promise<boolean> {
    if (setupConfigs.mode === 'real') {
      Logger.log('Setting up missing requirements for real devices...\n');
    } else if (setupConfigs.mode === 'emulator') {
      Logger.log('Setting up missing requirements for Android emulator...\n');
    } else {
      Logger.log('Setting up missing requirements for real devices/emulator...\n');
    }

    // check if sdkmanager is present and working (below line will check both)
    Logger.log('Verifying that sdkmanager is present and working...');
    const sdkManagerWorking = this.checkBinariesWorking(['sdkmanager']).length === 0;
    if (sdkManagerWorking) {
      Logger.log(colors.green('Success!'), '\n');
    }

    if (!sdkManagerWorking || missingRequirements.includes('avdmanager')) {
      // remove avdmanager from missingRequirements to avoid double downloads.
      const avdmanagerIndex = missingRequirements.indexOf('avdmanager');
      if (avdmanagerIndex > -1) {
        missingRequirements.splice(avdmanagerIndex, 1);
      }

      Logger.log('Downloading cmdline-tools...');
      await downloadAndSetupAndroidSdk(this.sdkRoot, this.platform);
    }

    const packagesToInstall = missingRequirements
      .filter((requirement) => Object.keys(BINARY_TO_PACKAGE_NAME).includes(requirement))
      .map((binary) => BINARY_TO_PACKAGE_NAME[binary as SdkBinary | typeof NIGHTWATCH_AVD]);

    // Update emulator as well
    if (setupConfigs.mode !== 'real' && !missingRequirements.includes('emulator')) {
      packagesToInstall.push(BINARY_TO_PACKAGE_NAME['emulator']);
    }

    let result = installPackagesUsingSdkManager(
      getBinaryLocation(this.sdkRoot, this.platform, 'sdkmanager', true),
      this.platform,
      packagesToInstall
    );

    // Download build-tools if using Appium
    if (this.options.appium) {
      const res = downloadSdkBuildTools(
        getBinaryLocation(this.sdkRoot, this.platform, 'sdkmanager', true),
        this.platform
      );
      if (!res) {
        result = false;
      }
    }

    if (missingRequirements.includes('platforms')) {
      Logger.log('Creating platforms subdirectory...');

      const platformsPath = path.join(this.sdkRoot, 'platforms');
      try {
        fs.mkdirSync(platformsPath);
        // eslint-disable-next-line
      } catch {}

      Logger.log(`${colors.green('Success!')} Created platforms subdirectory at ${platformsPath}\n`);
    }

    if (missingRequirements.includes(NIGHTWATCH_AVD)) {
      // Check if AVD is already created and only the system-image was missing.
      const avdPresent = this.verifyAvdPresent();
      if (!avdPresent) {
        Logger.log(`Creating AVD "${NIGHTWATCH_AVD}" using pixel_5 hardware profile...`);

        const avdCreated = execBinarySync(
          getBinaryLocation(this.sdkRoot, this.platform, 'avdmanager', true),
          'avdmanager',
          this.platform,
          `create avd --force --name "${NIGHTWATCH_AVD}" --package "system-images;android-30;google_apis;${ABI}" --device "pixel_5"`
        );

        if (avdCreated !== null) {
          Logger.log(`${colors.green('Success!')} AVD "${NIGHTWATCH_AVD}" created successfully!\n`);
        } else {
          Logger.log();
          result = false;
        }
      }
    }

    this.verifyAdbRunning();

    return result;
  }

  async verifyAndSetupBrowsers(browsersConfig: SetupConfigs['browsers']): Promise<boolean> {
    const browsers: ('firefox' | 'chrome')[] = [];
    if (browsersConfig === 'both') {
      browsers.push('chrome', 'firefox');
    } else if (browsersConfig && browsersConfig !== 'none') {
      browsers.push(browsersConfig);
    }

    // add chrome for web-view testing on Android Emulator
    if (this.options.appium && !browsers.includes('chrome')) {
      browsers.push('chrome');
    }

    if (!browsers.length) {
      return true;
    }

    const status = {
      // verify true by default
      // (turn to false only when browser not found)
      verifyFirefox: true,
      verifyChrome: true,
      // setup false by default
      // (turn to true only when setup complete)
      setupFirefox: false,
      setupChrome: false
    };

    const verifyFirefox = browsers.includes('firefox');
    const verifyChrome = browsers.includes('chrome');

    let firefoxLatestVersion = '';
    let installedChromeVersion = '';

    let installFirefox = false;
    let downloadChromedriver = false;

    const chromedriverDownloadDir = path.join(this.rootDir, 'chromedriver-mobile');
    const chromedriverDownloadPath = path.join(chromedriverDownloadDir, getBinaryNameForOS(this.platform, 'chromedriver'));

    Logger.log('Verifying if browser(s) are installed...\n');

    const emulatorAlreadyRunning = await getAlreadyRunningAvd(this.sdkRoot, this.platform, NIGHTWATCH_AVD);

    const emulatorId = emulatorAlreadyRunning || await launchAVD(this.sdkRoot, this.platform, NIGHTWATCH_AVD);

    if (!emulatorId) {
      Logger.log('Please close the emulator manually if running and not closed automatically.\n');

      return false;
    }

    Logger.log('Making sure adb has root permissions...');
    const adbRootStdout = execBinarySync(
      getBinaryLocation(this.sdkRoot, this.platform, 'adb', true),
      'adb',
      this.platform,
      `-s ${emulatorId} root`
    );
    if (adbRootStdout !== null) {
      Logger.log(`  ${colors.green(symbols().ok)} adb is running with root permissions!\n`);
    } else {
      Logger.log('Please try running the above command by yourself.\n');
    }

    if (verifyFirefox) {
      firefoxLatestVersion = await getLatestVersion('firefox');

      Logger.log('Verifying if Firefox is installed...');
      const stdout = execBinarySync(
        getBinaryLocation(this.sdkRoot, this.platform, 'adb', true),
        'adb',
        this.platform,
        `-s ${emulatorId} shell pm list packages org.mozilla.firefox`
      );
      if (stdout) {
        Logger.log(`  ${colors.green(symbols().ok)} Firefox browser is installed in the AVD.\n`);

        Logger.log('Checking the version of installed Firefox browser...');
        const versionStdout = execBinarySync(
          getBinaryLocation(this.sdkRoot, this.platform, 'adb', true),
          'adb',
          this.platform,
          `-s ${emulatorId} shell dumpsys package org.mozilla.firefox`
        );

        if (versionStdout !== null) {
          const versionMatch = versionStdout.match(/versionName=((\d+\.)+\d+)/);
          if (!versionMatch) {
            Logger.log(`  ${colors.red(symbols().fail)} Failed to find the version of the Firefox browser installed.\n`);
          } else if (versionMatch[1] !== firefoxLatestVersion) {
            const currentMajorVersion = parseInt(versionMatch[1].split('.')[0], 10);
            const latestMajorVersion = parseInt(firefoxLatestVersion.split('.')[0], 10);

            if (firefoxLatestVersion === DEFAULT_FIREFOX_VERSION && currentMajorVersion >= latestMajorVersion) {
              Logger.log(`  ${colors.red(symbols().fail)} Failed to fetch the latest version of Firefox browser.\n`);
            } else {
              Logger.log(`  ${colors.yellow('!')} A new version of Firefox browser is available (${colors.cyan(versionMatch[1] + ' -> ' + firefoxLatestVersion)})\n`);
              installFirefox = true;
            }
          } else {
            Logger.log(`  ${colors.green(symbols().ok)} Your Firefox browser is up-to-date.\n`);
          }
        } else {
          Logger.log('Could not get the version of the installed Firefox browser.\n');
        }
      } else if (stdout !== null) {
        Logger.log(`  ${colors.red(symbols().fail)} Firefox browser not found in the AVD.\n`);
        installFirefox = true;
        status.verifyFirefox = false;
      } else {
        // Command failed.
        Logger.log('Failed to verify the presence of Firefox browser.\n');
        status.verifyFirefox = false;
      }
    }

    if (verifyChrome) {
      Logger.log('Verifying if Chrome is installed...');
      const stdout = execBinarySync(
        getBinaryLocation(this.sdkRoot, this.platform, 'adb', true),
        'adb',
        this.platform,
        `-s ${emulatorId} shell pm list packages com.android.chrome`
      );
      if (stdout) {
        Logger.log(`  ${colors.green(symbols().ok)} Chrome browser is installed in the AVD.\n`);

        Logger.log('Checking the version of installed Chrome browser...');
        const versionStdout = execBinarySync(
          getBinaryLocation(this.sdkRoot, this.platform, 'adb', true),
          'adb',
          this.platform,
          `-s ${emulatorId} shell dumpsys package com.android.chrome`
        );

        if (versionStdout !== null) {
          const versionMatch = versionStdout.match(/versionName=((\d+\.)+\d+)/);
          if (!versionMatch) {
            Logger.log(`  ${colors.red(symbols().fail)} Failed to find the version of the Chrome browser installed.\n`);
          } else {
            Logger.log(`Version: ${colors.green(versionMatch[1])}\n`);
            installedChromeVersion = versionMatch[1];
          }

          Logger.log(`${colors.bold('Note:')} Automatic upgrade of Chrome browser is not supported yet.\n`);
          // Logger.log('You can upgrade the browser by using Play Store in the emulator if need be.');
        } else {
          Logger.log('Could not get the version of the installed Chrome browser.\n');
        }

        // TODO: add major version of Chrome as suffix to chromedriver.
        // Or, check the version of existing chromedriver using --version.
        if (!this.options.standalone) {
          Logger.log('Checking if chromedriver is already downloaded...');
          if (fs.existsSync(chromedriverDownloadPath)) {
            Logger.log(`  ${colors.green(symbols().ok)} chromedriver already present at '${chromedriverDownloadPath}'\n`);
          } else {
            Logger.log(`  ${colors.red(symbols().fail)} chromedriver not found at '${chromedriverDownloadPath}'\n`);
            downloadChromedriver = true;
          }
        }
      } else if (stdout !== null) {
        Logger.log(`  ${colors.red(symbols().fail)} Chrome browser not found in the AVD.\n`);
        Logger.log(`${colors.yellow('Note:')} Automatic installation of Chrome browser is not supported yet.\n`);
        status.verifyChrome = false;
      } else {
        // Command failed.
        Logger.log('Failed to verify the presence of Chrome browser.\n');
        status.verifyChrome = false;
      }
    }

    if (!this.options.setup) {
      let message = '';

      if (installFirefox && downloadChromedriver) {
        message = 'Do you wish to setup the missing browser requirements?';
      } else if (installFirefox) {
        message = 'Do you wish to install/upgrade the Firefox browser?';
      } else if (downloadChromedriver) {
        message = `Do you wish to setup the missing requirements for ${this.options.appium ? 'Appium' : 'Chrome browser'}?`;
      }

      if (message) {
        this.options.setup = await this.askToSetupAndroid(message);
      }
    }

    if (this.options.setup) {
      if (installFirefox) {
        Logger.log('Downloading latest Firefox APK...');

        const firefoxDownloaded = await downloadFirefoxAndroid(firefoxLatestVersion);
        if (firefoxDownloaded) {
          Logger.log('\nInstalling the downloaded APK in the running AVD...');

          const stdout = execBinarySync(
            getBinaryLocation(this.sdkRoot, this.platform, 'adb', true),
            'adb',
            this.platform,
            `-s ${emulatorId} install -r ${path.join(os.tmpdir(), getFirefoxApkName(firefoxLatestVersion))}`
          );

          if (stdout !== null) {
            Logger.log(`  ${colors.green(symbols().ok)} Firefox browser installed successfully!\n`);
            Logger.log('You can run your tests now on your Android Emulator\'s Firefox browser.\n');
            status.setupFirefox = true;
          } else {
            Logger.log('Please try running the above command by yourself (make sure that the emulator is running).\n');
          }
        } else {
          Logger.log(`\n${colors.red('Failed!')} Please download the latest version of Firefox from the below link.`);
          Logger.log('(Drag-and-drop the downloaded APK over the emulator screen to install.)');
          Logger.log(colors.cyan('  https://archive.mozilla.org/pub/fenix/releases'), '\n');
        }
      }

      if (downloadChromedriver) {
        const chromeMajorVersion = installedChromeVersion.split('.')[0];
        if (DEFAULT_CHROME_VERSIONS.includes(chromeMajorVersion)) {
          Logger.log('Downloading chromedriver to work with the factory version of Chrome browser...');

          const chromedriverDownloadLink = (DOWNLOADS.chromedriver as any)[chromeMajorVersion][this.platform];
          const result = await downloadWithProgressBar(
            chromedriverDownloadLink,
            chromedriverDownloadDir,
            true
          );

          if (result) {
            Logger.log(`${colors.green('Done!')} chromedriver downloaded at '${chromedriverDownloadPath}'\n`);
            status.setupChrome = true;
          } else {
            Logger.log(`\n${colors.red('Failed!')} You can download the chromedriver yourself from the below link:`);
            Logger.log(colors.cyan(`  ${chromedriverDownloadLink}`));
            Logger.log(
              '  (Extract and copy the chromedriver binary and paste it in your Nightwatch project inside \'chromedriver-mobile\' folder.)',
              '\n'
            );
          }

          if (status.setupChrome) {
            Logger.log('You can run your tests now on your Android Emulator\'s Chrome browser.\n');
          }
        } else if (installedChromeVersion === '') {
          Logger.log(colors.red(symbols().fail), 'chromedriver could not be downloaded (installed browser version unknown).\n');
        } else {
          Logger.log(boxen(
            colors.cyan('[CHROMEDRIVER]\n\n') +
            colors.red('Could not download chromedriver (installed Chrome version is different from the factory versions).\n\n') +
            'You can download chromedriver for the installed Chrome version from the below link:\n' +
            colors.cyan('  https://chromedriver.storage.googleapis.com/index.html\n\n') +
            'After downloading, extract the zip file, copy the extracted chromedriver binary, and put in inside \'chromedriver-mobile\' folder in your Nightwatch project.',
            {padding: 1}
          ), '\n');
        }
      }
    }

    if (!emulatorAlreadyRunning) {
      Logger.log('Closing emulator...');
      killEmulatorWithoutWait(this.sdkRoot, this.platform, emulatorId);
      Logger.log('Emulator will close shortly. If not, please close it manually.\n');
    }

    // below is true by default
    // will turn to false if some verify step has failed or chromedriver is needed to be downloaded
    // and for it to turn back to true, corresponding setup step should pass.
    // if chrome is not present, then we can't do anything but send out a warning/error.
    return (status.verifyFirefox || status.setupFirefox) && status.verifyChrome && (!downloadChromedriver || status.setupChrome);
  }

  postSetupInstructions(result: boolean, setupConfigs: SetupConfigs) {
    if (!this.options.setup) {
      if (result) {
        Logger.log(`${colors.green('Great!')} All the requirements are being met.`);

        if (this.options.standalone) {
          // Logs related to standalone mode to be added here.
        } else if (setupConfigs.mode === 'real') {
          Logger.log('You can go ahead and run your tests now on your Android device.\n');
        } else {
          Logger.log('You can go ahead and run your tests now on an Android device/emulator.\n');
        }
      } else {
        Logger.log(`Please use ${colors.magenta('--setup')} flag with the command to install all the missing requirements.\n`);
      }
    } else {
      if (result) {
        Logger.log(`${colors.green('Success!')} All requirements are set.`);

        if (this.options.standalone) {
          // Logs related to standalone mode to be added here.
        } else if (setupConfigs.mode === 'real') {
          Logger.log('You can go ahead and run your tests now on your Android device.\n');
        } else {
          Logger.log('You can go ahead and run your tests now on an Android device/emulator.\n');
        }
      } else {
        Logger.log(`${colors.red('Error:')} Some requirements failed to set up.`);
        Logger.log('Please look for the errors above and try running any failed commands by yourself and then re-run this tool.\n');

        Logger.log('If it still fails, please raise an issue with us at:');
        Logger.log(colors.cyan('  https://github.com/nightwatchjs/mobile-helper-tool/issues'), '\n');
      }
    }
  }

  envSetInstructions(sdkRootEnv: string) {
    Logger.log(colors.red('IMPORTANT'));
    Logger.log(colors.red('---------'));

    if (!sdkRootEnv) {
      // ANDROID_HOME is either undefined or '' in system env and .env.
      if (this.otherInfo.androidHomeInGlobalEnv) {
        // ANDROID_HOME is set in system env, to ''.
        Logger.log(`${colors.cyan('ANDROID_HOME')} env is set to '' which is NOT a valid path!\n`);
        Logger.log(`Please set ${colors.cyan('ANDROID_HOME')} to '${this.sdkRoot}' in your system environment variables.`);
        Logger.log('(As ANDROID_HOME is already set in system env, temporarily saving it to .env file won\'t work.)\n');
      } else {
        Logger.log(
          `${colors.cyan('ANDROID_HOME')} env was temporarily saved in ${colors.cyan(
            '.env'
          )} file (set to '${this.sdkRoot}').\n`
        );
        Logger.log(`Please set ${colors.cyan(
          'ANDROID_HOME'
        )} env to '${this.sdkRoot}' in your system environment variables and then delete it from ${colors.cyan('.env')} file.\n`);
      }
    }

    if (this.options.appium) {
      // JAVA_HOME env was not found and we set it ourselves in .env (javaHomeFound=null).
      // In case JAVA_HOME was found incorrect in system env (javaHomeFound=false),
      // process should have exited with error.
      Logger.log(
        `${colors.cyan('JAVA_HOME')} env was temporarily saved in ${colors.cyan(
          '.env'
        )} file (set to '${this.javaHome}').\n`
      );
      Logger.log(`Please set ${colors.cyan(
        'JAVA_HOME'
      )} env to '${this.javaHome}' in your system environment variables and then delete it from ${colors.cyan('.env')} file.\n`);
    }

    Logger.log('Following the above instructions might save you from future troubles.\n');

    this.envSetHelp();
  }

  envSetHelp() {
    // Add platform-wise help or link a doc to help users set env variable.
  }
}
