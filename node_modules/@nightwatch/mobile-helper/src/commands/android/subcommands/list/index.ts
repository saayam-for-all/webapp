import inquirer from 'inquirer';

import Logger from '../../../../logger';
import {Options, Platform} from '../../interfaces';
import {verifyOptions} from '../common';
import {listInstalledAVDs} from './avd';
import {listConnectedDevices} from './device';

export async function list(options: Options, sdkRoot: string, platform: Platform): Promise<boolean> {
  const optionsVerified = verifyOptions('list', options);
  if (!optionsVerified) {
    return false;
  }

  let subcommandFlag = optionsVerified.subcommandFlag;
  if (subcommandFlag === '') {
    subcommandFlag = await promptForFlag();
  }

  if (subcommandFlag === 'avd') {
    return await listInstalledAVDs(sdkRoot, platform);
  } else if (subcommandFlag === 'device') {
    return await listConnectedDevices(sdkRoot, platform);
  }

  return false;
}

async function promptForFlag(): Promise<string> {
  const flagAnswer = await inquirer.prompt({
    type: 'list',
    name: 'flag',
    message: 'Select what do you want to list:',
    choices: ['Connected devices', 'Installed AVDs']
  });
  Logger.log();

  const flag = flagAnswer.flag;
  if (flag === 'Connected devices') {
    return 'device';
  }

  return 'avd';
}
