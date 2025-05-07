"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginConfig = void 0;
const lodash_1 = __importDefault(require("lodash"));
const extension_config_1 = require("./extension-config");
const logger_1 = __importDefault(require("../logger"));
const constants_1 = require("../constants");
/**
 * @extends {ExtensionConfig<PluginType>}
 */
class PluginConfig extends extension_config_1.ExtensionConfig {
    /**
     * Call {@link PluginConfig.create} instead.
     *
     * Just calls the superclass' constructor with the correct extension type
     * @private
     * @param {Manifest} manifest - IO object
     */
    constructor(manifest) {
        super(constants_1.PLUGIN_TYPE, manifest);
    }
    async validate() {
        return await super._validate(this.manifest.getExtensionData(constants_1.PLUGIN_TYPE));
    }
    /**
     * Creates a new {@link PluginConfig} instance for a {@link Manifest} instance.
     *
     * @param {Manifest} manifest
     * @throws If `manifest` already associated with a `PluginConfig`
     * @returns {PluginConfig}
     */
    static create(manifest) {
        const instance = new PluginConfig(manifest);
        if (PluginConfig.getInstance(manifest)) {
            throw new Error(`Manifest with APPIUM_HOME ${manifest.appiumHome} already has a PluginConfig; use PluginConfig.getInstance() to retrieve it.`);
        }
        PluginConfig._instances.set(manifest, instance);
        return instance;
    }
    /**
     * Returns a PluginConfig associated with a Manifest
     * @param {Manifest} manifest
     * @returns {PluginConfig|undefined}
     */
    static getInstance(manifest) {
        return PluginConfig._instances.get(manifest);
    }
    /**
     * @param {string} pluginName
     * @param {import('appium/types').ExtManifest<PluginType>} pluginData
     * @returns {string}
     */
    extensionDesc(pluginName, { version }) {
        return `${pluginName}@${version}`;
    }
    /**
     *
     * @param {(keyof import('appium/types').ExtRecord<PluginType>)[]} activeNames
     * @returns {void}
     */
    print(activeNames) {
        const pluginNames = Object.keys(this.installedExtensions);
        if (lodash_1.default.isEmpty(pluginNames)) {
            logger_1.default.info(`No plugins have been installed. Use the "appium plugin" ` +
                'command to install the one(s) you want to use.');
            return;
        }
        logger_1.default.info(`Available plugins:`);
        for (const [pluginName, pluginData] of lodash_1.default.toPairs(this.installedExtensions)) {
            const activeTxt = lodash_1.default.includes(activeNames, pluginName) ? ' (ACTIVE)' : '';
            logger_1.default.info(`  - ${this.extensionDesc(pluginName, pluginData)}${activeTxt}`);
        }
        if (lodash_1.default.isEmpty(activeNames)) {
            logger_1.default.info('No plugins activated. Use the --use-plugins flag with names of plugins to activate');
        }
    }
}
exports.PluginConfig = PluginConfig;
/**
 * A mapping of {@link Manifest} instances to {@link PluginConfig} instances.
 *
 * `Manifest` and {@link ExtensionConfig} have a one-to-many relationship; each `Manifest` should be associated with a `DriverConfig` and a `PluginConfig`; no more, no less.
 *
 * This variable tracks the `Manifest`-to-`PluginConfig` portion.
 *
 * @type {WeakMap<Manifest,PluginConfig>}
 * @private
 */
PluginConfig._instances = new WeakMap();
/**
 * @typedef PluginConfigOptions
 * @property {import('./extension-config').ExtensionLogFn} [logFn] - Optional logging function
 */
/**
 * @typedef {import('@appium/types').PluginType} PluginType
 * @typedef {import('appium/types').ExtMetadata<PluginType>} PluginMetadata
 * @typedef {import('./manifest').Manifest} Manifest
 */
//# sourceMappingURL=plugin-config.js.map