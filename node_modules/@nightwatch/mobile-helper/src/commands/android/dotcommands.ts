import colors from 'ansi-colors';
import * as dotenv from 'dotenv';
import path from 'path';

import {ANDROID_DOTCOMMANDS} from '../../constants';
import Logger from '../../logger';
import {getPlatformName} from '../../utils';
import {Platform, SdkBinary} from './interfaces';
import {showMissingBinaryHelp} from './subcommands/common';
import {checkJavaInstallation, getBinaryLocation, getSdkRootFromEnv} from './utils/common';
import {spawnCommandSync} from './utils/sdk';

export class AndroidDotCommand {
  dotcmd: string;
  args: string[];
  sdkRoot: string;
  rootDir: string;
  platform: Platform;
  androidHomeInGlobalEnv: boolean;

  constructor(dotcmd: string, argv: string[], rootDir = process.cwd()) {
    this.dotcmd = dotcmd;
    this.args = argv.slice(1);
    this.sdkRoot = '';
    this.rootDir = rootDir;
    this.platform = getPlatformName();
    this.androidHomeInGlobalEnv = false;
  }

  async run(): Promise<boolean> {
    if (!ANDROID_DOTCOMMANDS.includes(this.dotcmd)) {
      Logger.log(colors.red(`Unknown dot command passed: ${this.dotcmd}\n`));

      Logger.log('Run Android SDK command line tools using the following command:');
      Logger.log(colors.cyan('npx @nightwatch/mobile-helper <DOTCMD> [options|args]\n'));

      Logger.log(`Available Dot Commands: ${colors.magenta(ANDROID_DOTCOMMANDS.join(', '))}`);
      Logger.log(`(Example command: ${colors.gray('npx @nightwatch/mobile-helper android.emulator @nightwatch-android-11')})\n`);

      return false;
    }

    const javaInstalled = checkJavaInstallation(this.rootDir);
    if (!javaInstalled) {
      return false;
    }

    this.loadEnvFromDotEnv();

    const sdkRootEnv = getSdkRootFromEnv(this.rootDir, this.androidHomeInGlobalEnv);
    if (!sdkRootEnv) {
      Logger.log(`Run: ${colors.cyan('npx @nightwatch/mobile-helper android --standalone')} to fix this issue.`);
      Logger.log(`(Remove the ${colors.gray('--standalone')} flag from the above command if using the tool for testing.)\n`);

      return false;
    }
    this.sdkRoot = sdkRootEnv;

    const binaryName = this.dotcmd.split('.')[1] as SdkBinary;
    const binaryLocation = getBinaryLocation(this.sdkRoot, this.platform, binaryName, true);
    if (!binaryLocation) {
      showMissingBinaryHelp(binaryName);

      return false;
    }

    return spawnCommandSync(binaryLocation, binaryName, this.platform, this.args);
  }

  loadEnvFromDotEnv(): void {
    this.androidHomeInGlobalEnv = 'ANDROID_HOME' in process.env;
    dotenv.config({path: path.join(this.rootDir, '.env')});
  }
}
