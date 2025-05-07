import colors from 'ansi-colors';

import Logger from '../../../logger';
import {symbols} from '../../../utils';
import {AVAILABLE_SUBCOMMANDS} from '../constants';
import {Platform, Options, SdkBinary} from '../interfaces';
import ADB from '../utils/appium-adb';
import {execBinarySync} from '../utils/sdk';
import {CliConfig, SubcommandOptionsVerificationResult} from './interfaces';
import {showHelp} from './help';

const deviceStateWithColor = (state: string) => {
  switch (state) {
    case 'device':
      return colors.green(state) + colors.gray(' (online)');
    case 'offline':
      return colors.red(state);
    default:
      return colors.gray(state);
  }
};

export async function showConnectedRealDevices() {
  try {
    const adb = await ADB.createADB({allowOfflineDevices: true});
    const connectedDevices = await adb.getConnectedDevices();
    const connectedRealDevices = connectedDevices.filter((device) => {
      return !device.udid.includes('emulator') && !device.udid.includes('_adb-tls-connect');
    });

    if (connectedRealDevices.length === 0) {
      return true;
    }

    Logger.log(colors.bold('Connected Real Devices:'));

    connectedRealDevices.forEach((device, index) => {
      Logger.log(`  ${index+1}. udid/deviceId: ${colors.green(device.udid)} / state: ${deviceStateWithColor(device.state)}`);
    });
    Logger.log();

    return true;
  } catch (error) {
    Logger.log(colors.red('Error occurred while showing connected real devices.'));
    console.error(error);

    return false;
  }
}

export async function showConnectedEmulators() {
  try {
    const adb = await ADB.createADB({allowOfflineDevices: true});
    const connectedEmulators = await adb.getConnectedEmulators();

    if (connectedEmulators.length === 0) {
      return true;
    }

    Logger.log(colors.bold('Connected Emulators:'));

    connectedEmulators.forEach((emu, index) => {
      Logger.log(`  ${index+1}. udid/deviceId: ${colors.green(emu.udid)} / state: ${deviceStateWithColor(emu.state)}`);
    });
    Logger.log();

    return true;
  } catch (error) {
    Logger.log(colors.red('Error occurred while showing connected emulators.'));
    console.error(error);

    return false;
  }
}

export async function getInstalledSystemImages(sdkmanagerLocation: string, platform: Platform): Promise<string[] | false> {
  const stdout = execBinarySync(sdkmanagerLocation, 'sdkmanager', platform, '--list');
  if (!stdout) {
    Logger.log(`\n${colors.red('Failed to fetch system images!')} Please try again.`);

    return false;
  }
  const lines = stdout.split('\n');
  const installedImages: string[] = [];

  for (const line of lines) {
    if (line.includes('Available Packages:')) {
      break;
    }
    if (line.includes('system-images')) {
      installedImages.push(line.split('|')[0].trim());
    }
  }

  return installedImages;
}

export function showMissingBinaryHelp(binaryName: SdkBinary) {
  Logger.log(`  ${colors.red(symbols().fail)} ${colors.cyan(binaryName)} binary not found.\n`);
  Logger.log(`Run: ${colors.cyan('npx @nightwatch/mobile-helper android --standalone')} to setup missing requirements.`);
  Logger.log(`(Remove the ${colors.gray('--standalone')} flag from the above command if setting up for testing.)\n`);
}

export function verifyOptions(subcommand: string, options: Options): SubcommandOptionsVerificationResult | false {
  const optionsPassed = Object.keys(options).filter(option => options[option] !== false);

  const allowedFlags = AVAILABLE_SUBCOMMANDS[subcommand].flags;
  const allowedFlagNames = allowedFlags.map(flag => flag.name);

  // Divide the optionsPassed array in two arrays: flagsPassed and configsPassed.
  // flagsPassed contains the flags that are available for the subcommand.
  // configsPassed contains the config options with string or boolean values corresponding to the flag.
  const flagsPassed = optionsPassed.filter(option => allowedFlagNames.includes(option));
  const configsPassed = optionsPassed.filter(option => !allowedFlagNames.includes(option));

  // CHECK THE VALIDITY OF FLAG(s) PASSED

  if (flagsPassed.length > 1) {
    // A subcommand can only take one flag at a time.
    Logger.log(`${colors.red(`Too many flags passed for '${subcommand}' subcommand:`)} ${flagsPassed.join(', ')} ${colors.gray('(only one expected)')}`);
    showHelp(subcommand);

    return false;
  }

  if (allowedFlags.length && flagsPassed.length === 0) {
    // If the subcommand expects a flag but it is not passed:
    // - if instead some other options are passed, throw error (we don't know if the options passed are configs and for which flag).
    // - if no other options are passed, then we can prompt them for the flag and related configs.
    if (configsPassed.length > 0) {
      Logger.log(`${colors.red(`Unknown flag(s) passed for '${subcommand}' subcommand:`)} ${configsPassed.join(', ')}`);
      showHelp(subcommand);

      return false;
    }

    return {
      subcommandFlag: '',
      configs: []
    };
  }

  // CHECK THE VALIDITY OF CONFIGS PASSED

  const subcommandFlag = flagsPassed[0] || ''; // '' if no flag is allowed for the subcommand.

  if (configsPassed.length === 0) {
    // If no configs are passed, then we simply return and continue with the default subcommand flow.
    return {
      subcommandFlag,
      configs: []
    };
  }

  let allowedConfigs: CliConfig[] = [];
  let configsFor = '';
  if (!allowedFlags.length) {
    allowedConfigs = AVAILABLE_SUBCOMMANDS[subcommand].cliConfigs || [];
    configsFor = ` for '${subcommand}' subcommand`;
  } else {
    allowedConfigs = allowedFlags.find(flag => flag.name === subcommandFlag)?.cliConfigs || [];
    configsFor = ` for '--${subcommandFlag}' flag`;
  }

  if (allowedConfigs.length) {
    // Check if the passed configs are valid.
    const configNames: string[] = allowedConfigs.map(config => config.name);

    const configAliases: string[] = [];
    allowedConfigs.forEach(config => configAliases.push(...config.alias));
    configNames.push(...configAliases);

    const unknownConfigs = configsPassed.filter(option => !configNames.includes(option));
    if (unknownConfigs.length) {
      Logger.log(`${colors.red(`Unknown config(s) passed${configsFor}:`)} ${unknownConfigs.join(', ')}`);
      showHelp(subcommand);

      return false;
    }

    // set main config in `options` if config aliases are passed.
    const aliasToMainConfig: {[key: string]: string} = {};
    allowedConfigs.forEach(config => {
      config.alias.forEach(alias => {
        aliasToMainConfig[alias] = config.name;
      });
    });

    configsPassed.forEach((configName) => {
      if (aliasToMainConfig[configName]) {
        // `configName` is an alias
        const mainConfig = aliasToMainConfig[configName];
        options[mainConfig] = options[configName];
      }
    });
  } else {
    // if no configs are allowed for the flag but still some options are passed, then throw error.
    Logger.log(`${colors.red(`Unknown config(s) passed${configsFor}:`)} ${configsPassed.join(', ')} ${colors.gray('(none expected)')}`);
    showHelp(subcommand);

    return false;
  }

  return {
    subcommandFlag,
    configs: configsPassed
  };
}
