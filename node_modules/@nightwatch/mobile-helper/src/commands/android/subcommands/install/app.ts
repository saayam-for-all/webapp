import colors from 'ansi-colors';
import {existsSync} from 'fs';
import inquirer from 'inquirer';
import path from 'path';

import Logger from '../../../../logger';
import {Options, Platform} from '../../interfaces';
import ADB from '../../utils/appium-adb';
import {getBinaryLocation} from '../../utils/common';
import {execBinaryAsync} from '../../utils/sdk';
import {showMissingBinaryHelp} from '../common';
import untildify from 'untildify';

export async function installApp(options: Options, sdkRoot: string, platform: Platform): Promise<boolean> {
  try {
    const adbLocation = getBinaryLocation(sdkRoot, platform, 'adb', true);
    if (!adbLocation) {
      showMissingBinaryHelp('adb');

      return false;
    }

    const adb = await ADB.createADB({allowOfflineDevices: true});
    const devices = await adb.getConnectedDevices();

    if (!devices.length) {
      Logger.log(`${colors.red('No device found running.')} Please connect a device to install the APK.`);
      Logger.log(`Use ${colors.cyan('npx @nightwatch/mobile-helper android connect')} to connect to a device.\n`);

      return true;
    }

    if (options.deviceId) {
      // If device id is passed then check if the id is valid. If not then prompt user to select a device.
      const deviceConnected = devices.find(device => device.udid === options.deviceId);
      if (!deviceConnected) {
        Logger.log(colors.yellow(`No connected device found with deviceId '${options.deviceId}'.\n`));

        options.deviceId = '';
      }
    }

    if (!options.deviceId) {
      // if device id not found, or invalid device id is found, then prompt the user
      // to select a device from the list of running devices.
      const deviceAnswer = await inquirer.prompt({
        type: 'list',
        name: 'device',
        message: 'Select the device to install the APK:',
        choices: devices.map(device => device.udid)
      });
      options.deviceId = deviceAnswer.device;
    }

    if (!options.path) {
      // if path to APK is not provided, then prompt the user to enter the path.
      const apkPathAnswer = await inquirer.prompt({
        type: 'input',
        name: 'apkPath',
        message: 'Enter the path to the APK file:'
      });
      options.path = apkPathAnswer.apkPath;
    }

    Logger.log();

    options.path = path.resolve(process.cwd(), untildify(options.path as string));
    if (!existsSync(options.path)) {
      Logger.log(`${colors.red('No APK file found at: ' + options.path)}\nPlease provide a valid path to the APK file.\n`);

      return false;
    }

    Logger.log('Installing APK...');

    const installationStatus = await execBinaryAsync(adbLocation, 'adb', platform, `-s ${options.deviceId} install "${options.path}"`);
    if (installationStatus?.includes('Success')) {
      Logger.log(colors.green('APK installed successfully!\n'));

      return true;
    }

    handleError(installationStatus);

    return false;
  } catch (err) {
    handleError(err);

    return false;
  }
}

const handleError = (consoleOutput: any) => {
  Logger.log(colors.red('\nError while installing APK:'));

  let errorMessage = consoleOutput;
  if (consoleOutput.includes('INSTALL_FAILED_ALREADY_EXISTS') || consoleOutput.includes('INSTALL_FAILED_VERSION_DOWNGRADE')) {
    errorMessage = 'APK with the same package name already exists on the device.\n';
    errorMessage += colors.reset('\nPlease uninstall the app first from the device and then install again.\n');
    errorMessage += colors.reset(`To uninstall, use: ${colors.cyan('npx @nightwatch/mobile-helper android uninstall --app')}\n`);
  } else if (consoleOutput.includes('INSTALL_FAILED_OLDER_SDK')) {
    errorMessage = 'Target installation location (AVD/Real device) has older SDK version than the minimum requirement of the APK.\n';
  }

  Logger.log(colors.red(errorMessage));
};
