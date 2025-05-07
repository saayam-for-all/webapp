import colors from 'ansi-colors';
import inquirer from 'inquirer';

import Logger from '../../../../logger';
import {Platform} from '../../interfaces';
import {getBinaryLocation} from '../../utils/common';
import {execBinaryAsync, execBinarySync} from '../../utils/sdk';
import {getInstalledSystemImages, showMissingBinaryHelp} from '../common';

const DEVICE_TYPES = [
  {name: 'Nexus', value: 'Nexus'},
  {name: 'Pixel', value: 'pixel'},
  {name: 'Wear OS', value: 'wear'},
  {name: 'Android TV', value: 'tv'},
  {name: 'Desktop', value: 'desktop'},
  {name: 'Others', value: 'Others'}
];

export async function createAvd(sdkRoot: string, platform: Platform): Promise<boolean> {
  try {
    const avdmanagerLocation = getBinaryLocation(sdkRoot, platform, 'avdmanager', true);
    if (!avdmanagerLocation) {
      showMissingBinaryHelp('avdmanager');

      return false;
    }

    const sdkmanagerLocation = getBinaryLocation(sdkRoot, platform, 'sdkmanager', true);
    if (!sdkmanagerLocation) {
      showMissingBinaryHelp('sdkmanager');

      return false;
    }

    const avdNameAnswer = await inquirer.prompt({
      type: 'input',
      name: 'avdName',
      message: 'Enter a name for the AVD:'
    });
    const avdName = avdNameAnswer.avdName || 'my_avd';

    const installedSystemImages = await getInstalledSystemImages(sdkmanagerLocation, platform);
    if (!installedSystemImages) {
      return false;
    }
    if (!installedSystemImages.length) {
      Logger.log(colors.red('\nNo installed system images were found!'));
      Logger.log(`Run: ${colors.cyan('npx @nightwatch/mobile-helper android install --system-image')} to install a new system image.`);

      return false;
    }

    const systemImageAnswer = await inquirer.prompt({
      type: 'list',
      name: 'systemImage',
      message: 'Select the system image to use for AVD:',
      choices: installedSystemImages
    });
    const systemImage = systemImageAnswer.systemImage;

    const deviceTypeAnswer = await inquirer.prompt({
      type: 'list',
      name: 'deviceType',
      message: 'Select the device type for AVD:',
      choices: DEVICE_TYPES
    });
    const deviceType = deviceTypeAnswer.deviceType;

    let cmd = 'list devices -c';
    const availableDeviceProfiles = execBinarySync(avdmanagerLocation, 'avdmanager', platform, cmd);
    if (!availableDeviceProfiles) {
      Logger.log(colors.red('\nSomething went wrong while retrieving available device profiles.'),  'Please try again.');

      return false;
    }

    const deviceTypeValues = DEVICE_TYPES.map(deviceType => deviceType.value);
    const matchingDeviceProfiles = availableDeviceProfiles
      .split('\n')
      .filter(line => line !== '')
      .filter(deviceProfile => {
        if (deviceType === 'Others') {
          return !deviceTypeValues.some(deviceTypeValue => deviceProfile.includes(deviceTypeValue));
        } else {
          return deviceProfile.includes(deviceType);
        }
      });


    if (!matchingDeviceProfiles.length) {
      Logger.log(colors.red(`\nNo potential device profile found for device type "${deviceType}".`),  'Please try again.');

      return false;
    }

    const deviceAnswer = await inquirer.prompt({
      type: 'list',
      name: 'deviceProfile',
      message: 'Select the device profile for AVD:',
      choices: matchingDeviceProfiles
    });
    const deviceProfile = deviceAnswer.deviceProfile;

    Logger.log();
    Logger.log('Creating AVD...\n');

    cmd = `create avd -n '${avdName}' -k '${systemImage}' -d '${deviceProfile}'`;
    let createAVDStatus = false;

    try {
      createAVDStatus = await executeCreateAvdCommand(cmd, avdmanagerLocation, platform, avdName);
    } catch (err) {
      if (typeof err === 'string' && err.includes('already exists')) {
        // AVD with the same name already exists. Ask user if they want to overwrite it.
        Logger.log(`\n${colors.yellow('AVD with the same name already exists!')}\n`);
        const overwriteAnswer = await inquirer.prompt({
          type: 'confirm',
          name: 'overwrite',
          message: 'Overwrite the existing AVD?'
        });
        Logger.log();

        if (overwriteAnswer.overwrite) {
          cmd += ' --force';
          createAVDStatus = await executeCreateAvdCommand(cmd, avdmanagerLocation, platform, avdName);
        }
      } else {
        handleError(err);
      }
    }

    return createAVDStatus;
  } catch (err) {
    handleError(err);

    return false;
  }
}

async function executeCreateAvdCommand(cmd: string, avdmanagerLocation: string, platform: Platform, avdName: string): Promise<boolean> {
  const output = await execBinaryAsync(avdmanagerLocation, 'avdmanager', platform, cmd);

  if (output?.includes('100% Fetch remote repository')) {
    Logger.log(colors.green('AVD created successfully!\n'));
    Logger.log(`Run ${colors.cyan(`npx @nightwatch/mobile-helper android connect --emulator --avd ${avdName}`)} to launch the AVD.\n`);

    return true;
  }

  Logger.log(colors.red('Something went wrong while creating AVD!'));
  Logger.log('Command output:', output);
  Logger.log(`Please run ${colors.cyan(`npx @nightwatch/mobile-helper android connect --emulator --avd ${avdName}`)} to verify AVD creation.`);
  Logger.log('If AVD does not launch, please try creating the AVD again.\n');

  return false;
}

function handleError(err: any) {
  Logger.log(colors.red('\nError occurred while creating AVD!'));
  console.error(err);
}

