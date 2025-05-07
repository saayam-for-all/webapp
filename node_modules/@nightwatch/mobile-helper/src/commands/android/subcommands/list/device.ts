import colors from 'ansi-colors';

import Logger from '../../../../logger';
import {Platform} from '../../interfaces';
import ADB from '../../utils/appium-adb';
import {getBinaryLocation} from '../../utils/common';
import {showConnectedEmulators, showConnectedRealDevices, showMissingBinaryHelp} from '../common';

export async function listConnectedDevices(sdkRoot: string, platform: Platform): Promise<boolean> {
  const adbLocation = getBinaryLocation(sdkRoot, platform, 'adb', true);
  if (adbLocation === '') {
    showMissingBinaryHelp('adb');

    return false;
  }

  const adb = await ADB.createADB({allowOfflineDevices: true});
  const devices = await adb.getConnectedDevices();

  if (!devices.length) {
    Logger.log(colors.yellow('No connected devices found.\n'));

    return true;
  }

  await showConnectedRealDevices();
  await showConnectedEmulators();

  return true;
}
