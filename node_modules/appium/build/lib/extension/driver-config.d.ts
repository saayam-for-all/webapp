/**
 * @extends {ExtensionConfig<DriverType>}
 */
export class DriverConfig extends ExtensionConfig<"driver"> {
    /**
     * A mapping of {@link Manifest} instances to {@link DriverConfig} instances.
     *
     * `Manifest` and `ExtensionConfig` have a one-to-many relationship; each `Manifest` should be associated with a `DriverConfig` and a `PluginConfig`; no more, no less.
     *
     * This variable tracks the `Manifest`-to-`DriverConfig` portion.
     *
     * @type {WeakMap<Manifest,DriverConfig>}
     * @private
     */
    private static _instances;
    /**
     * Creates a new {@link DriverConfig} instance for a {@link Manifest} instance.
     *
     * @param {Manifest} manifest
     * @throws If `manifest` already associated with a `DriverConfig`
     * @returns {DriverConfig}
     */
    static create(manifest: Manifest): DriverConfig;
    /**
     * Returns a DriverConfig associated with a Manifest
     * @param {Manifest} manifest
     * @returns {DriverConfig|undefined}
     */
    static getInstance(manifest: Manifest): DriverConfig | undefined;
    /**
     * Call {@link DriverConfig.create} instead.
     * @private
     * @param {import('./manifest').Manifest} manifest - Manifest instance
     */
    private constructor();
    /**
     * A set of unique automation names used by drivers.
     * @type {Set<string>}
     */
    knownAutomationNames: Set<string>;
    /**
     * Checks extensions for problems
     */
    validate(): Promise<import("./extension-config").ExtRecord<"driver">>;
    /**
     * @param {ExtManifest<DriverType>} extData
     * @returns {import('./extension-config').ExtManifestProblem[]}
     */
    getConfigProblems(extData: ExtManifest<DriverType>): import("./extension-config").ExtManifestProblem[];
    /**
     * Given capabilities, find a matching driver within the config. Load its class and return it along with version and driver name.
     * @template {import('@appium/types').StringRecord} C
     * @param {C} caps
     * @returns {Promise<MatchedDriver>}
     */
    findMatchingDriver<C extends import("@appium/types").StringRecord>({ automationName, platformName }: C): Promise<MatchedDriver>;
    /**
     * Given an automation name and platform name, find a suitable driver and return its extension data.
     * @param {string} matchAutomationName
     * @param {string} matchPlatformName
     * @returns {ExtMetadata<DriverType> & import('appium/types').InternalMetadata & import('appium/types').CommonExtMetadata}
     */
    _getDriverBySupport(matchAutomationName: string, matchPlatformName: string): ExtMetadata<DriverType> & import("appium/types").InternalMetadata & import("appium/types").CommonExtMetadata;
}
export type ExtMetadata<T extends ExtensionType> = import("appium/types").ExtMetadata<T>;
export type ExtManifest<T extends ExtensionType> = import("appium/types").ExtManifest<T>;
export type ExtensionType = import("@appium/types").ExtensionType;
export type ManifestData = import("appium/types").ManifestData;
export type DriverType = import("@appium/types").DriverType;
export type Manifest = import("./manifest").Manifest;
export type ExtRecord<T extends ExtensionType> = import("appium/types").ExtRecord<T>;
export type ExtName<T extends ExtensionType> = import("appium/types").ExtName<T>;
/**
 * Return value of {@linkcode DriverConfig.findMatchingDriver}
 */
export type MatchedDriver = {
    driver: import("@appium/types").DriverClass;
    version: string;
    driverName: string;
};
import { ExtensionConfig } from './extension-config';
//# sourceMappingURL=driver-config.d.ts.map