/**
 * The original ID of the Appium config schema.
 * We use this in the CLI to convert it to `argparse` options.
 */
export const APPIUM_CONFIG_SCHEMA_ID: "appium.json";
/**
 * The schema prop containing server-related options. Everything in here
 * is "native" to Appium.
 * Used by {@link flattenSchema} for transforming the schema into CLI args.
 */
export const SERVER_PROP_NAME: "server";
/**
 * An `ArgSpec` is a class representing metadata about an argument (or config
 * option) used for cross-referencing.
 *
 * This class has no instance methods, and is basically just a read-only "struct".
 * @template D
 */
export class ArgSpec<D> {
    /**
     * Return the schema ID (`$id`) for the **argument** given the parameters.
     *
     * If you need the "root" or "base" schema ID, use {@link ArgSpec.toSchemaBaseRef} instead.
     * @param {string} name - Argument name
     * @param {ExtensionType} [extType] - Extension type
     * @param {string} [extName] - Extension name
     * @returns {string} Schema ID
     */
    static toSchemaRef(name: string, extType?: ExtensionType, extName?: string): string;
    /**
     * Return the schema ID for an extension or the base schema ID.
     * @param {ExtensionType} [extType] - Extension type
     * @param {string} [extName] - Extension name
     */
    static toSchemaBaseRef(extType?: ExtensionType, extName?: string): string;
    /**
     * Return the unique ID for the argument given the parameters.
     * @param {string} name - Argument name
     * @param {ExtensionType} [extType] - Extension type
     * @param {string} [extName] - Extension name
     * @returns {string} Unique ID
     */
    static toArg(name: string, extType?: ExtensionType, extName?: string): string;
    /**
     * Normalizes a raw extension name (not including the type).
     * @param {string} extName - Extension name
     * @returns {string} Normalized extension name
     */
    static toNormalizedExtName(extName: string): string;
    /**
     * When given the root ID of a schema for an extension (`<extType>-<normalizedExtName>.json`) Returns an object containing the extension type and the _normalized_ extension name.
     * @param {string} schemaId - Root schema ID
     * @returns { {extType?: ExtensionType, normalizedExtName?: string} }
     */
    static extensionInfoFromRootSchemaId(schemaId: string): {
        extType?: ExtensionType;
        normalizedExtName?: string;
    };
    /**
     * Creates an `ArgSpec`
     *
     * @param {string} name - The canonical name of the argument. Corresponds to a key in a schema's
     * `properties` property.
     * @template D
     * @param {ArgSpecOptions<D>} [opts] - Options
     * @returns {Readonly<ArgSpec>}
     */
    static create<D_1>(name: string, opts?: ArgSpecOptions<D_1>): Readonly<ArgSpec<any>>;
    /**
     * Builds some computed fields and assigns them to the instance.
     *
     * Undefined properties are not assigned.
     *
     * The _constructor_ is private. Use {@link ArgSpec.create} instead.
     * @private
     * @param {string} name
     * @param {ArgSpecOptions<D>} opts
     */
    private constructor();
    /**
     * The canonical name of the argument. Corresponds to key in schema's `properties` prop.
     * @type {string}
     */
    name: string;
    /**
     * The `ExtensionType` of the argument. This will be set if the arg came from an extension;
     * otherwise it will be `undefined`.
     * @type {ExtensionType|undefined}
     */
    extType: ExtensionType | undefined;
    /**
     * The name of the extension, if this argument came from an extension.
     *
     * Otherwise `undefined`.
     * @type {string|undefined}
     */
    extName: string | undefined;
    /**
     * The schema ID (`$id`) for the argument.  This is automatically determined, and any user-provided `$id`s will be overwritten.
     *
     * @type {string}
     */
    ref: string;
    /**
     * The CLI argument, sans leading dashes.
     * @type {string}
     */
    arg: string;
    /**
     * The desired keypath for the argument after arguments have been parsed.
     *
     * Typically this is camelCased.  If the arg came from an extension, it will be prefixed with
     * `<extType>.<extName>.`
     * @type {string}
     */
    dest: string;
    /**
     * The same as {@link ArgSpec.dest} but without the leading `<extType>.<extName>.` prefix.
     */
    rawDest: string;
    /**
     * Whatever the default value of this argument is, as specified by the
     * `default` property of the schema.
     * @type {D|undefined}
     */
    defaultValue: D | undefined;
    /**
     * String representation, useful for debugging
     * @returns {string}
     */
    toString(): string;
}
/**
 * Options for {@link ArgSpec.create}
 */
export type ArgSpecOptions<D> = {
    extName?: string | undefined;
    extType?: import("@appium/types").ExtensionType | undefined;
    dest?: string | undefined;
    defaultValue?: D | undefined;
};
export type ExtensionType = import("@appium/types").ExtensionType;
//# sourceMappingURL=arg-spec.d.ts.map