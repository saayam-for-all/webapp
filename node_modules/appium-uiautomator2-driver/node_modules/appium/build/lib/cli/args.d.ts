export type ExtensionType = import("@appium/types").ExtensionType;
/**
 * A tuple of argument aliases and argument options
 */
export type ArgumentDefinitions = Map<[name: string] | [name: string, alias: string], import("argparse").ArgumentOptions>;
/**
 * Derives the options for the `server` command from the schema, and adds the arguments
 * which are disallowed in the config file.
 * @returns {ArgumentDefinitions}
 */
export function getServerArgs(): ArgumentDefinitions;
/**
 * Builds a Record of extension types to a Record of subcommands to their argument definitions
 */
export const getExtensionArgs: (() => Record<ExtensionType, Record<import("appium/types").CliExtensionSubcommand, ArgumentDefinitions>>) & _.MemoizedFunction;
import _ from 'lodash';
//# sourceMappingURL=args.d.ts.map