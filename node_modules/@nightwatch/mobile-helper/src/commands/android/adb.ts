import colors from 'ansi-colors';
import {exec} from 'child_process';
import path from 'path';

import {symbols} from '../../utils';
import {Platform} from './interfaces';
import ADB from './utils/appium-adb';
import {getBinaryLocation} from './utils/common';
import {execBinarySync} from './utils/sdk';


export const waitForBootUp = (sdkRoot: string, platform: Platform, udid: string) => {
  console.log('Waiting for emulator to boot up...');
  const bootUpStdout = execBinarySync(
    getBinaryLocation(sdkRoot, platform, 'adb', true),
    'adb',
    platform,
    `-s ${udid} wait-for-local-device`
  );

  if (bootUpStdout !== null) {
    console.log(`  ${colors.green(symbols().ok)} Boot up complete!\n`);

    return true;
  } else {
    console.log('Failed to get the status of boot up!\n');

    return false;
  }
};

export const getAlreadyRunningAvd = async (sdkRoot: string, platform: Platform, avdName: string) => {
  console.log('Checking if AVD is already running...');

  const appiumAdb = await ADB.createADB({allowOfflineDevices: true});

  try {
    const avdAlreadyRunning = await appiumAdb.getRunningAVD(avdName);
    if (avdAlreadyRunning) {
      console.log(`  ${colors.green(symbols().ok)} '${avdName}' AVD already found running!\n`);
      if (avdAlreadyRunning.state !== 'device') {
        const bootUpComplete = waitForBootUp(sdkRoot, platform, avdAlreadyRunning.udid);
        if (!bootUpComplete) {
          return null;
        }
      }

      console.log('Ensuring AVD is ready to accept further commands...');
      try {
        await appiumAdb.waitForEmulatorReady(60000);
        console.log(`  ${colors.green(symbols().ok)} AVD is ready!\n`);
      } catch (err) {
        console.log(`  ${colors.red(symbols().fail)} ${err}\n`);

        return null;
      }

      return avdAlreadyRunning.udid;
    } else {
      console.log(`  ${colors.yellow('!')} '${avdName}' AVD not found running!\n`);
    }
  } catch {
    console.log(`  ${colors.red(symbols().fail)} Failed to find running AVDs.\n`);
  }

  return null;
};

export const launchAVD = async (sdkRoot: string, platform: Platform, avdName: string) => {
  // Kill AVD if already present.
  const appiumAdb = await ADB.createADB({allowOfflineDevices: true});

  try {
    const avdAlreadyRunning = await appiumAdb.getRunningAVD(avdName);
    if (avdAlreadyRunning) {
      console.log('Killing already running AVD...');

      try {
        await appiumAdb.killEmulator(avdName);
        console.log(`  ${colors.green(symbols().ok)} AVD killed successfully!\n`);
      } catch {
        console.log(`  ${colors.red(symbols().fail)} Failed to kill the already running AVD!`);
        console.log('Please close the AVD and re-run the command.\n');

        return null;
      }
    }
    // eslint-disable-next-line
  } catch {}

  console.log(`Launching emulator with '${avdName}' AVD...`);

  const emuLocation = getBinaryLocation(sdkRoot, platform, 'emulator', true);
  const emuFullName = path.basename(emuLocation);
  const emuDirPath = path.dirname(emuLocation);

  let cmd: string;

  if (platform === 'windows') {
    cmd = `${emuFullName} @${avdName} -delay-adb`;
  } else {
    cmd = `./${emuFullName} @${avdName} -delay-adb`;
  }

  exec(cmd, {
    cwd: emuDirPath
  });

  try {
    const avdRunning = await appiumAdb.getRunningAVDWithRetry(avdName);
    if (avdRunning) {
      console.log(`  ${colors.green(symbols().ok)} '${avdName}' AVD launched!\n`);
      const bootUpComplete = waitForBootUp(sdkRoot, platform, avdRunning.udid);

      if (bootUpComplete) {
        return avdRunning.udid;
      } else {
        return null;
      }
    } else {
      console.log(`  ${colors.red(symbols().fail)} Failed to launch AVD! Exiting...\n`);

      return null;
    }
  } catch {
    console.log('Failed to get the status of AVD launch. Exiting...\n');
  }

  return null;
};

export const killEmulatorWithoutWait = (sdkRoot: string, platform: Platform, emulatorId?: string) => {
  const emulatorIdFlag = emulatorId ? `-s ${emulatorId} ` : '';

  execBinarySync(
    getBinaryLocation(sdkRoot, platform, 'adb', true),
    'adb',
    platform,
    `${emulatorIdFlag}emu kill`
  );
};
