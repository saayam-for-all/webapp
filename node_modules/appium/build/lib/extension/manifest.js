"use strict";
/**
 * Module containing {@link Manifest} which handles reading & writing of extension config files.
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Manifest_instances, _Manifest_data, _Manifest_appiumHome, _Manifest_manifestPath, _Manifest_writing, _Manifest_reading, _Manifest_setManifestPath;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manifest = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const support_1 = require("@appium/support");
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const constants_1 = require("../constants");
const extension_config_1 = require("./extension-config");
const package_changed_1 = require("./package-changed");
const manifest_migrations_1 = require("./manifest-migrations");
/**
 * The name of the prop (`drivers`) used in `extensions.yaml` for drivers.
 * @type {`${typeof DRIVER_TYPE}s`}
 */
const CONFIG_DATA_DRIVER_KEY = `${constants_1.DRIVER_TYPE}s`;
/**
 * The name of the prop (`plugins`) used in `extensions.yaml` for plugins.
 * @type {`${typeof PLUGIN_TYPE}s`}
 */
const CONFIG_DATA_PLUGIN_KEY = `${constants_1.PLUGIN_TYPE}s`;
/**
 * @type {Readonly<ManifestData>}
 */
const INITIAL_MANIFEST_DATA = Object.freeze({
    [CONFIG_DATA_DRIVER_KEY]: Object.freeze({}),
    [CONFIG_DATA_PLUGIN_KEY]: Object.freeze({}),
    schemaRev: constants_1.CURRENT_SCHEMA_REV,
});
/**
 * Given a `package.json` return `true` if it represents an Appium Extension (either a driver or plugin).
 *
 *  _This is a type guard; not a validator._
 *
 * The `package.json` must have an `appium` property which is an object.
 * @param {any} value
 * @returns {value is ExtPackageJson<ExtensionType>}
 */
function isExtension(value) {
    return (lodash_1.default.isPlainObject(value) &&
        lodash_1.default.isPlainObject(value.appium) &&
        lodash_1.default.isString(value.name) &&
        lodash_1.default.isString(value.version));
}
/**
 * Given a `package.json`, return `true` if it represents an Appium Driver.
 *
 * _This is a type guard; not a validator._
 *
 * To be considered a driver, a `package.json` must have an `appium.driverName` field.
 *
 * Further validation of the `appium` property happens elsewhere.
 * @param {any} value - Value to test
 * @returns {value is ExtPackageJson<DriverType>}
 */
function isDriver(value) {
    return isExtension(value) && 'driverName' in value.appium && lodash_1.default.isString(value.appium.driverName);
}
/**
 * Given a `package.json`, return `true` if it represents an Appium Plugin.
 *
 * _This is a type guard; not a validator._
 *
 * To be considered a plugin, a `package.json` must have an `appium.pluginName` field.
 *
 * Further validation of the `appium` property happens elsewhere.
 * @param {any} value - Value to test
 * @returns {value is ExtPackageJson<PluginType>}
 */
function isPlugin(value) {
    return isExtension(value) && 'pluginName' in value.appium && lodash_1.default.isString(value.appium.pluginName);
}
/**
 * Handles reading & writing of extension config files.
 *
 * Only one instance of this class exists per value of `APPIUM_HOME`.
 */
