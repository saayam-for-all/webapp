/**
 * Return a list of drivers available for current host platform.
 * @param {import('appium/types').CliCommandSetupSubcommand} presetName
 * @returns {Array<string>}
 */
export function getPresetDrivers(presetName: import("appium/types").CliCommandSetupSubcommand): Array<string>;
/**
 * Return desktop platform name for setup command description.
 * @returns {string}
 */
export function determinePlatformName(): string;
/**
 * Run 'setup' command to install drivers/plugins into the given appium home.
 * @template {import('appium/types').CliCommandSetup} SetupCmd
 * @param {import('appium/types').Args<SetupCmd>} preConfigArgs
 * @param {DriverConfig} driverConfig
 * @param {PluginConfig} pluginConfig
 * @returns {Promise<void>}
 */
export function runSetupCommand<SetupCmd extends import("appium/types").CliCommandSetup>(preConfigArgs: import("appium/types").Args<SetupCmd>, driverConfig: DriverConfig, pluginConfig: PluginConfig): Promise<void>;
/**
 * Subcommands of preset for setup
 */
export const SUBCOMMAND_MOBILE: "mobile";
export const SUBCOMMAND_DESKTOP: "desktop";
export const SUBCOMMAND_BROWSER: "browser";
export const SUBCOMMAND_RESET: "reset";
/**
 * Plugin names listed in KNOWN_PLUGINS to install by default.
 */
export const DEFAULT_PLUGINS: string[];
export type CliExtensionCommand = import("appium/types").CliExtensionCommand;
export type CliExtensionSubcommand = import("appium/types").CliExtensionSubcommand;
export type PluginConfig = import("../extension/extension-config").ExtensionConfig<CliExtensionCommand>;
export type DriverConfig = import("../extension/extension-config").ExtensionConfig<CliExtensionCommand>;
export type Args = import("appium/types").Args<CliExtensionCommand, CliExtensionSubcommand>;
//# sourceMappingURL=setup-command.d.ts.map