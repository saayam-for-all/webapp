/**
 * Creates an error object in case a session gets incompatible capabilities as the input.
 *
 * @returns {Error}
 */
export function makeNonW3cCapsError(): Error;
/**
 * Takes the caps that were provided in the request and translates them
 * into caps that can be used by the inner drivers.
 *
 * @template {Constraints} C
 * @template [J=any]
 * @param {J} jsonwpCapabilities
 * @param {W3CCapabilities<C>} w3cCapabilities
 * @param {C} constraints
 * @param {NSCapabilities<C>} [defaultCapabilities]
 * @returns {ParsedDriverCaps<C,J>|InvalidCaps<C,J>}
 */
export function parseCapsForInnerDriver<C extends Constraints, J = any>(jsonwpCapabilities: J, w3cCapabilities: W3CCapabilities<C>, constraints?: C, defaultCapabilities?: NSCapabilities<C>): ParsedDriverCaps<C, J> | InvalidCaps<C, J>;
/**
 * Takes a capabilities objects and prefixes capabilities with `appium:`
 * @template {Constraints} [C={}]
 * @param {Capabilities<C>} caps - Desired capabilities object
 * @returns {NSCapabilities<C>}
 */
export function insertAppiumPrefixes<C extends Constraints = {}>(caps: Capabilities<C>): NSCapabilities<C>;
/**
 * @template {Constraints} [C={}]
 * @param {NSCapabilities<C>} caps
 * @returns {Capabilities<C>}
 */
export function removeAppiumPrefixes<C extends Constraints = {}>(caps: NSCapabilities<C>): Capabilities<C>;
/**
 *
 * @param {string} pkgName
 * @returns {string|undefined}
 */
export function getPackageVersion(pkgName: string): string | undefined;
/**
 * Adjusts NODE_PATH environment variable,
 * so drivers and plugins could load their peer dependencies.
 * Read https://nodejs.org/api/modules.html#loading-from-the-global-folders
 * for more details.
 * @returns {void}
 */
export function adjustNodePath(): void;
/**
 * Pulls the initial values of Appium settings from the given capabilities argument.
 * Each setting item must satisfy the following format:
 * `settings[setting_name]: setting_value`
 * or
 * ```
 * settings = {
 *   setting_name1: 'setting_value1',
 *   setting_name2: 'setting_value2',
 * }
 * ```
 * The capabilities argument itself gets mutated, so it does not contain parsed
 * settings anymore to avoid further parsing issues.
 * Check
 * https://appium.io/docs/en/latest/guides/settings/
 * for more details on the available settings.
 *
 * @param {?Object} caps - Capabilities dictionary. It is mutated if
 * one or more settings have been pulled from it
 * @return {Object} - An empty dictionary if the given caps contains no
 * setting items or a dictionary containing parsed Appium setting names along with
 * their values.
 */
export function pullSettings(caps: any | null): any;
/**
 * @template {CliCommand} [Cmd=ServerCommand]
 * @template {CliExtensionSubcommand|void} [SubCmd=void]
 * @param {Args<Cmd, SubCmd>} args
 * @returns {args is Args<ServerCommand>}
 */
export function isServerCommandArgs<Cmd extends CliCommand = "server", SubCmd extends CliExtensionSubcommand | void = void>(args: Args<Cmd, SubCmd>): args is Args<ServerCommand>;
/**
 * @template {CliCommand} Cmd
 * @template {CliExtensionSubcommand|CliCommandSetupSubcommand|void} [SubCmd=void]
 * @param {Args<Cmd, SubCmd>} args
 * @returns {args is Args<SetupCommand>}
 */
export function isSetupCommandArgs<Cmd extends CliCommand, SubCmd extends CliExtensionSubcommand | CliCommandSetupSubcommand | void = void>(args: Args<Cmd, SubCmd>): args is Args<SetupCommand>;
/**
 * @template {CliCommand} [Cmd=ServerCommand]
 * @template {CliExtensionSubcommand|void} [SubCmd=void]
 * @param {Args<Cmd, SubCmd>} args
 * @returns {args is Args<CliExtensionCommand, SubCmd>}
 */
export function isExtensionCommandArgs<Cmd extends CliCommand = "server", SubCmd extends CliExtensionSubcommand | void = void>(args: Args<Cmd, SubCmd>): args is Args<CliExtensionCommand, SubCmd>;
/**
 * @template {CliCommand} Cmd
 * @template {CliExtensionSubcommand} SubCmd
 * @param {Args<Cmd, SubCmd>} args
 * @returns {args is Args<DriverCommand, SubCmd>}
 */
export function isDriverCommandArgs<Cmd extends CliCommand, SubCmd extends CliExtensionSubcommand>(args: Args<Cmd, SubCmd>): args is Args<DriverCommand, SubCmd>;
/**
 * @template {CliCommand} Cmd
 * @template {CliExtensionSubcommand} SubCmd
 * @param {Args<Cmd, SubCmd>} args
 * @returns {args is Args<PluginCommand, SubCmd>}
 */
export function isPluginCommandArgs<Cmd extends CliCommand, SubCmd extends CliExtensionSubcommand>(args: Args<Cmd, SubCmd>): args is Args<PluginCommand, SubCmd>;
/**
 * Fetches the list of matched network interfaces of the current host.
 *
 * @param {4|6|null} family Either 4 to include ipv4 addresses only,
 * 6 to include ipv6 addresses only, or null to include all of them
 * @returns {os.NetworkInterfaceInfo[]} The list of matched interfcaes
 */
