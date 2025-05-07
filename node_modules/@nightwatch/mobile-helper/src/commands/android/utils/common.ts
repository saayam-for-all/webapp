import colors from 'ansi-colors';
import axios, {AxiosResponse} from 'axios';
import {execSync} from 'child_process';
import cliProgress from 'cli-progress';
import fs from 'fs';
import os from 'os';
import path from 'path';
import untildify from 'untildify';
import which from 'which';

import Logger from '../../../logger';
import {symbols} from '../../../utils';
import {
  ABI, AVAILABLE_OPTIONS, DEFAULT_CHROME_VERSIONS, DEFAULT_FIREFOX_VERSION, SDK_BINARY_LOCATIONS
} from '../constants';
import {Platform, SdkBinary} from '../interfaces';

export const getAllAvailableOptions = () => {
  const mainOptions = Object.keys(AVAILABLE_OPTIONS);

  const allOptions: string[] = [];
  mainOptions.forEach((option) => allOptions.push(option, ...AVAILABLE_OPTIONS[option].alias));

  return allOptions;
};

export const getBinaryNameForOS = (platform: Platform, binaryName: string) => {
  if (platform !== 'windows') {
    return binaryName;
  }

  if (['sdkmanager', 'avdmanager', 'apksigner'].includes(binaryName)) {
    return `${binaryName}.bat`;
  }

  if (!path.extname(binaryName)) {
    return `${binaryName}.exe`;
  }

  return binaryName;
};

export const getBinaryLocation = (
  sdkRoot: string, platform: Platform, binaryName: SdkBinary, suppressOutput = false
): string => {
  const failLocations: string[] = [];

  const binaryFullName = getBinaryNameForOS(platform, binaryName);

  const pathToBinary = path.join(sdkRoot, SDK_BINARY_LOCATIONS[binaryName], binaryFullName);
  if (fs.existsSync(pathToBinary)) {
    if (!suppressOutput) {
      console.log(
        `  ${colors.green(symbols().ok)} ${colors.cyan(binaryName)} binary is present at '${pathToBinary}'`
      );
    }

    return pathToBinary;
  }
  failLocations.push(pathToBinary);

  if (binaryName === 'adb') {
    // look for adb in sdkRoot (as it is a standalone binary).
    const adbPath = path.join(sdkRoot, binaryFullName);
    if (fs.existsSync(adbPath)) {
      if (!suppressOutput) {
        console.log(
          `  ${colors.green(symbols().ok)} ${colors.cyan(binaryName)} binary is present at '${adbPath}'`
        );
      }

      return adbPath;
    }
    failLocations.push(adbPath);

    // Look for adb in PATH also (runnable as `adb --version`)
    const adbLocation = which.sync(binaryFullName, {nothrow: true});
    if (adbLocation) {
      if (!suppressOutput) {
        console.log(
          `  ${colors.green(symbols().ok)} ${colors.cyan(binaryName)} binary is present at '${adbPath}' which is added in 'PATH'`
        );
      }

      return 'PATH';
    }
    failLocations.push('PATH');
  }

  if (!suppressOutput) {
    for (const location of failLocations) {
      console.log(
        `  ${colors.red(symbols().fail)} ${colors.cyan(binaryName)} binary not present at '${location}'`
      );
    }
  }

  return '';
};

export const downloadWithProgressBar = async (url: string, dest: string, extract = false) => {
  const {default: download} = await import('download');

  const progressBar = new cliProgress.Bar({
    format: ' [{bar}] {percentage}% | ETA: {eta}s'
  }, cliProgress.Presets.shades_classic);

  try {
    const stream = download(url, dest, {
      extract
    });
    progressBar.start(100, 0);

    await stream.on('downloadProgress', function(progress: {percent: number}) {
      progressBar.update(progress.percent*100);
    });
    progressBar.stop();

    return true;
  } catch {
    progressBar.stop();

    return false;
  }
};

export const getLatestVersion = async (browser: 'firefox' | 'chrome'): Promise<string> => {
  if (browser === 'firefox') {
    try {
      const {data}: AxiosResponse<{tag_name: string}> = await axios('https://api.github.com/repos/mozilla-mobile/fenix/releases/latest');

      return data['tag_name'].slice(1);
    } catch {
      return DEFAULT_FIREFOX_VERSION;
    }
  } else {
    return DEFAULT_CHROME_VERSIONS[1];
  }
};

export const getFirefoxApkName = (version: string) => {
  return `fenix-${version}.multi.android-${ABI}.apk`;
};

export const downloadFirefoxAndroid = async (version: string) => {
  if (!version) {
    version = await getLatestVersion('firefox');
  }

  const tempdir = os.tmpdir();

  const apkName = getFirefoxApkName(version);
  if (fs.existsSync(path.join(tempdir, apkName))) {
    console.log(`  ${colors.green(symbols().ok)} APK already downloaded.`);

    return true;
  }

  const apkDownloadUrl = `https://archive.mozilla.org/pub/fenix/releases/${version}/android/fenix-${version}-android-${ABI}/${apkName}`;

  return await downloadWithProgressBar(apkDownloadUrl, tempdir);
};

export const getSdkRootFromEnv = (cwd: string, androidHomeInGlobalEnv: boolean): string => {
  Logger.log('Checking the value of ANDROID_HOME environment variable...');

  const androidHome = process.env.ANDROID_HOME;
  const fromDotEnv = androidHomeInGlobalEnv ? '' : ' (taken from .env)';

  if (androidHome) {
    const androidHomeFinal = untildify(androidHome);

    const androidHomeAbsolute = path.resolve(cwd, androidHomeFinal);
    if (androidHomeFinal !== androidHomeAbsolute) {
      Logger.log(`  ${colors.yellow('!')} ANDROID_HOME is set to '${androidHomeFinal}'${fromDotEnv} which is NOT an absolute path.`);
      Logger.log(`  ${colors.green(symbols().ok)} Considering ANDROID_HOME to be '${androidHomeAbsolute}'\n`);

      return androidHomeAbsolute;
    }

    Logger.log(`  ${colors.green(symbols().ok)} ANDROID_HOME is set to '${androidHomeFinal}'${fromDotEnv}\n`);

    return androidHomeFinal;
  }

  if (androidHome === undefined) {
    Logger.log(
      `  ${colors.red(symbols().fail)} ANDROID_HOME environment variable is NOT set!\n`
    );
  } else {
    Logger.log(
      `  ${colors.red(symbols().fail)} ANDROID_HOME is set to '${androidHome}'${fromDotEnv} which is NOT a valid path!\n`
    );
  }

  return '';
};

export const checkJavaInstallation = (cwd: string): boolean => {
  try {
    execSync('java -version', {
      stdio: 'pipe',
      cwd: cwd
    });

    return true;
  } catch {
    Logger.log(`${colors.red('Error:')} Java Development Kit v9 or above is required to work with Android SDKs. Download from here:`);
    Logger.log(colors.cyan('  https://www.oracle.com/java/technologies/downloads/'), '\n');

    Logger.log(`Make sure Java is installed by running ${colors.green('java -version')} command and then re-run this tool.\n`);

    return false;
  }
};
