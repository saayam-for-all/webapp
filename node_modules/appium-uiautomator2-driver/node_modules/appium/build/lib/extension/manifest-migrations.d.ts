/**
 * Applies a series of migration functions to a manifest to update its manifest schema version.
 *
 * `data` is modified in-place.
 *
 * @param {Readonly<Manifest>} manifest
 * @returns {Promise<boolean>} If `true` existing packages should be synced from disk and the manifest should be persisted.
 */
export function migrate(manifest: Readonly<Manifest>): Promise<boolean>;
/**
 * A migration function. It will return `true` if a change _should be made_.
 *
 * A migration function should not modify `schemaRev`, as this is done automatically.
 *
 * Note that at the time of writing, we're not able to determine the version of the _current_ manifest file if there is no `schemaRev` prop present (and we may not want to trust it anyway).
 */
export type Migration = (manifest: Readonly<Manifest>) => boolean | Promise<boolean>;
export type ManifestData = import("appium/types").ManifestData;
export type DriverType = import("@appium/types").DriverType;
export type PluginType = import("@appium/types").PluginType;
export type AnyManifestDataVersion = import("appium/types").AnyManifestDataVersion;
export type ManifestDataVersions = import("appium/types").ManifestDataVersions;
export type ExtensionType = import("@appium/types").ExtensionType;
export type ManifestDataV2 = import("appium/types").ManifestV2.ManifestData;
export type Manifest = import("./manifest").Manifest;
export type ExtManifest<ExtType extends ExtensionType> = import("appium/types").ExtManifest<ExtType>;
//# sourceMappingURL=manifest-migrations.d.ts.map