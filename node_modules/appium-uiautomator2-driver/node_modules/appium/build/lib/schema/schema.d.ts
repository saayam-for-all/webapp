/**
 * Key/value pairs go in... but they don't come out.
 *
 * @template K,V
 * @extends {Map<K,V>}
 */
export class RoachHotelMap<K, V> extends Map<K, V> {
    constructor();
    constructor(entries?: readonly (readonly [K, V])[] | null | undefined);
    constructor();
    constructor(iterable?: Iterable<readonly [K, V]> | null | undefined);
    /**
     * @param {K} key
     * @param {V} value
     */
    set(key: K, value: V): this;
}
/**
 * Extensions that an extension schema file can have.
 */
export const ALLOWED_SCHEMA_EXTENSIONS: Readonly<Set<AllowedSchemaExtension>>;
/**
 * Thrown when the {@link AppiumSchema} instance has not yet been finalized, but
 * the method called requires it.
 */
export class SchemaFinalizationError extends Error {
    constructor();
    /**
     * @type {Readonly<string>}
     */
    code: Readonly<string>;
}
/**
 * Thrown when a "unique" schema ID conflicts with an existing schema ID.
 *
 * This is likely going to be caused by attempting to register the same schema twice.
 */
export class SchemaNameConflictError extends Error {
    /**
     * @param {ExtensionType} extType
     * @param {string} extName
     */
    constructor(extType: ExtensionType, extName: string);
    /**
     * @type {Readonly<string>}
     */
    code: Readonly<string>;
    /**
     * @type {Readonly<{extType: ExtensionType, extName: string}>}
     */
    data: Readonly<{
        extType: ExtensionType;
        extName: string;
    }>;
}
/**
 * Thrown when a schema ID was expected, but it doesn't exist on the {@link Ajv} instance.
 */
export class SchemaUnknownSchemaError extends ReferenceError {
    /**
     * @param {string} schemaId
     */
    constructor(schemaId: string);
    /**
     * @type {Readonly<string>}
     */
    code: Readonly<string>;
    /**
     * @type {Readonly<{schemaId: string}>}
     */
    data: Readonly<{
        schemaId: string;
    }>;
}
/**
 * Thrown when a schema is provided, but it's of an unsupported type.
 *
 * "Valid" schemas which are unsupported include boolean schemas and async schemas
 * (having a `true` `$async` property).
 */
export class SchemaUnsupportedSchemaError extends TypeError {
    /**
     * @param {any} schema
     * @param {ExtensionType} extType
     * @param {string} extName
     */
    constructor(schema: any, extType: ExtensionType, extName: string);
    /**
     * @type {Readonly<string>}
     */
    code: Readonly<string>;
    /**
     * @type {Readonly<{schema: any, extType: ExtensionType, extName: string}>}
     */
    data: Readonly<{
        schema: any;
        extType: ExtensionType;
        extName: string;
    }>;
}
/**
 * Registers a schema from an extension.
 *
 * This is "fail-fast" in that the schema will immediately be validated against JSON schema draft-07 _or_ whatever the value of the schema's `$schema` prop is.
 *
 * Does _not_ add the schema to the `ajv` instance (this is done by {@link AppiumSchema.finalize}).
 * @param {ExtensionType} extType - Extension type
 * @param {string} extName - Unique extension name for `type`
 * @param {SchemaObject} schema - Schema object
 * @throws {SchemaNameConflictError} If the schema is an invalid
 * @returns {void}
 */
export function registerSchema(extType: ExtensionType, extName: string, schema: SchemaObject): void;
export function getAllArgSpecs(): RoachHotelMap<string, ArgSpec<any>>;
/**
 * Returns a {@link ArgSpec} for the given argument name.
 * @param {string} name - CLI argument name
 * @param {ExtensionType} [extType] - Extension type
 * @param {string} [extName] - Extension name
 * @returns {ArgSpec|undefined} ArgSpec or `undefined` if not found
 */
export function getArgSpec(name: string, extType?: ExtensionType, extName?: string): ArgSpec<any> | undefined;
/**
 * Returns `true` if the instance knows about an argument by the given `name`.
 * @param {string} name - CLI argument name
 * @param {ExtensionType} [extType] - Extension type
 * @param {string} [extName] - Extension name
 * @returns {boolean} `true` if such an {@link ArgSpec} exists
 */
export function hasArgSpec(name: string, extType?: ExtensionType, extName?: string): boolean;
/**
 * Return `true` if {@link AppiumSchema.finalize finalize} has been called
 * successfully and {@link AppiumSchema.reset reset} has not been called since.
 * @returns {boolean} If finalized
 */
export function isFinalized(): boolean;
/**
 * Call this when no more schemas will be registered.
 *
 * This does three things:
 * 1. It combines all schemas from extensions into the Appium config schema,
 *    then adds the result to the `Ajv` instance.
 * 2. It adds schemas for _each_ argument/property for validation purposes.
 *    The CLI uses these schemas to validate specific arguments.
 * 3. The schemas are validated against JSON schema draft-07 (which is the
 *    only one supported at this time)
 *
 * Any method in this instance that needs to interact with the `Ajv` instance
 * will throw if this method has not been called.
 *
 * If the instance has already been finalized, this is a no-op.
 * @public
 * @throws {Error} If the schema is not valid
 * @returns {Readonly<Record<string,StrictSchemaObject>>} Record of schema IDs to full schema objects
 */
