import colors from 'ansi-colors';
import inquirer from 'inquirer';

import Logger from '../../../../logger';
import {Platform} from '../../interfaces';
import {getBinaryLocation} from '../../utils/common';
import {execBinarySync, spawnCommandSync} from '../../utils/sdk';
import {showMissingBinaryHelp} from '../common';
import {ConfigOptions} from '../interfaces';

export async function connectAVD(options: ConfigOptions, sdkRoot: string, platform: Platform): Promise<boolean> {
  try {
    const avdmanagerLocation = getBinaryLocation(sdkRoot, platform, 'avdmanager', true);
    if (avdmanagerLocation === '') {
      showMissingBinaryHelp('avdmanager');

      return false;
    }

    const emulatorLocation = getBinaryLocation(sdkRoot, platform, 'emulator', true);
    if (emulatorLocation === '') {
      showMissingBinaryHelp('emulator');

      return false;
    }

    const installedAvds = execBinarySync(avdmanagerLocation, 'avdmanager', platform, 'list avd -c');
    if (installedAvds === null) {
      Logger.log(`${colors.red('\nFailed to fetch installed AVDs.')} Please try again.\n`);

      return false;
    } else if (installedAvds === '') {
      Logger.log(`${colors.yellow('No installed AVD found.')}\n`);
      Logger.log('To see the list of installed AVDs, run the following command:');
      Logger.log(colors.cyan('  npx @nightwatch/mobile-helper android list --avd\n'));

      return false;
    }

    const installedAVDList = installedAvds.split('\n').filter(avd => avd !== '');

    let userSuppliedAVD = '';
    if (typeof options.avd === 'string') {
      userSuppliedAVD = options.avd;

      if (!installedAVDList.includes(userSuppliedAVD)) {
        Logger.log(colors.yellow(`AVD '${userSuppliedAVD}' not found!\n`));
        userSuppliedAVD = '';
      }
    } else if (Array.isArray(options.avd)) {
      Logger.log(colors.yellow('Only one AVD can be connected at a time.\n'));
    }

    if (!userSuppliedAVD) {
      const avdAnswer = await inquirer.prompt({
        type: 'list',
        name: 'avdName',
        message: 'Select the AVD to connect:',
        choices: installedAVDList
      });
      userSuppliedAVD = avdAnswer.avdName;
    }

    Logger.log();
    Logger.log(`Connecting to AVD: ${colors.cyan(userSuppliedAVD)}\n`);

    return spawnCommandSync(emulatorLocation, 'emulator', platform, [`@${userSuppliedAVD}`]);
  } catch (error) {
    Logger.log(colors.red('\nError occurred while launching AVD.'));
    console.error(error);

    return false;
  }
}
