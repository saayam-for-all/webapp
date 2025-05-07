import inquirer from 'inquirer';

import Logger from '../../../../logger';
import {Options, Platform} from '../../interfaces';
import {verifyOptions} from '../common';
import {uninstallApp} from './app';
import {deleteAvd} from './avd';
import {deleteSystemImage} from './system-image';

export async function uninstall(options: Options, sdkRoot: string, platform: Platform): Promise<boolean> {
  const optionsVerified = verifyOptions('uninstall', options);
  if (!optionsVerified) {
    return false;
  }

  let subcommandFlag = optionsVerified.subcommandFlag;
  if (subcommandFlag === '') {
    subcommandFlag = await promptForFlag();
  }

  if (subcommandFlag === 'app') {
    return await uninstallApp(options, sdkRoot, platform);
  } else if (subcommandFlag === 'avd') {
    return await deleteAvd(sdkRoot, platform);
  } else if (subcommandFlag === 'system-image') {
    return await deleteSystemImage(sdkRoot, platform);
  }

  return false;
}

async function promptForFlag(): Promise<string> {
  const flagAnswer = await inquirer.prompt({
    type: 'list',
    name: 'flag',
    message: 'Select what you want to uninstall:',
    choices: [
      {name: 'Android app', value: 'app'},
      {name: 'Android Virtual Device (AVD)', value: 'avd'},
      {name: 'System image', value: 'system-image'}
    ]
  });
  Logger.log();

  return flagAnswer.flag;
}

