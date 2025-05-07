/**
 * https://nodejs.org/api/packages.html#package-entry-points
 *
 * @param {any} exportsValue
 * @returns {string | undefined}
 */
export function resolveEsmEntryPoint(exportsValue: any): string | undefined;
/**
 * "npm" install type
 * Used when extension was installed by npm package name
 * @remarks _All_ extensions are installed _by_ `npm`, but only this one means the package name was
 * used to specify it
 */
export const INSTALL_TYPE_NPM: "npm";
/**
 * "local" install type
 * Used when extension was installed from a local path
 */
export const INSTALL_TYPE_LOCAL: "local";
/**
 * "github" install type
 * Used when extension was installed via GitHub URL
 */
export const INSTALL_TYPE_GITHUB: "github";
/**
 * "git" install type
 * Used when extensions was installed via Git URL
 */
export const INSTALL_TYPE_GIT: "git";
/**
 * "dev" install type
 * Used when automatically detected as a working copy
 */
export const INSTALL_TYPE_DEV: "dev";
/** @type {Set<InstallType>} */
export const INSTALL_TYPES: Set<InstallType>;
/**
 * This class is abstract. It should not be instantiated directly.
 *
 * Subclasses should provide the generic parameter to implement.
 * @template {ExtensionType} ExtType
 */
