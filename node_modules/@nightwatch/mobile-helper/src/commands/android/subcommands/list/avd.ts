import colors from 'ansi-colors';

import Logger from '../../../../logger';
import {Platform} from '../../interfaces';
import {getBinaryLocation} from '../../utils/common';
import {execBinarySync} from '../../utils/sdk';
import {showMissingBinaryHelp} from '../common';

export async function listInstalledAVDs(sdkRoot: string, platform: Platform): Promise<boolean> {
  try {
    const avdmanagerLocation = getBinaryLocation(sdkRoot, platform, 'avdmanager', true);
    if (!avdmanagerLocation) {
      showMissingBinaryHelp('avdmanager');

      return false;
    }

    const installedAVDs = execBinarySync(avdmanagerLocation, 'avd', platform, 'list avd');
    if (!installedAVDs) {
      Logger.log(`\n${colors.red('Failed to list installed AVDs!')} Please try again.`);

      return false;
    }

    if (installedAVDs.split('\n').length < 3) {
      Logger.log(colors.red('No installed AVDs found!'));
    } else {
      Logger.log(installedAVDs);
    }

    return true;
  } catch (err) {
    Logger.log(colors.red('Error occurred while listing installed AVDs.'));
    console.error(err);

    return false;
  }
}
