/**
 * @extends {ExtensionConfig<PluginType>}
 */
export class PluginConfig extends ExtensionConfig<"plugin"> {
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
    private static _instances;
    /**
     * Creates a new {@link PluginConfig} instance for a {@link Manifest} instance.
     *
     * @param {Manifest} manifest
     * @throws If `manifest` already associated with a `PluginConfig`
     * @returns {PluginConfig}
     */
    static create(manifest: Manifest): PluginConfig;
    /**
     * Returns a PluginConfig associated with a Manifest
     * @param {Manifest} manifest
     * @returns {PluginConfig|undefined}
     */
    static getInstance(manifest: Manifest): PluginConfig | undefined;
    /**
     * Call {@link PluginConfig.create} instead.
     *
     * Just calls the superclass' constructor with the correct extension type
     * @private
     * @param {Manifest} manifest - IO object
     */
    private constructor();
    validate(): Promise<import("./extension-config").ExtRecord<"plugin">>;
    /**
     *
     * @param {(keyof import('appium/types').ExtRecord<PluginType>)[]} activeNames
     * @returns {void}
     */
    print(activeNames: (keyof import("appium/types").ExtRecord<PluginType>)[]): void;
}
export type PluginConfigOptions = {
    /**
     * - Optional logging function
     */
    logFn?: import("./extension-config").ExtensionLogFn | undefined;
};
export type PluginType = import("@appium/types").PluginType;
export type PluginMetadata = import("appium/types").ExtMetadata<PluginType>;
export type Manifest = import("./manifest").Manifest;
import { ExtensionConfig } from './extension-config';
//# sourceMappingURL=plugin-config.d.ts.map