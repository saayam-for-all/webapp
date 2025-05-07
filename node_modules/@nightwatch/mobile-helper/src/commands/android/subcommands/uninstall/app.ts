import colors from 'ansi-colors';
import inquirer from 'inquirer';

import Logger from '../../../../logger';
import {Options, Platform} from '../../interfaces';
import ADB from '../../utils/appium-adb';
import {getBinaryLocation} from '../../utils/common';
import {execBinaryAsync, execBinarySync} from '../../utils/sdk';
import {showMissingBinaryHelp} from '../common';

export async function uninstallApp(options: Options, sdkRoot: string, platform: Platform): Promise<boolean> {
  try {
    const adbLocation = getBinaryLocation(sdkRoot, platform, 'adb', true);
    if (!adbLocation) {
      showMissingBinaryHelp('adb');

      return false;
    }

    const adb = await ADB.createADB({allowOfflineDevices: true});
    const devices = await adb.getConnectedDevices();

    if (!devices.length) {
      Logger.log(`${colors.red('No device found running.')} Please connect the device to uninstall the app from.\n`);

      return true;
    }

    if (options.deviceId) {
      // If device id is passed then check if the id is valid. If not then prompt user to select a device.
      const deviceConnected = devices.find(device => device.udid === options.deviceId);
      if (!deviceConnected) {
        Logger.log(colors.yellow(`No connected device found with deviceId '${options.deviceId}'.\n`));

        options.deviceId = '';
      }
    } else if (devices.length === 1) {
      options.deviceId = devices[0].udid;
    }

    if (!options.deviceId) {
      // if device id not found, or invalid device id is found, then prompt the user
      // to select a device from the list of running devices.
      const deviceAnswer = await inquirer.prompt({
        type: 'list',
        name: 'device',
        message: 'Select the device to uninstall the APK from:',
        choices: devices.map(device => device.udid)
      });
      options.deviceId = deviceAnswer.device;
    }

    const appNameAnswer = await inquirer.prompt({
      type: 'input',
      name: 'appName',
      message: `Name of the app to uninstall from device '${options.deviceId}':`
    });
    const appName = appNameAnswer.appName;

    const packageNames = execBinarySync(adbLocation, 'adb', platform, `-s ${options.deviceId} shell pm list packages '${appName}'`);
    if (!packageNames) {
      Logger.log();
      Logger.log(`${colors.red(`No package found with name '${appName}'!`)} Please try again.\n`);

      return false;
    }

    const packagesList: string[] = [];
    // Name of a package is in the format 'package:com.example.app'
    packageNames.split('\n').forEach(line => {
      if (line.includes('package:')) {
        packagesList.push(line.split(':')[1].trim());
      }
    });

    let packageName = packagesList[0];
    if (packagesList.length > 1) {
      const packageNameAnswer = await inquirer.prompt({
        type: 'list',
        name: 'packageName',
        message: 'Select the package you want to uninstall:',
        choices: packagesList
      });
      packageName = packageNameAnswer.packageName;
    }

    const uninstallationConfirmation = await inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to uninstall ${colors.cyan(packageName)}`
    });

    Logger.log();

    if (!uninstallationConfirmation.confirm) {
      Logger.log('Uninstallation cancelled.\n');

      return false;
    }

    Logger.log(`Uninstalling ${colors.cyan(packageName)}...\n`);

    const uninstallationStatus = await execBinaryAsync(adbLocation, 'adb', platform, `-s ${options.deviceId} uninstall ${packageName}`);
    if (uninstallationStatus?.includes('Success')) {
      Logger.log(`${colors.green('App uninstalled successfully!')}\n`);

      return true;
    }

    Logger.log(colors.red('Something went wrong while uninstalling app.'));
    Logger.log('Command output:', uninstallationStatus);
    Logger.log('Please check the output above and try again.');

    return false;
  } catch (error) {
    Logger.log(colors.red('\nError occurred while uninstalling app.'));
    console.error(error);

    return false;
  }
}