export function fetchInterfaces(family?: 4 | 6 | null): os.NetworkInterfaceInfo[];
/**
 * https://github.com/SheetJS/js-adler32
 *
 * @param {string} str
 * @param {number?} [seed]
 * @returns {number}
 */
export function adler32(str: string, seed?: number | null): number;
/**
 * Checks if the provided address is a broadcast one.
 *
 * @param {string} address
 * @returns {boolean}
 */
export function isBroadcastIp(address: string): boolean;
/**
 * Validates the list of allowed/denied server features
 *
 * @param {string[]} features
 * @returns {string[]}
 */
export function validateFeatures(features: string[]): string[];
export const V4_BROADCAST_IP: "0.0.0.0";
export const V6_BROADCAST_IP: "::";
export const npmPackage: import("read-pkg").NormalizedPackageJson;
/**
 * Dumps to value to the console using `info` logger.
 *
 * @todo May want to force color to be `false` if {@link isStdoutTTY} is `false`.
 */
export const inspect: (t1: any) => void;
export type StringRecord = import("@appium/types").StringRecord;
export type BaseDriverCapConstraints = import("@appium/types").BaseDriverCapConstraints;
export type ParsedDriverCaps<C extends Constraints = {
    readonly platformName: {
        readonly presence: true;
        readonly isString: true;
    };
    readonly app: {
        readonly isString: true;
    };
    readonly platformVersion: {
        readonly isString: true;
    };
    readonly webSocketUrl: {
        readonly isBoolean: true;
    };
    readonly newCommandTimeout: {
        readonly isNumber: true;
    };
    readonly automationName: {
        readonly isString: true;
    };
    readonly autoLaunch: {
        readonly isBoolean: true;
    };
    readonly udid: {
        readonly isString: true;
    };
    readonly orientation: {
        readonly inclusion: readonly ["LANDSCAPE", "PORTRAIT"];
    };
    readonly autoWebview: {
        readonly isBoolean: true;
    };
    readonly noReset: {
        readonly isBoolean: true;
    };
    readonly fullReset: {
        readonly isBoolean: true;
    };
    readonly language: {
        readonly isString: true;
    };
    readonly locale: {
        readonly isString: true;
    };
    readonly eventTimings: {
        readonly isBoolean: true;
    };
    readonly printPageSourceOnFindFailure: {
        readonly isBoolean: true;
    };
}, J = any> = {
    desiredCaps: Capabilities<C>;
    protocol: string;
    processedJsonwpCapabilities?: J | undefined;
    processedW3CCapabilities?: import("@appium/types").W3CCapabilities<C> | undefined;
};
export type InvalidCaps<C extends Constraints = {
    readonly platformName: {
        readonly presence: true;
        readonly isString: true;
    };
    readonly app: {
        readonly isString: true;
    };
    readonly platformVersion: {
        readonly isString: true;
    };
    readonly webSocketUrl: {
        readonly isBoolean: true;
    };
    readonly newCommandTimeout: {
        readonly isNumber: true;
    };
    readonly automationName: {
        readonly isString: true;
    };
    readonly autoLaunch: {
        readonly isBoolean: true;
    };
    readonly udid: {
        readonly isString: true;
    };
    readonly orientation: {
        readonly inclusion: readonly ["LANDSCAPE", "PORTRAIT"];
    };
    readonly autoWebview: {
        readonly isBoolean: true;
    };
    readonly noReset: {
        readonly isBoolean: true;
    };
    readonly fullReset: {
        readonly isBoolean: true;
    };
    readonly language: {
        readonly isString: true;
    };
    readonly locale: {
        readonly isString: true;
    };
    readonly eventTimings: {
        readonly isBoolean: true;
    };
    readonly printPageSourceOnFindFailure: {
        readonly isBoolean: true;
    };
}, J = any> = {
    error: Error;
    protocol: string;
    desiredCaps?: import("@appium/types").ConstraintsToCaps<C> | undefined;
    processedJsonwpCapabilities?: J | undefined;
    processedW3CCapabilities?: import("@appium/types").W3CCapabilities<C> | undefined;
};
export type Capabilities<C extends Constraints> = import("@appium/types").Capabilities<C>;
export type W3CCapabilities<C extends Constraints> = import("@appium/types").W3CCapabilities<C>;
export type NSCapabilities<C extends Constraints> = import("@appium/types").NSCapabilities<C>;
export type ConstraintsToCaps<C extends Constraints> = import("@appium/types").ConstraintsToCaps<C>;
export type StringKeyOf<T> = import("type-fest").StringKeyOf<T>;
export type Constraints = import("@appium/types").Constraints;
export type CliCommand = import("appium/types").CliCommand;
export type CliExtensionSubcommand = import("appium/types").CliExtensionSubcommand;
export type CliExtensionCommand = import("appium/types").CliExtensionCommand;
export type CliCommandSetupSubcommand = import("appium/types").CliCommandSetupSubcommand;
export type ServerCommand = import("appium/types").CliCommandServer;
export type DriverCommand = import("appium/types").CliCommandDriver;
export type PluginCommand = import("appium/types").CliCommandPlugin;
export type SetupCommand = import("appium/types").CliCommandSetup;
export type Args<Cmd extends CliCommand = "server", SubCmd extends CliExtensionSubcommand | CliCommandSetupSubcommand | void = void> = import("appium/types").Args<Cmd, SubCmd>;
export type ParsedArgs<Cmd extends CliCommand = "server", SubCmd extends CliExtensionSubcommand | CliCommandSetupSubcommand | void = void> = import("appium/types").ParsedArgs<Cmd, SubCmd>;
import os from 'node:os';
//# sourceMappingURL=utils.d.ts.map