export function finalizeSchema(): Readonly<Record<string, StrictSchemaObject>>;
/**
 * Resets this instance to its original state.
 *
 * - Removes all added schemas from the `Ajv` instance
 * - Resets the map of {@link ArgSpec ArgSpecs}
 * - Resets the map of registered schemas
 * - Sets the {@link AppiumSchema._finalized _finalized} flag to `false`
 *
 * If you need to call {@link AppiumSchema.finalize} again, you'll want to call this first.
 * @returns {void}
 */
export function resetSchema(): void;
/**
 * Given an object, validates it against the Appium config schema.
 * If errors occur, the returned array will be non-empty.
 * @param {any} value - The value (hopefully an object) to validate against the schema
 * @param {string} [ref] - Schema ID or ref.
 * @public
 * @returns {import('ajv').ErrorObject[]} Array of errors, if any.
 */
export function validate(value: any, ref?: string): import("ajv").ErrorObject[];
/**
 * Retrieves the schema itself
 * @public
 * @param {string} [ref] - Schema ID
 * @throws If the schema has not yet been finalized
 * @returns {SchemaObject}
 */
export function getSchema(ref?: string): SchemaObject;
/**
 * Flatten schema into an array of `SchemaObject`s and associated
 * {@link ArgSpec ArgSpecs}.
 *
 * Converts nested extension schemas to keys based on the extension type and
 * name. Used when translating to `argparse` options or getting the list of
 * default values (see {@link AppiumSchema.getDefaults}) for CLI or otherwise.
 *
 * The return value is an intermediate reprsentation used by `cli-args`
 * module's `toParserArgs`, which converts the finalized schema to parameters
 * used by `argparse`.
 * @throws If {@link AppiumSchema.finalize} has not been called yet.
 * @returns {FlattenedSchema}
 */
export function flattenSchema(): FlattenedSchema;
/**
 * Returns a `Record` of argument "dest" strings to default values.
 *
 * The "dest" string is the property name in object returned by
 * `argparse.ArgumentParser['parse_args']`.
 * @template {boolean|undefined} Flattened
 * @param {Flattened} [flatten=true] - If `true`, flattens the returned object
 * using "keypath"-style keys of the format `<extType>.<extName>.<argName>`.
 * Otherwise, returns a nested object using `extType` and `extName` as
 * properties. Base arguments (server arguments) are always at the top level.
 * @returns {DefaultValues<Flattened>}
 */
export function getDefaultsForSchema<Flattened extends boolean | undefined>(flatten?: Flattened | undefined): DefaultValues<Flattened>;
/**
 * Returns a flattened Record of defaults for a specific extension. Keys will
 * be of format `<argName>`.
 * @param {ExtensionType} extType - Extension type
 * @param {string} extName - Extension name
 * @returns {Record<string,ArgSpecDefaultValue>}
 */
export function getDefaultsForExtension(extType: ExtensionType, extName: string): Record<string, ArgSpecDefaultValue>;
/**
 * Returns `true` if `filename`'s file extension is allowed (in {@link ALLOWED_SCHEMA_EXTENSIONS}).
 * @param {import('type-fest').LiteralUnion<AllowedSchemaExtension, string>} filename
 * @returns {boolean}
 */
export function isAllowedSchemaFileExtension(filename: import("type-fest").LiteralUnion<AllowedSchemaExtension, string>): boolean;
/**
 * Appium only supports schemas that are plain objects; not arrays.
 */
export type SchemaObject = import("ajv").SchemaObject & {
    [key: number]: never;
};
export type ExtensionType = import("@appium/types").ExtensionType;
/**
 * An object having property `additionalProperties: false`
 */
export type StrictProp = {
    additionalProperties: false;
};
/**
 * A {@link SchemaObject} with `additionalProperties: false`
 */
export type StrictSchemaObject = SchemaObject & StrictProp;
/**
 * A list of schemas associated with properties and their corresponding {@link ArgSpec} objects.
 *
 * Intermediate data structure used when converting the entire schema down to CLI arguments.
 */
export type FlattenedSchema = {
    schema: SchemaObject;
    argSpec: ArgSpec<any>;
}[];
export type ArgSpecDefaultValue = any;
/**
 * e.g. `{driver: {foo: 'bar'}}` where `foo` is the arg name and `bar` is the default value.
 */
export type NestedArgSpecDefaultValue = Record<string, Record<string, ArgSpecDefaultValue>>;
/**
 * Helper type for the return value of {@link AppiumSchema.getDefaults}
 */
export type DefaultValues<Flattened extends boolean | undefined> = Record<string, Flattened extends true ? ArgSpecDefaultValue : ArgSpecDefaultValue | NestedArgSpecDefaultValue>;
export type AllowedSchemaExtension = ".json" | ".js" | ".cjs";
import { ArgSpec } from './arg-spec';
//# sourceMappingURL=schema.d.ts.map