class Manifest {
    /**
     * Sets internal data to a fresh clone of {@link INITIAL_MANIFEST_DATA}
     *
     * Use {@link Manifest.getInstance} instead.
     * @param {string} appiumHome
     * @private
     */
    constructor(appiumHome) {
        _Manifest_instances.add(this);
        /**
         * The entire contents of a parsed YAML extension config file.
         *
         * Contains proxies for automatic persistence on disk
         * @type {ManifestData}
         */
        _Manifest_data.set(this, void 0);
        /**
         * Path to `APPIUM_HOME`.
         * @type {Readonly<string>}
         */
        _Manifest_appiumHome.set(this, void 0);
        /**
         * Path to `extensions.yaml`
         * @type {string}
         * Not set until {@link Manifest.read} is called.
         */
        _Manifest_manifestPath.set(this, void 0);
        /**
         * Helps avoid writing multiple times.
         *
         * If this is `undefined`, calling {@link Manifest.write} will cause it to be
         * set to a `Promise`. When the call to `write()` is complete, the `Promise`
         * will resolve and then this value will be set to `undefined`.  Concurrent calls
         * made while this value is a `Promise` will return the `Promise` itself.
         * @type {Promise<boolean>|undefined}
         */
        _Manifest_writing.set(this, void 0);
        /**
         * Helps avoid reading multiple times.
         *
         * If this is `undefined`, calling {@link Manifest.read} will cause it to be
         * set to a `Promise`. When the call to `read()` is complete, the `Promise`
         * will resolve and then this value will be set to `undefined`.  Concurrent calls
         * made while this value is a `Promise` will return the `Promise` itself.
         * @type {Promise<void>|undefined}
         */
        _Manifest_reading.set(this, void 0);
        __classPrivateFieldSet(this, _Manifest_appiumHome, appiumHome, "f");
        __classPrivateFieldSet(this, _Manifest_data, lodash_1.default.cloneDeep(INITIAL_MANIFEST_DATA), "f");
    }
    /**
     * Searches `APPIUM_HOME` for installed extensions and adds them to the manifest.
     * @param {boolean} hasAppiumDependency - This affects whether or not the "dev" `InstallType` is used
     * @returns {Promise<boolean>} `true` if any extensions were added, `false` otherwise.
     */
    async syncWithInstalledExtensions(hasAppiumDependency = false) {
        // this could be parallelized, but we can't use fs.walk as an async iterator
        let didChange = false;
        /**
         * Listener for the `match` event of a `glob` instance
         * @param {string} filepath - Path to a `package.json`
         * @param {boolean} [devType] - If `true`, this is an extension in "dev mode"
         * @returns {Promise<void>}
         */
        const onMatch = async (filepath, devType = false) => {
            try {
                const pkg = JSON.parse(await support_1.fs.readFile(filepath, 'utf8'));
                if (isExtension(pkg)) {
                    const installType = devType && hasAppiumDependency ? extension_config_1.INSTALL_TYPE_DEV : extension_config_1.INSTALL_TYPE_NPM;
                    const changed = this.addExtensionFromPackage(pkg, filepath, installType);
                    didChange = didChange || changed;
                }
            }
            catch { }
        };
        /**
         * A list of `Promise`s which read `package.json` files looking for Appium extensions.
         * @type {Promise<void>[]}
         */
        const queue = [
            // look at `package.json` in `APPIUM_HOME` only.
            // this causes extensions in "dev mode" to be automatically found
            onMatch(path_1.default.join(__classPrivateFieldGet(this, _Manifest_appiumHome, "f"), 'package.json'), true),
        ];
        // add dependencies to the queue
        const filepaths = await support_1.fs.glob('node_modules/{*,@*/*}/package.json', {
            cwd: __classPrivateFieldGet(this, _Manifest_appiumHome, "f"),
            absolute: true,
        });
        for (const filepath of filepaths) {
            queue.push(onMatch(filepath));
        }
        // wait for everything to finish
        await bluebird_1.default.all(queue);
        return didChange;
    }
    /**
     * Returns `true` if driver with name `name` is registered.
     * @param {string} name - Driver name
     * @returns {boolean}
     */
    hasDriver(name) {
        return Boolean(__classPrivateFieldGet(this, _Manifest_data, "f").drivers[name]);
    }
    /**
     * Returns `true` if plugin with name `name` is registered.
     * @param {string} name - Plugin name
     * @returns {boolean}
     */
    hasPlugin(name) {
        return Boolean(__classPrivateFieldGet(this, _Manifest_data, "f").plugins[name]);
    }
    /**
     * Given a path to a `package.json`, add it as either a driver or plugin to the manifest.
     *
     * @template {ExtensionType} ExtType
     * @param {ExtPackageJson<ExtType>} pkgJson
     * @param {string} pkgPath
     * @param {typeof INSTALL_TYPE_NPM | typeof INSTALL_TYPE_DEV} [installType]
     * @returns {boolean} - `true` if this method did anything.
     */
    addExtensionFromPackage(pkgJson, pkgPath, installType = extension_config_1.INSTALL_TYPE_NPM) {
        const extensionPath = path_1.default.dirname(pkgPath);
        /**
         * @type {InternalMetadata}
         */
        const internal = {
            pkgName: /** @type {string} */ (pkgJson.name),
            version: /** @type {string} */ (pkgJson.version),
            appiumVersion: pkgJson.peerDependencies?.appium,
            installType,
            installSpec: `${pkgJson.name}@${pkgJson.version}`,
            installPath: extensionPath,
        };
        if (isDriver(pkgJson)) {
            const value = {
                ...lodash_1.default.omit(pkgJson.appium, 'driverName'),
                ...internal,
            };
            if (!lodash_1.default.isEqual(value, __classPrivateFieldGet(this, _Manifest_data, "f").drivers[pkgJson.appium.driverName])) {
                this.setExtension(
                /** @type {ExtType} */ (constants_1.DRIVER_TYPE), pkgJson.appium.driverName, 
                /** @type {ExtManifest<ExtType>} */ (value));
                return true;
            }
            return false;
        }
        else if (isPlugin(pkgJson)) {
            const value = {
                ...lodash_1.default.omit(pkgJson.appium, 'pluginName'),
                ...internal,
            };
            if (!lodash_1.default.isEqual(value, __classPrivateFieldGet(this, _Manifest_data, "f").plugins[pkgJson.appium.pluginName])) {
                this.setExtension(
                /** @type {ExtType} */ (constants_1.PLUGIN_TYPE), pkgJson.appium.pluginName, 
                /** @type {ExtManifest<ExtType>} */ (value));
                return true;
            }
            return false;
        }
        else {
            throw new TypeError(`The extension in ${extensionPath} is neither a valid ${constants_1.DRIVER_TYPE} nor a valid ${constants_1.PLUGIN_TYPE}.`);
        }
    }
    /**
     * Adds an extension to the manifest as was installed by the `appium` CLI.  The
     * `extData`, `extType`, and `extName` have already been determined.
     *
     * See {@link Manifest.addExtensionFromPackage} for adding an extension from an on-disk package.
     * @template {ExtensionType} ExtType
     * @param {ExtType} extType - `driver` or `plugin`
     * @param {string} extName - Name of extension
     * @param {ExtManifest<ExtType>} extData - Extension metadata
     * @returns {ExtManifest<ExtType>} A clone of `extData`, potentially with a mutated `appiumVersion` field
     */
    setExtension(extType, extName, extData) {
        const data = lodash_1.default.cloneDeep(extData);
        __classPrivateFieldGet(this, _Manifest_data, "f")[`${extType}s`][extName] = data;
        return data;
    }
    /**
     * Sets the schema revision
     * @param {keyof import('./manifest-migrations').ManifestDataVersions} rev
     */
    setSchemaRev(rev) {
        __classPrivateFieldGet(this, _Manifest_data, "f").schemaRev = rev;
    }
    /**
     * Remove an extension from the manifest.
     * @param {ExtensionType} extType
     * @param {string} extName
     */
    deleteExtension(extType, extName) {
        delete __classPrivateFieldGet(this, _Manifest_data, "f")[`${extType}s`][extName];
    }
    /**
     * Returns the `APPIUM_HOME` path
     */
    get appiumHome() {
        return __classPrivateFieldGet(this, _Manifest_appiumHome, "f");
    }
    /**
     * Returns the path to the manifest file (`extensions.yaml`)
     */
    get manifestPath() {
        return __classPrivateFieldGet(this, _Manifest_manifestPath, "f");
    }
    /**
     * Returns the schema rev of this manifest
     */
    get schemaRev() {
        return __classPrivateFieldGet(this, _Manifest_data, "f").schemaRev;
    }
    /**
     * Returns extension data for a particular type.
     *
     * @template {ExtensionType} ExtType
     * @param {ExtType} extType
     * @returns {Readonly<ExtRecord<ExtType>>}
     */
    getExtensionData(extType) {
        return __classPrivateFieldGet(this, _Manifest_data, "f")[ /** @type {string} */(`${extType}s`)];
    }
    /**
     * Reads manifest from disk and _overwrites_ the internal data.
     *
     * If the manifest does not exist on disk, an
     * {@link INITIAL_MANIFEST_DATA "empty"} manifest file will be created, as
     * well as its directory if needed.
     *
     * This will also, if necessary:
     * 1. perform a migration of the manifest data
     * 2. sync the manifest with extensions on-disk (kind of like "auto
     *    discovery")
     * 3. write the manifest to disk.
     *
     * Only one read operation can happen at a time.
     *
     * @returns {Promise<ManifestData>} The data
     */
    async read() {
        if (__classPrivateFieldGet(this, _Manifest_reading, "f")) {
            await __classPrivateFieldGet(this, _Manifest_reading, "f");
            return __classPrivateFieldGet(this, _Manifest_data, "f");
        }
        __classPrivateFieldSet(this, _Manifest_reading, (async () => {
            /** @type {ManifestData} */
            let data;
            /**
             * This will be `true` if, after reading, we need to update the manifest data
             * and write it again to disk.
             */
            let shouldWrite = false;
            await __classPrivateFieldGet(this, _Manifest_instances, "m", _Manifest_setManifestPath).call(this);
            try {
                const yaml = await support_1.fs.readFile(__classPrivateFieldGet(this, _Manifest_manifestPath, "f"), 'utf8');
                data = yaml_1.default.parse(yaml);
            }
            catch (err) {
                if (err.code === 'ENOENT') {
                    data = lodash_1.default.cloneDeep(INITIAL_MANIFEST_DATA);
                    shouldWrite = true;
                }
                else {
                    if (__classPrivateFieldGet(this, _Manifest_manifestPath, "f")) {
                        throw new Error(`Appium had trouble loading the extension installation ` +
                            `cache file (${__classPrivateFieldGet(this, _Manifest_manifestPath, "f")}). It may be invalid YAML. Specific error: ${err.message}`);
                    }
                    else {
                        throw new Error(`Appium encountered an unknown problem. Specific error: ${err.message}`);
                    }
                }
            }
            __classPrivateFieldSet(this, _Manifest_data, data, "f");
            /**
             * the only way `shouldWrite` is `true` is if we have a new file.  a new
             * file will get the latest schema revision, so we can skip the migration.
             */
            if (!shouldWrite && (data.schemaRev ?? 0) < constants_1.CURRENT_SCHEMA_REV) {
                shouldWrite = await (0, manifest_migrations_1.migrate)(this);
            }
            const hasAppiumDependency = await support_1.env.hasAppiumDependency(this.appiumHome);
            /**
             * we still may want to sync with installed extensions even if we have a
             * new file. right now this is limited to the following cases:
             * 1. we have a brand new manifest file
             * 2. we have performed a migration on a manifest file
             * 3. `appium` is a dependency within `package.json`, and `package.json`
             *    has changed since last time we checked.
             *
             * It may also make sense to sync with the extensions in an arbitrary
             * `APPIUM_HOME`, but we don't do that here.
             */
            if (shouldWrite || (hasAppiumDependency && (await (0, package_changed_1.packageDidChange)(this.appiumHome)))) {
                shouldWrite = (await this.syncWithInstalledExtensions(hasAppiumDependency)) || shouldWrite;
            }
            if (shouldWrite) {
                await this.write();
            }
        })(), "f");
        try {
            await __classPrivateFieldGet(this, _Manifest_reading, "f");
            return __classPrivateFieldGet(this, _Manifest_data, "f");
        }
        finally {
            __classPrivateFieldSet(this, _Manifest_reading, undefined, "f");
        }
    }
    /**
     * Writes the data if it need s writing.
     *
     * If the `schemaRev` prop needs updating, the file will be written.
     *
     * @todo If this becomes too much of a bottleneck, throttle it.
     * @returns {Promise<boolean>} Whether the data was written
     */
    async write() {
        if (__classPrivateFieldGet(this, _Manifest_writing, "f")) {
            return __classPrivateFieldGet(this, _Manifest_writing, "f");
        }
        __classPrivateFieldSet(this, _Manifest_writing, (async () => {
            await __classPrivateFieldGet(this, _Manifest_instances, "m", _Manifest_setManifestPath).call(this);
            try {
                await support_1.fs.mkdirp(path_1.default.dirname(__classPrivateFieldGet(this, _Manifest_manifestPath, "f")));
            }
            catch (err) {
                throw new Error(`Appium could not create the directory for the manifest file: ${path_1.default.dirname(__classPrivateFieldGet(this, _Manifest_manifestPath, "f"))}. Original error: ${err.message}`);
            }
            try {
                await support_1.fs.writeFile(__classPrivateFieldGet(this, _Manifest_manifestPath, "f"), yaml_1.default.stringify(__classPrivateFieldGet(this, _Manifest_data, "f")), 'utf8');
                return true;
            }
            catch (err) {
                throw new Error(`Appium could not write to manifest at ${__classPrivateFieldGet(this, _Manifest_manifestPath, "f")} using APPIUM_HOME ${__classPrivateFieldGet(this, _Manifest_appiumHome, "f")}. Please ensure it is writable. Original error: ${err.message}`);
            }
        })(), "f");
        try {
            return await __classPrivateFieldGet(this, _Manifest_writing, "f");
        }
        finally {
            __classPrivateFieldSet(this, _Manifest_writing, undefined, "f");
        }
    }
}
exports.Manifest = Manifest;
_Manifest_data = new WeakMap(), _Manifest_appiumHome = new WeakMap(), _Manifest_manifestPath = new WeakMap(), _Manifest_writing = new WeakMap(), _Manifest_reading = new WeakMap(), _Manifest_instances = new WeakSet(), _Manifest_setManifestPath = 
/**
 * Ensures the internal manifest path is set.
 *
 * Creates the directory if necessary.
 * @returns {Promise<string>}
 */
