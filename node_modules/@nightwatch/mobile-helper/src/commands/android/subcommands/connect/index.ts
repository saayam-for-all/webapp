import inquirer from 'inquirer';

import Logger from '../../../../logger';
import {Options, Platform} from '../../interfaces';
import {verifyOptions, showConnectedRealDevices, showConnectedEmulators} from '../common';
import {connectAVD} from './emulator';
import {connectWirelessAdb} from './wireless';

export async function connect(options: Options, sdkRoot: string, platform: Platform): Promise<boolean> {
  const verifyResult = verifyOptions('connect', options);
  if (!verifyResult) {
    return false;
  }

  let subcommandFlag = verifyResult.subcommandFlag;
  if (subcommandFlag === '') {
    await showConnectedRealDevices();
    await showConnectedEmulators();

    subcommandFlag = await promptForFlag();
  } else if (subcommandFlag === 'wireless') {
    await showConnectedRealDevices();
  } else if (subcommandFlag === 'emulator') {
    await showConnectedEmulators();
  }

  if (subcommandFlag === 'wireless') {
    return await connectWirelessAdb(sdkRoot, platform);
  } else if (subcommandFlag === 'emulator') {
    return await connectAVD(options, sdkRoot, platform);
  }

  return false;
}

async function promptForFlag(): Promise<string> {
  const flagAnswer = await inquirer.prompt({
    type: 'list',
    name: 'flag',
    message: 'Select the device to connect to:',
    choices: [
      {name: 'Real device', value: 'wireless'},
      {name: 'Emulator', value: 'emulator'}
    ]
  });
  Logger.log();

  return flagAnswer.flag;
}
