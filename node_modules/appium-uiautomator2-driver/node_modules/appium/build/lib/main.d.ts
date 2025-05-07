#!/usr/bin/env node
export { readConfigFile } from "./config-file";
export type DriverType = import("@appium/types").DriverType;
export type PluginType = import("@appium/types").PluginType;
export type DriverClass = import("@appium/types").DriverClass;
export type PluginClass = import("@appium/types").PluginClass;
export type CliCommand = import("appium/types").CliCommand;
export type CliExtensionSubcommand = import("appium/types").CliExtensionSubcommand;
export type CliExtensionCommand = import("appium/types").CliExtensionCommand;
export type ServerCommand = import("appium/types").CliCommandServer;
export type DriverCommand = import("appium/types").CliCommandDriver;
export type PluginCommand = import("appium/types").CliCommandPlugin;
export type SetupCommand = import("appium/types").CliCommandSetup;
export type DriverNameMap = import("./extension").DriverNameMap;
export type PluginNameMap = import("./extension").PluginNameMap;
/**
 * Literally an empty object
 */
export type ExtCommandInitResult = {};
export type ServerInitData = {
    /**
     * - The Appium driver
     */
    appiumDriver: import("./appium").AppiumDriver;
    /**
     * - The parsed arguments
     */
    parsedArgs: import("appium/types").ParsedArgs;
    /**
     * - The full path to the Appium home folder
     */
    appiumHome: string;
};
export type InitResult<Cmd extends CliCommand> = Cmd extends ServerCommand ? ServerInitData & import("./extension").ExtensionConfigs : ExtCommandInitResult;
export type Args<Cmd extends CliCommand = "server", SubCmd extends CliExtensionSubcommand | void = void> = import("appium/types").Args<Cmd, SubCmd>;
export type ParsedArgs<Cmd extends CliCommand = "server", SubCmd extends CliExtensionSubcommand | void = void> = import("appium/types").ParsedArgs<Cmd, SubCmd>;
/**
 * Initializes Appium's config.  Starts server if appropriate and resolves the
 * server instance if so; otherwise resolves w/ `undefined`.
 * @template {CliCommand} [Cmd=ServerCommand]
 * @template {CliExtensionSubcommand|void} [SubCmd=void]
 * @param {Args<Cmd, SubCmd>} [args] - Arguments from CLI or otherwise
 * @returns {Promise<Cmd extends ServerCommand ? import('@appium/types').AppiumServer : void>}
 */
export function main<Cmd extends CliCommand = "server", SubCmd extends CliExtensionSubcommand | void = void>(args?: Args<Cmd, SubCmd>): Promise<Cmd extends ServerCommand ? import("@appium/types").AppiumServer : void>;
/**
 * Initializes Appium, but does not start the server.
 *
 * Use this to get at the configuration schema.
 *
 * If `args` contains a non-empty `subcommand` which is not `server`, this function will return an empty object.
 *
 * @template {CliCommand} [Cmd=ServerCommand]
 * @template {CliExtensionSubcommand|void} [SubCmd=void]
 * @param {Args<Cmd, SubCmd>} [args] - Partial args (progammatic usage only)
 * @returns {Promise<InitResult<Cmd>>}
 * @example
 * import {init, getSchema} from 'appium';
 * const options = {}; // config object
 * await init(options);
 * const schema = getSchema(); // entire config schema including plugins and drivers
 */
export function init<Cmd extends CliCommand = "server", SubCmd extends CliExtensionSubcommand | void = void>(args?: Args<Cmd, SubCmd>): Promise<InitResult<Cmd>>;
export const resolveAppiumHome: ((cwd?: string) => Promise<string>) & _.MemoizedFunction;
import _ from 'lodash';
export { finalizeSchema, getSchema, validate } from "./schema/schema";
//# sourceMappingURL=main.d.ts.map