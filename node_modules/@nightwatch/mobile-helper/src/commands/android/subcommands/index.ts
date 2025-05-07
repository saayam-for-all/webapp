import colors from 'ansi-colors';
import * as dotenv from 'dotenv';
import path from 'path';

import Logger from '../../../logger';
import {getPlatformName} from '../../../utils';
import {AVAILABLE_SUBCOMMANDS} from '../constants';
import {Options, Platform} from '../interfaces';
import {checkJavaInstallation, getSdkRootFromEnv} from '../utils/common';
import {getSubcommandHelp} from './help';
import {connect} from './connect';
import {showHelp} from './help';
import {install} from './install';
import {list} from './list';
import {uninstall} from './uninstall';

export class AndroidSubcommand {
  sdkRoot: string;
  options: Options;
  subcommand: string;
  rootDir: string;
  platform: Platform;
  androidHomeInGlobalEnv: boolean;

  constructor(subcommand: string, options: Options, rootDir = process.cwd()) {
    this.sdkRoot = '';
    this.options = options;
    this.subcommand = subcommand;
    this.rootDir = rootDir;
    this.platform = getPlatformName();
    this.androidHomeInGlobalEnv = false;
  }

  async run(): Promise<boolean> {
    if (!Object.keys(AVAILABLE_SUBCOMMANDS).includes(this.subcommand)) {
      Logger.log(`${colors.red(`unknown subcommand passed: ${this.subcommand}`)}\n`);
      Logger.log(getSubcommandHelp());
      Logger.log(`For individual subcommand help, run: ${colors.cyan('npx @nightwatch/mobile-helper android SUBCOMMAND --help')}`);
      Logger.log(`For complete Android help, run: ${colors.cyan('npx @nightwatch/mobile-helper android --help')}\n`);

      return false;
    }

    if (this.options.help) {
      showHelp(this.subcommand);

      return true;
    }

    this.loadEnvFromDotEnv();

    const javaInstalled = checkJavaInstallation(this.rootDir);
    if (!javaInstalled) {
      return false;
    }

    const sdkRootEnv = getSdkRootFromEnv(this.rootDir, this.androidHomeInGlobalEnv);
    if (!sdkRootEnv) {
      Logger.log(`Run: ${colors.cyan('npx @nightwatch/mobile-helper android --standalone')} to fix this issue.`);
      Logger.log(`(Remove the ${colors.gray('--standalone')} flag from the above command if using the tool for testing.)\n`);

      return false;
    }
    this.sdkRoot = sdkRootEnv;

    return await this.executeSubcommand();
  }

  loadEnvFromDotEnv(): void {
    this.androidHomeInGlobalEnv = 'ANDROID_HOME' in process.env;

    dotenv.config({path: path.join(this.rootDir, '.env')});
  }

  async executeSubcommand(): Promise<boolean> {
    if (this.subcommand === 'connect') {
      return await connect(this.options, this.sdkRoot, this.platform);
    } else if (this.subcommand === 'install') {
      return await install(this.options, this.sdkRoot, this.platform);
    } else if (this.subcommand === 'list') {
      return await list(this.options, this.sdkRoot, this.platform);
    } else if (this.subcommand === 'uninstall') {
      return await uninstall(this.options, this.sdkRoot, this.platform);
    }

    return false;
  }
}

