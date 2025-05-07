export const commandClasses: Readonly<{
    readonly driver: typeof DriverCliCommand;
    readonly plugin: typeof PluginCliCommand;
}>;
export type ExtCommand<ExtType extends ExtensionType> = ExtType extends DriverType ? Class<DriverCliCommand> : ExtType extends PluginType ? Class<PluginCliCommand> : never;
export type ExtensionType = import("@appium/types").ExtensionType;
export type DriverType = import("@appium/types").DriverType;
export type PluginType = import("@appium/types").PluginType;
export type Class<T> = import("@appium/types").Class<T>;
import DriverCliCommand from './driver-command';
import PluginCliCommand from './plugin-command';
/**
 * Run a subcommand of the 'appium driver' type. Each subcommand has its own set of arguments which
 * can be represented as a JS object.
 *
 * @template {import('appium/types').CliExtensionCommand} Cmd
 * @template {import('appium/types').CliExtensionSubcommand} SubCmd
 * @param {import('appium/types').Args<Cmd, SubCmd>} args - JS object where the key is the parameter name (as defined in
 * driver-parser.js)
 * @param {import('../extension/extension-config').ExtensionConfig<Cmd>} config - Extension config object
 */
export function runExtensionCommand<Cmd extends import("appium/types").CliExtensionCommand, SubCmd extends import("appium/types").CliExtensionSubcommand>(args: import("appium/types").Args<Cmd, SubCmd>, config: import("../extension/extension-config").ExtensionConfig<Cmd>): Promise<any>;
//# sourceMappingURL=extension.d.ts.map