async function _Manifest_setManifestPath() {
    if (!__classPrivateFieldGet(this, _Manifest_manifestPath, "f")) {
        __classPrivateFieldSet(this, _Manifest_manifestPath, await support_1.env.resolveManifestPath(__classPrivateFieldGet(this, _Manifest_appiumHome, "f")), "f");
        /* istanbul ignore if */
        if (path_1.default.relative(__classPrivateFieldGet(this, _Manifest_appiumHome, "f"), __classPrivateFieldGet(this, _Manifest_manifestPath, "f")).startsWith('.')) {
            throw new Error(`Mismatch between location of APPIUM_HOME and manifest file. APPIUM_HOME: ${this.appiumHome}, manifest file: ${__classPrivateFieldGet(this, _Manifest_manifestPath, "f")}`);
        }
    }
    return __classPrivateFieldGet(this, _Manifest_manifestPath, "f");
};
/**
 * Returns a new or existing {@link Manifest} instance, based on the value of `appiumHome`.
 *
 * Maintains one instance per value of `appiumHome`.
 */
Manifest.getInstance = lodash_1.default.memoize(
/**
 * @param {string} appiumHome - Path to `APPIUM_HOME`
 * @returns {Manifest}
 */
function _getInstance(appiumHome) {
    return new Manifest(appiumHome);
});
/**
 * Type of the string referring to a driver (typically as a key or type string)
 * @typedef {import('@appium/types').DriverType} DriverType
 */
/**
 * Type of the string referring to a plugin (typically as a key or type string)
 * @typedef {import('@appium/types').PluginType} PluginType
 */
/**
 * @typedef SyncWithInstalledExtensionsOpts
 * @property {number} [depthLimit] - Maximum depth to recurse into subdirectories
 */
/**
 * @typedef {import('appium/types').ManifestData} ManifestData
 * @typedef {import('appium/types').InternalMetadata} InternalMetadata
 */
/**
 * @template {ExtensionType} ExtType
 * @typedef {import('appium/types').ExtPackageJson<ExtType>} ExtPackageJson
 */
/**
 * @template {ExtensionType} ExtType
 * @typedef {import('appium/types').ExtManifest<ExtType>} ExtManifest
 */
/**
 * @template {ExtensionType} ExtType
 * @typedef {import('appium/types').ExtRecord<ExtType>} ExtRecord
 */
/**
 * Either `driver` or `plugin` rn
 * @typedef {import('@appium/types').ExtensionType} ExtensionType
 */
//# sourceMappingURL=manifest.js.map