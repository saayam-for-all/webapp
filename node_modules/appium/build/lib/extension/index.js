"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadExtensions = loadExtensions;
exports.getActivePlugins = getActivePlugins;
exports.getActiveDrivers = getActiveDrivers;
const lodash_1 = __importDefault(require("lodash"));
const constants_1 = require("../constants");
const logger_1 = __importDefault(require("../logger"));
const driver_config_1 = require("./driver-config");
const manifest_1 = require("./manifest");
const support_1 = require("@appium/support");
const plugin_config_1 = require("./plugin-config");
const bluebird_1 = __importDefault(require("bluebird"));
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
async function loadExtensions(appiumHome) {
    const manifest = manifest_1.Manifest.getInstance(appiumHome);
    await manifest.read();
    const driverConfig = driver_config_1.DriverConfig.getInstance(manifest) ?? driver_config_1.DriverConfig.create(manifest);
    const pluginConfig = plugin_config_1.PluginConfig.getInstance(manifest) ?? plugin_config_1.PluginConfig.create(manifest);
    await bluebird_1.default.all([driverConfig.validate(), pluginConfig.validate()]);
    return { driverConfig, pluginConfig };
}
/**
 * @template {'driver'|'plugin'} TExtType
 * @param {TExtType} extType
 * @param {import('./extension-config').ExtensionConfig} config
 * @param {string[]} extNames
 * @param {number} asyncImportChunkSize
 * @returns {Promise<[TExtType extends 'driver' ? DriverClass : PluginClass, string][]>}
 */
async function importExtensions(extType, config, extNames, asyncImportChunkSize) {
    /** @type {B[]} */
    const allPromises = [];
    /** @type {B[]} */
    const activePromisesChunk = [];
    for (const extName of extNames) {
        lodash_1.default.remove(activePromisesChunk, (p) => p.isFulfilled());
        if (activePromisesChunk.length >= asyncImportChunkSize) {
            await bluebird_1.default.any(activePromisesChunk);
        }
        const promise = bluebird_1.default.resolve((async () => {
            logger_1.default.info(`Attempting to load ${extType} ${extName}...`);
            const timer = new support_1.timing.Timer().start();
            try {
                const extClass = await config.requireAsync(extName);
                logger_1.default.debug(`${extClass.name} has been successfully loaded in ${timer.getDuration().asSeconds.toFixed(3)}s`);
                return extClass;
            }
            catch (err) {
                logger_1.default.error(`Could not load ${extType} '${extName}', so it will not be available. Error ` +
                    `in loading the ${extType} was: ${err.message}`);
                logger_1.default.debug(err.stack);
            }
        })());
        activePromisesChunk.push(promise);
        allPromises.push(promise);
    }
    return /** @type {[TExtType extends 'driver' ? DriverClass : PluginClass, string][]} */ (lodash_1.default.zip(await bluebird_1.default.all(allPromises), extNames).filter(([extClass,]) => Boolean(extClass)));
}
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
async function getActivePlugins(pluginConfig, maxParallelImports, usePlugins = []) {
    if (lodash_1.default.isEmpty(usePlugins)) {
        return new Map();
    }
    /** @type {string[]} */
    let filteredPluginNames = [];
    if (usePlugins.length === 1 && usePlugins[0] === constants_1.USE_ALL_PLUGINS) {
        filteredPluginNames = lodash_1.default.keys(pluginConfig.installedExtensions);
    }
    else {
        // It is important to load plugins in the same order that was used while enumerating them
        for (const pluginName of usePlugins) {
            if (pluginName in pluginConfig.installedExtensions) {
                filteredPluginNames.push(pluginName);
            }
            else if (pluginName === constants_1.USE_ALL_PLUGINS) {
                throw new Error(`The reserved plugin name '${pluginName}' cannot be combined with other names.`);
            }
            else {
                const suffix = lodash_1.default.isEmpty(pluginConfig.installedExtensions)
                    ? `You don't have any plugins installed yet.`
                    : `Only the following ${lodash_1.default.size(pluginConfig.installedExtensions) === 1 ? `plugin is` : `plugins are`} ` +
                        `available: ${lodash_1.default.keys(pluginConfig.installedExtensions)}`;
                throw new Error(`Could not load the plugin '${pluginName}' because it is not installed. ${suffix}`);
            }
        }
    }
    return new Map(await importExtensions('plugin', pluginConfig, filteredPluginNames, maxParallelImports));
}
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
async function getActiveDrivers(driverConfig, maxParallelImports, useDrivers = []) {
    /** @type {string[]} */
    let filteredDriverNames = [];
    if (lodash_1.default.isEmpty(useDrivers)) {
        // load all drivers if none are requested
        filteredDriverNames = lodash_1.default.keys(driverConfig.installedExtensions);
    }
    else {
        // Load drivers in the same order that was used while enumerating them
        for (const driverName of useDrivers) {
            if (driverName in driverConfig.installedExtensions) {
                filteredDriverNames.push(driverName);
            }
            else {
                const suffix = lodash_1.default.isEmpty(driverConfig.installedExtensions)
                    ? `You don't have any drivers installed yet.`
                    : `Only the following ${lodash_1.default.size(driverConfig.installedExtensions) === 1 ? `driver is` : `drivers are`} ` +
                        `available: ${lodash_1.default.keys(driverConfig.installedExtensions)}`;
                throw new Error(`Could not load the driver '${driverName}' because it is not installed. ${suffix}`);
            }
        }
    }
    return new Map(await importExtensions('driver', driverConfig, filteredDriverNames, maxParallelImports));
}
/**
 * A mapping of {@linkcode PluginClass} classes to their names.
 * @typedef {Map<PluginClass,string>} PluginNameMap
 */
/**
 * A mapping of {@linkcode DriverClass} classes to their names.
 * @typedef {Map<DriverClass,string>} DriverNameMap
 */
/**
 * @typedef {import('@appium/types').PluginClass} PluginClass
 * @typedef {import('@appium/types').DriverClass} DriverClass
 */
/**
 * @typedef ExtensionConfigs
 * @property {import('./driver-config').DriverConfig} driverConfig
 * @property {import('./plugin-config').PluginConfig} pluginConfig
 */
//# sourceMappingURL=index.js.map