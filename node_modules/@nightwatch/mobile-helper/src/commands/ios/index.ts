import {prompt} from 'inquirer';
import {Options, SetupConfigs, IosSetupResult} from './interfaces';
import {getPlatformName, iosRealDeviceUDID, symbols} from '../../utils';
import {AVAILABLE_OPTIONS, SETUP_CONFIG_QUES} from './constants';
import colors from 'ansi-colors';
import {execSync} from 'child_process';
import boxen from 'boxen';
import Logger from '../../logger';

export class IosSetup {
  options: Options;
  cwd: string;
  platform: 'windows' | 'mac' | 'linux';

  constructor(options: Options, cwd = process.cwd()) {
    this.options = options;
    this.cwd = cwd;
    this.platform = getPlatformName();
  }

  async run(): Promise<IosSetupResult | boolean> {
    let result: IosSetupResult | boolean = true;

    const allAvailableOptions = this.getAllAvailableOptions();
    const unknownOptions = Object.keys(this.options).filter((option) => !allAvailableOptions.includes(option));

    if (this.options.help || unknownOptions.length) {
      this.showHelp(unknownOptions);

      return this.options.help === true;
    }

    if (this.platform !== 'mac') {
      Logger.log('Only macOS is supported');

      return false;
    }

    const setupConfigs: SetupConfigs = await this.getSetupConfigs(this.options);

    const missingRequirements = this.verifySetup(setupConfigs);

    if (this.options.setup) {
      result = await this.setupIos(setupConfigs, missingRequirements);
    } else if (missingRequirements.length) {
      result = false;
    }

    return result;
  }

  getConfigFromOptions(options: { [key: string]: string | string[] | boolean }) {
    const configs: SetupConfigs = {};

    if (options.mode && typeof options.mode !== 'boolean') {
      const realMode = options.mode.includes('real');
      const simulatorMode = options.mode.includes('simulator');

      if (realMode && simulatorMode) {
        configs.mode = 'both';
      } else if (realMode) {
        configs.mode = 'real';
      } else if (simulatorMode) {
        configs.mode = 'simulator';
      }
    }

    return configs;
  }

  async getSetupConfigs(options: Options) {
    const configs = this.getConfigFromOptions(options);

    return await prompt(SETUP_CONFIG_QUES, configs);
  }

  verifySetup(setupConfigs: SetupConfigs): string[] {
    const missingRequirements: string[] = [];

    if (setupConfigs.mode === 'simulator' || setupConfigs.mode === 'both') {
      Logger.log('\nVerifying the setup requirements for simulators ...');

      try {
        execSync('/usr/bin/xcodebuild -version', {
          stdio: 'pipe'
        });
        Logger.log(`  ${colors.green(symbols().ok)} Xcode is installed in your machine\n`);

        Logger.log(boxen('Run the following command to get the list of simulators\n' +
          colors.cyan.italic('xcrun simctl list devices') + '\n' +
          `\nAnd then update ${colors.cyan('safari:deviceName')} (eg: 'iphone 13') and ${colors.cyan('safari:platformVersion')} (eg: '15.0') in nightwatch configuration for ${colors.gray.italic('ios.simulator.safari')} environment accordingly.`
        , {padding: 1}));
      } catch (error) {
        Logger.log(`  ${colors.red(symbols().ok)} Xcode is not installed.`);
        missingRequirements.push('Xcode is not installed');
      }
    }

    if (setupConfigs.mode === 'real' || setupConfigs.mode === 'both') {
      Logger.log('\nVerifying the setup requirements for real devices...');

      try {
        // eslint-disable-next-line
        const stdout = execSync("system_profiler SPUSBDataType | sed -n '/iPhone/,/Serial/p' | grep 'Serial Number:' | awk -F ': ' '{print $2}'", {
          stdio: 'pipe'
        });

        if (stdout.toString() !== '') {
          Logger.log(boxen(
            colors.white(`Update ${colors.cyan('UDID')} in nightwatch configuration for ${colors.gray.italic('ios.real.safari')} environment.`) +
            '\nUDID: ' +
            colors.cyan(iosRealDeviceUDID(stdout.toString())), {padding: 1}));
        } else {
          throw 'Device is not connected';
        }
      } catch (error) {
        Logger.log(`  ${colors.red(symbols().fail)} Device is either not connected or turned off.`);
        missingRequirements.push('Device is not connected');
      }
    }

    if (missingRequirements.length === 0) {

      Logger.log('\nGreat! All the requirements are being met.');

      if (setupConfigs.mode === 'real') {
        Logger.log('You can go ahead and run your tests now on your iOS device.');
      } else if (setupConfigs.mode === 'simulator') {
        Logger.log('You can go ahead and run your tests now on an iOS simulator.');
      } else {
        Logger.log('You can go ahead and run your tests now on an iOS device/simulator.');
      }
    } else if (!this.options.setup) {
      Logger.log(`\nSome requirements are missing: ${missingRequirements.join(', ')}`);
      Logger.log(`Please use ${colors.magenta('--setup')} flag with the command to install all the missing requirements.`);
    }

    return missingRequirements;
  }

