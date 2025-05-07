/**
 * Handles reading & writing of extension config files.
 *
 * Only one instance of this class exists per value of `APPIUM_HOME`.
 */
export class Manifest {
    /**
     * Returns a new or existing {@link Manifest} instance, based on the value of `appiumHome`.
     *
     * Maintains one instance per value of `appiumHome`.
     */
    static getInstance: ((appiumHome: string) => Manifest) & _.MemoizedFunction;
    /**
     * Sets internal data to a fresh clone of {@link INITIAL_MANIFEST_DATA}
     *
     * Use {@link Manifest.getInstance} instead.
     * @param {string} appiumHome
     * @private
     */
    private constructor();
    /**
     * Searches `APPIUM_HOME` for installed extensions and adds them to the manifest.
     * @param {boolean} hasAppiumDependency - This affects whether or not the "dev" `InstallType` is used
     * @returns {Promise<boolean>} `true` if any extensions were added, `false` otherwise.
     */
    syncWithInstalledExtensions(hasAppiumDependency?: boolean): Promise<boolean>;
    /**
     * Returns `true` if driver with name `name` is registered.
     * @param {string} name - Driver name
     * @returns {boolean}
     */
    hasDriver(name: string): boolean;
    /**
     * Returns `true` if plugin with name `name` is registered.
     * @param {string} name - Plugin name
     * @returns {boolean}
     */
    hasPlugin(name: string): boolean;
    /**
     * Given a path to a `package.json`, add it as either a driver or plugin to the manifest.
     *
     * @template {ExtensionType} ExtType
     * @param {ExtPackageJson<ExtType>} pkgJson
     * @param {string} pkgPath
     * @param {typeof INSTALL_TYPE_NPM | typeof INSTALL_TYPE_DEV} [installType]
     * @returns {boolean} - `true` if this method did anything.
     */
    addExtensionFromPackage<ExtType extends ExtensionType>(pkgJson: ExtPackageJson<ExtType>, pkgPath: string, installType?: typeof INSTALL_TYPE_NPM | typeof INSTALL_TYPE_DEV): boolean;
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
    setExtension<ExtType extends ExtensionType>(extType: ExtType, extName: string, extData: ExtManifest<ExtType>): ExtManifest<ExtType>;
    /**
     * Sets the schema revision
     * @param {keyof import('./manifest-migrations').ManifestDataVersions} rev
     */
    setSchemaRev(rev: keyof import("./manifest-migrations").ManifestDataVersions): void;
    /**
     * Remove an extension from the manifest.
     * @param {ExtensionType} extType
     * @param {string} extName
     */
    deleteExtension(extType: ExtensionType, extName: string): void;
    /**
     * Returns the `APPIUM_HOME` path
     */
    get appiumHome(): string;
    /**
     * Returns the path to the manifest file (`extensions.yaml`)
     */
    get manifestPath(): string;
    /**
     * Returns the schema rev of this manifest
     */
    get schemaRev(): number;
    /**
     * Returns extension data for a particular type.
     *
     * @template {ExtensionType} ExtType
     * @param {ExtType} extType
     * @returns {Readonly<ExtRecord<ExtType>>}
     */
    getExtensionData<ExtType extends ExtensionType>(extType: ExtType): Readonly<ExtRecord<ExtType>>;
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
    read(): Promise<ManifestData>;
    /**
     * Writes the data if it need s writing.
     *
     * If the `schemaRev` prop needs updating, the file will be written.
     *
     * @todo If this becomes too much of a bottleneck, throttle it.
     * @returns {Promise<boolean>} Whether the data was written
     */
    write(): Promise<boolean>;
    #private;
}
/**
 * Type of the string referring to a driver (typically as a key or type string)
 */
export type DriverType = import("@appium/types").DriverType;
/**
 * Type of the string referring to a plugin (typically as a key or type string)
 */
export type PluginType = import("@appium/types").PluginType;
export type SyncWithInstalledExtensionsOpts = {
    /**
     * - Maximum depth to recurse into subdirectories
     */
    depthLimit?: number | undefined;
};
export type ManifestData = import("appium/types").ManifestData;
export type InternalMetadata = import("appium/types").InternalMetadata;
export type ExtPackageJson<ExtType extends ExtensionType> = import("appium/types").ExtPackageJson<ExtType>;
export type ExtManifest<ExtType extends ExtensionType> = import("appium/types").ExtManifest<ExtType>;
export type ExtRecord<ExtType extends ExtensionType> = import("appium/types").ExtRecord<ExtType>;
/**
 * Either `driver` or `plugin` rn
 */
export type ExtensionType = import("@appium/types").ExtensionType;
import { INSTALL_TYPE_NPM } from './extension-config';
import { INSTALL_TYPE_DEV } from './extension-config';
import _ from 'lodash';
//# sourceMappingURL=manifest.d.ts.map