/**
 * Loads extensions and creates `ExtensionConfig` instances.
 *
 * - Reads the manifest file, creating if necessary
 * - Using the parsed extension data, creates/gets the `ExtensionConfig` subclass instances
 * - Returns these instances
 *
 * If `appiumHome` is needed, use `resolveAppiumHome` from the `env` module in `@appium/support`.
 * @param {string} appiumHome
 * @returns {Promise<ExtensionConfigs>}
 */
export function loadExtensions(appiumHome: string): Promise<ExtensionConfigs>;
/**
 * Find any plugin name which has been installed, and which has been requested for activation by
 * using the --use-plugins flag, and turn each one into its class, so we can send them as objects
 * to the server init. We also want to send/assign them to the umbrella driver so it can use them
 * to wrap command execution
 *
 * @param {import('./plugin-config').PluginConfig} pluginConfig - a plugin extension config
 * @param {number} maxParallelImports the maximum amount of plugins to import in parallel
 * @param {string[]} usePlugins
 * @returns {Promise<PluginNameMap>} Mapping of PluginClass to name
 */
export function getActivePlugins(pluginConfig: import("./plugin-config").PluginConfig, maxParallelImports: number, usePlugins?: string[]): Promise<PluginNameMap>;
/**
 * Find any driver name which has been installed, and turn each one into its class, so we can send
 * them as objects to the server init in case they need to add methods/routes or update the server.
 * If the --drivers flag was given, this method only loads the given drivers.
 *
 * @param {import('./driver-config').DriverConfig} driverConfig - a driver extension config
 * @param {number} maxParallelImports the maximum amount of plugins to import in parallel
 * @param {string[]} [useDrivers] - optional list of drivers to load
 * @returns {Promise<DriverNameMap>}
 */
export function getActiveDrivers(driverConfig: import("./driver-config").DriverConfig, maxParallelImports: number, useDrivers?: string[]): Promise<DriverNameMap>;
/**
 * A mapping of {@linkcode PluginClass} classes to their names.
 */
export type PluginNameMap = Map<PluginClass, string>;
/**
 * A mapping of {@linkcode DriverClass} classes to their names.
 */
export type DriverNameMap = Map<DriverClass, string>;
export type PluginClass = import("@appium/types").PluginClass;
export type DriverClass = import("@appium/types").DriverClass;
export type ExtensionConfigs = {
    driverConfig: import("./driver-config").DriverConfig;
    pluginConfig: import("./plugin-config").PluginConfig;
};
//# sourceMappingURL=index.d.ts.map