  async setupIos(setupConfigs: SetupConfigs, missingRequirements: string[]) {
    if (missingRequirements.length === 0) {
      return true;
    }

    const result: IosSetupResult = {simulator: true, real: true};

    if (setupConfigs.mode === 'simulator' || setupConfigs.mode === 'both') {
      if (missingRequirements.includes('Xcode is not installed')) {
        Logger.log('\nSetting up missing requirements for iOS simulator...');

        Logger.log(boxen(`${colors.cyan('If Xcode is already installed : ')}` +
          `${colors.white('\n  1. Run the following after changing the Xcode app name in the command ')}` +
          `\n     ${colors.grey.italic('sudo xcode-select -switch /Applications/Xcode_x_x.app')}\n` +

          `${colors.cyan('\nIf Xcode is not installed : ')}` +
          `${colors.green('\n  [Easiest Option] : Download via the App Store for the latest version')}` +
          `${colors.white('\n      1. Open the App Store on your mac and Sign in with your Apple credentials')}` +
          `${colors.white('\n      2. Search for Xcode & click install or update. That\'s it!!')}\n` +
          `${colors.green('\n  [Preferred Option] : Download via the Developer site for a specific version')}` +
          `${colors.white(`\n      1. Navigate to this URL ${colors.grey.italic('https://developer.apple.com/download/more/')}`)}` +
          `${colors.white('\n      2. Sign in with your Apple credentials')}` +
          `${colors.white('\n      3. Type in the version that you like, and download the Xcode_x_x.xip file')}` +
          `${colors.white('\n      4. Once the file is downloaded, click on .xip to extract it.')}` +
          `${colors.white('\n      5. Now click on that Xcode file complete all the installation process')}` +
          `${colors.white('\n      6. After completion drag the Xcode to Applications folder')}`, {padding: 1}));

        Logger.log(`\nFollow the guide for more detailed info ${colors.magenta('https://www.freecodecamp.org/news/how-to-download-and-install-xcode/')}\n`);

        result.simulator = false;
      }
    }

    if (setupConfigs.mode === 'real' || setupConfigs.mode === 'both') {
      Logger.log('\nSetting up missing requirements for real devices...');

      let msg = colors.cyan('1. Remote Automation should be turned on your iOS device.') +
        colors.grey.italic('\n(turn it on via Settings → Safari → Advanced → Remote Automation.)');

      if (missingRequirements.includes('Device is not connected')) {
        msg += colors.cyan('\n\n2. Device is connected via data cable and turned on properly.');
        result.real = false;
      }
      Logger.log(boxen(msg, {padding: 1}));
    }

    return result;
  }

  showHelp(unknownOptions: string[]) {
    if (unknownOptions.length) {
      Logger.log(colors.red(`unknown option(s) passed: ${unknownOptions.join(', ')}\n`));
    }

    Logger.log(`Usage: ${colors.cyan('npx @nightwatch/mobile-helper ios [options]')}`);
    Logger.log('  Verify if all the requirements are met to run tests on an iOS device/simulator.\n');

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

  getAllAvailableOptions = () => {
    const mainOptions = Object.keys(AVAILABLE_OPTIONS);

    const allOptions: string[] = [];
    mainOptions.forEach((option) => allOptions.push(option, ...AVAILABLE_OPTIONS[option].alias));

    return allOptions;
  };
}