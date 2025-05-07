import colors from 'ansi-colors';
import minimist from 'minimist';

import {AndroidSetup} from './commands/android/androidSetup';
import {AVAILABLE_COMMANDS} from './constants';
import {IosSetup} from './commands/ios';
import {handleAndroidCommand} from './commands/android';

export const run = () => {
  try {
    const argv = process.argv.slice(2);
    const {_: args, ...options} = minimist(argv, {
      boolean: ['install', 'setup', 'help', 'appium', 'standalone'],
      alias: {
        help: 'h',
        mode: 'm',
        browsers: ['b', 'browser'],
        setup: ['install', 'i']
      }
    });

    if (!args[0]) {
      if (!options.help) {
        // Show error message if help flag is not present.
        console.log(`${colors.red('No command passed.')}\n`);
      }
      showHelp();
    } else if (args[0].split('.')[0] === 'android') {
      handleAndroidCommand(args, options, argv);
    } else if (args[0] === 'ios') {
      if (args.length > 1) {
        // ios command does not accept subcommands.
        console.log(`${colors.red(`Too many arguments passed for 'ios' command: ${args.slice(1).join(', ')}`)}\n`);
        console.log(`Run: ${colors.cyan('npx @nightwatch/mobile-helper ios --help')} to get help for 'ios' command.`);
      } else {
        const iOSSetup = new IosSetup(options);
        iOSSetup.run();
      }
    } else {
      console.log(`${colors.red(`Unknown command passed: ${args[0]}`)}\n`);
      showHelp();
    }
  } catch (err) {
    console.error(err as string);
    process.exit(1);
  }
};

const showHelp = () => {
  console.log(`Usage: ${colors.cyan('npx @nightwatch/mobile-helper COMMAND [options|args]')}\n`);

  console.log(`Available commands: ${colors.green(AVAILABLE_COMMANDS.join(', '))}\n`);
  console.log(`To know more about each command, run:
  ${colors.cyan('npx @nightwatch/mobile-helper COMMAND --help')}`);
};

export {AndroidSetup, IosSetup};
export * from './commands/android/adb';
export {getBinaryNameForOS, getBinaryLocation} from './commands/android/utils/common';
export {execBinarySync} from './commands/android/utils/sdk';
export {getPlatformName} from './utils';