export class ExtensionConfig<ExtType extends ExtensionType> {
    /**
     * Intended to be called by corresponding instance methods of subclass.
     * @private
     * @template {ExtensionType} ExtType
     * @param {string} appiumHome
     * @param {ExtType} extType
     * @param {ExtName<ExtType>} extName - Extension name (unique to its type)
     * @param {ExtManifestWithSchema<ExtType>} extManifest - Extension config
     * @returns {import('ajv').SchemaObject|undefined}
     */
    private static _readExtensionSchema;
    /**
     * Returns `true` if a specific {@link ExtManifest} object has a `schema` prop.
     * The {@link ExtManifest} object becomes a {@link ExtManifestWithSchema} object.
     * @template {ExtensionType} ExtType
     * @param {ExtManifest<ExtType>} extManifest
     * @returns {extManifest is ExtManifestWithSchema<ExtType>}
     */
    static extDataHasSchema<ExtType_1 extends ExtensionType>(extManifest: ExtManifest<ExtType_1>): extManifest is ExtManifestWithSchema<ExtType_1>;
    /**
     * @protected
     * @param {ExtType} extensionType - Type of extension
     * @param {Manifest} manifest - `Manifest` instance
     */
    protected constructor();
    /**
     * The type of extension this class is responsible for.
     * @type {ExtType}
     */
    extensionType: ExtType;
    /**
     * Manifest data for the extensions of this type.
     *
     * This data should _not_ be written to by anything but {@linkcode Manifest}.
     * @type {Readonly<ExtRecord<ExtType>>}
     */
    installedExtensions: Readonly<ExtRecord<ExtType>>;
    /** @type {import('@appium/types').AppiumLogger} */
    log: import("@appium/types").AppiumLogger;
    /** @type {Manifest} */
    manifest: Manifest;
    get manifestPath(): string;
    get appiumHome(): string;
    /**
     * Returns a list of errors for a given extension.
     *
     * @param {ExtName<ExtType>} extName
     * @param {ExtManifest<ExtType>} extManifest
     * @returns {ExtManifestProblem[]}
     */
    getProblems(extName: ExtName<ExtType>, extManifest: ExtManifest<ExtType>): ExtManifestProblem[];
    /**
     * Returns a list of warnings for a given extension.
     *
     * @param {ExtName<ExtType>} extName
     * @param {ExtManifest<ExtType>} extManifest
     * @returns {Promise<string[]>}
     */
    getWarnings(extName: ExtName<ExtType>, extManifest: ExtManifest<ExtType>): Promise<string[]>;
    /**
     * Returns a list of extension-type-specific issues. To be implemented by subclasses.
     * @abstract
     * @param {ExtManifest<ExtType>} extManifest
     * @param {ExtName<ExtType>} extName
     * @returns {Promise<string[]>}
     */
    getConfigWarnings(extManifest: ExtManifest<ExtType>, extName: ExtName<ExtType>): Promise<string[]>;
    /**
     *
     * @param {Map<ExtName<ExtType>,ExtManifestProblem[]>} [errorMap]
     * @param {Map<ExtName<ExtType>,string[]>} [warningMap]
     */
    getValidationResultSummaries(errorMap?: Map<ExtName<ExtType>, ExtManifestProblem[]>, warningMap?: Map<ExtName<ExtType>, string[]>): {
        errorSummaries: string[];
        warningSummaries: string[];
    };
    /**
     * Checks extensions for problems.  To be called by subclasses' `validate` method.
     *
     * Errors and warnings will be displayed to the user.
     *
     * This method mutates `exts`.
     *
     * @protected
     * @param {ExtRecord<ExtType>} exts - Lookup of extension names to {@linkcode ExtManifest} objects
     * @returns {Promise<ExtRecord<ExtType>>} The same lookup, but picking only error-free extensions
     */
    protected _validate(exts: ExtRecord<ExtType>): Promise<ExtRecord<ExtType>>;
    /**
     * Retrieves listing data for extensions via command class.
     *
     * This is an expensive operation, so the result is cached.  Currently, there is no
     * use case for invalidating the cache.
     * @protected
     * @returns {Promise<import('../cli/extension-command').ExtensionList<ExtType>>}
     */
    protected getListData(): Promise<import("../cli/extension-command").ExtensionList<ExtType>>;
    /**
     * Returns a list of warnings for a particular extension.
     *
     * By definition, a non-empty list of warnings does _not_ imply the extension cannot be loaded,
     * but it may not work as expected or otherwise throw an exception at runtime.
     *
     * @param {ExtManifest<ExtType>} extManifest
     * @param {ExtName<ExtType>} extName
     * @returns {Promise<string[]>}
     */
    getGenericConfigWarnings(extManifest: ExtManifest<ExtType>, extName: ExtName<ExtType>): Promise<string[]>;
    /**
     * Returns list of unrecoverable errors (if any) for the given extension _if_ it has a `schema` property.
     *
     * @param {ExtManifest<ExtType>} extManifest - Extension data (from manifest)
     * @param {ExtName<ExtType>} extName - Extension name (from manifest)
     * @returns {ExtManifestProblem[]}
     */
    getSchemaProblems(extManifest: ExtManifest<ExtType>, extName: ExtName<ExtType>): ExtManifestProblem[];
    /**
     * Return a list of generic unrecoverable errors for the given extension
     * @param {ExtManifest<ExtType>} extManifest - Extension data (from manifest)
     * @param {ExtName<ExtType>} extName - Extension name (from manifest)
     * @returns {ExtManifestProblem[]}
     */
    getGenericConfigProblems(extManifest: ExtManifest<ExtType>, extName: ExtName<ExtType>): ExtManifestProblem[];
    /**
     * @abstract
     * @param {ExtManifest<ExtType>} extManifest
     * @param {ExtName<ExtType>} extName
     * @returns {ExtManifestProblem[]}
     */
    getConfigProblems(extManifest: ExtManifest<ExtType>, extName: ExtName<ExtType>): ExtManifestProblem[];
    /**
     * @param {string} extName
     * @param {ExtManifest<ExtType>} extManifest
     * @param {ExtensionConfigMutationOpts} opts
     * @returns {Promise<void>}
     */
    addExtension(extName: string, extManifest: ExtManifest<ExtType>, { write }?: ExtensionConfigMutationOpts): Promise<void>;
    /**
     * @param {ExtName<ExtType>} extName
     * @param {ExtManifest<ExtType>} extManifest
     * @param {ExtensionConfigMutationOpts} opts
     * @returns {Promise<void>}
     */
    updateExtension(extName: ExtName<ExtType>, extManifest: ExtManifest<ExtType>, { write }?: ExtensionConfigMutationOpts): Promise<void>;
    /**
     * Remove an extension from the list of installed extensions, and optionally avoid a write to the manifest file.
     *
     * @param {ExtName<ExtType>} extName
     * @param {ExtensionConfigMutationOpts} opts
     * @returns {Promise<void>}
     */
    removeExtension(extName: ExtName<ExtType>, { write }?: ExtensionConfigMutationOpts): Promise<void>;
    /**
     * @param {ExtName<ExtType>[]} [activeNames]
     * @returns {void}
     */
    print(activeNames?: ExtName<ExtType>[]): void;
    /**
     * Returns a string describing the extension. Subclasses must implement.
     * @param {ExtName<ExtType>} extName - Extension name
     * @param {ExtManifest<ExtType>} extManifest - Extension data
     * @returns {string}
     * @abstract
     */
    extensionDesc(extName: ExtName<ExtType>, extManifest: ExtManifest<ExtType>): string;
    /**
     * Returns--with reasonable accuracy--the path on disk to the extension.
     *
     * If `installPath` is present in the manifest, then it is used; otherwise we just guess.
     * @param {keyof typeof this.installedExtensions} extName
     * @returns {string}
     */
    getInstallPath(extName: keyof typeof this.installedExtensions): string;
    /**
     *
     * @param {ExtName<ExtType>} extName
     * @returns {Promise<[string, string]>}
     */
    _resolveExtension(extName: ExtName<ExtType>): Promise<[string, string]>;
    /**
     * Loads extension asynchronously and returns its main class (constructor)
     *
     * @param {ExtName<ExtType>} extName
     * @returns {Promise<ExtClass<ExtType>>}
     */
    requireAsync(extName: ExtName<ExtType>): Promise<ExtClass<ExtType>>;
    /**
     * @param {string} extName
     * @returns {boolean}
     */
    isInstalled(extName: string): boolean;
    /**
     * If an extension provides a schema, this will load the schema and attempt to
     * register it with the schema registrar.
     * @param {ExtName<ExtType>} extName - Name of extension
     * @param {ExtManifestWithSchema<ExtType>} extManifest - Extension data
     * @returns {import('ajv').SchemaObject|undefined}
     */
    readExtensionSchema(extName: ExtName<ExtType>, extManifest: ExtManifestWithSchema<ExtType>): import("ajv").SchemaObject | undefined;
    #private;
}
/**
 * An issue with the {@linkcode ExtManifest} for a particular extension.
 *
 * The existance of such an object implies that the extension cannot be loaded.
 */
