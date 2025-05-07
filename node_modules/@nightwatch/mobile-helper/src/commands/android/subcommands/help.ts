import colors from 'ansi-colors';

import Logger from '../../../logger';
import {AVAILABLE_SUBCOMMANDS} from '../constants';
import {CliConfig, Subcommand} from './interfaces';

export function showHelp(subcommand: string) {
  const subcmd = AVAILABLE_SUBCOMMANDS[subcommand];

  const subcmdFlagUsage = subcmd.flags.length ? ' [flag]' : '';
  Logger.log(`Usage: ${colors.cyan(`npx @nightwatch/mobile-helper android ${subcommand}${subcmdFlagUsage} [configs]`)}\n`);

  const subcmdFlagsHelp = getSubcommandFlagsHelp(subcmd);
  if (subcmdFlagsHelp) {
    Logger.log(colors.yellow('Available flags:'));
    Logger.log(subcmdFlagsHelp);
  }
}

export const getSubcommandHelp = (): string => {
  let output = '';

  output += `Usage: ${colors.cyan('npx @nightwatch/mobile-helper android SUBCOMMAND [flag] [configs]')}\n`;
  output += '  Perform common Android SDK operations using subcommands.\n\n';
  output += `${colors.yellow('Subcommands (with available flags and configs):')}\n`;

  // A subcommand can allow multiple flags to facilitate different workflows, and each flag can
  // allow multiple configs to customize the workflow.
  // But, if a subcommand has a single workflow, then it doesn't require any flag and can have
  // multiple configs directly associated with the subcommand itself.
  Object.keys(AVAILABLE_SUBCOMMANDS).forEach(subcommand => {
    const subcmd = AVAILABLE_SUBCOMMANDS[subcommand];

    const subcmdFlagsUsage = subcmd.flags?.map(flag => `[--${flag.name}]`).join(' ') || '';
    const subcmdConfigsUsage = generateConfigsUsageString(subcmd.cliConfigs || []);

    // Display the subcommand name along with flags in the format:
    // 'subcommand [--flag1] [--flag2]'
    // OR
    // Display the subcommand name along with direct configs in the format:
    // 'subcommand [--config1 <usageHelp>] [--config2 <usageHelp>]'
    output += `  ${colors.cyan(subcommand)} ${subcmdFlagsUsage}${subcmdConfigsUsage}\n`;
    output += `  ${colors.gray(subcmd.description)}\n`;

    // Append a list of configs allowed for the subcommand, along with their aliases and description.
    if (subcmd.cliConfigs) {
      const configsWithAlias = getConfigsWithAlias(subcmd.cliConfigs);

      subcmd.cliConfigs.forEach((config, idx) => {
        const padding = generatePadding(configsWithAlias, configsWithAlias[idx].length);
        output += `    ${configsWithAlias[idx]} ${colors.grey(padding)} ${colors.gray(config.description)}\n`;
      });
    }

    output += getSubcommandFlagsHelp(subcmd);
    output += '\n';
  });

  return output;
};

/**
 * Display a list of flags followed by their allowed configs for a subcommand.
 */
export const getSubcommandFlagsHelp = (subcmd: Subcommand): string => {
  let output = '';

  if (subcmd.flags.length) {
    // Generate a list of flags usage with configs in the format:
    // '--flag1 [--config11 <usageHelp>] [--config12 <usageHelp>]',
    // '--flag2 [--config21 <usageHelp>] [--config22 <usageHelp>]'
    const flagsUsageWithConfigs = subcmd.flags.map((flag) => {
      let flagHelp = `--${flag.name}`;

      if (flag.cliConfigs) {
        flagHelp += ' ' + generateConfigsUsageString(flag.cliConfigs);
      }

      return flagHelp;
    });

    // Generate final help output for each flag.
    subcmd.flags.forEach((flag, idx) => {
      const padding = generatePadding(flagsUsageWithConfigs, flagsUsageWithConfigs[idx].length);
      output += `    ${flagsUsageWithConfigs[idx]} ${colors.grey(padding)} ${colors.gray(flag.description)}\n`;

      // Append a list of configs allowed for the flag, along with their aliases and description.
      if (flag.cliConfigs) {
        const configsWithAlias = getConfigsWithAlias(flag.cliConfigs);

        flag.cliConfigs.forEach((config, idx) => {
          const padding = generatePadding(configsWithAlias, configsWithAlias[idx].length);
          output += `        ${configsWithAlias[idx]} ${colors.grey(padding)} ${colors.gray(config.description)}\n`;
        });
      }
    });
  }

  return output;
};

/*
 * Generate a string of configs in the format:
 * [--config1 <usageHelp>] [--config2 <usageHelp>] ...
 */
const generateConfigsUsageString = (configs: CliConfig[]): string => {
  let configsStr = '';
  configs.forEach(config => {
    configsStr += `[--${config.name} <${config.usageHelp}>]`;
  });

  return configsStr;
};

/**
* Generate a list of configs with their aliases in the format:
* '--config1 | -c11 | -c12',
* '--config2 | -c21 | -c22'
*/
const getConfigsWithAlias = (configs: CliConfig[]): string[] => {
  const configsWithAlias = configs.map(config => {
    const configAlias = config.alias.map(alias => `-${alias}`).join(' | ');

    return `--${config.name}` + (configAlias ? ` | ${configAlias}` : '');
  });

  return configsWithAlias;
};

const generatePadding = (array: string[], length: number): string => {
  const longest = (xs: string[]) => Math.max.apply(null, xs.map(x => x.length));
  const padding = new Array(Math.max(longest(array) - length + 3, 0)).join('.');

  return padding;
};