export type ExtManifestProblem = {
    /**
     * - Error message
     */
    err: string;
    /**
     * - Associated value
     */
    val: any;
};
/**
 * An optional logging function provided to an {@link ExtensionConfig} subclass.
 */
export type ExtensionLogFn = (...args: any[]) => void;
export type ExtensionType = import("@appium/types").ExtensionType;
export type Manifest = import("./manifest").Manifest;
export type InstallType = import("appium/types").InstallType;
export type ExtManifest<ExtType extends ExtensionType> = import("appium/types").ExtManifest<ExtType>;
export type ExtManifestWithSchema<ExtType extends ExtensionType> = ExtManifest<ExtType> & {
    schema: NonNullable<ExtManifest<ExtType>["schema"]>;
};
export type ExtName<ExtType extends ExtensionType> = import("appium/types").ExtName<ExtType>;
export type ExtClass<ExtType extends ExtensionType> = import("appium/types").ExtClass<ExtType>;
export type ExtRecord<ExtType extends ExtensionType> = import("appium/types").ExtRecord<ExtType>;
export type ExtCommand<ExtType extends ExtensionType> = import("../cli/extension").ExtCommand<ExtType>;
/**
 * Options for various methods in {@link ExtensionConfig}
 */
export type ExtensionConfigMutationOpts = {
    /**
     * Whether or not to write the manifest to disk after a mutation operation
     */
    write?: boolean | undefined;
};
//# sourceMappingURL=extension-config.d.ts.map