"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgSpec = exports.SERVER_PROP_NAME = exports.APPIUM_CONFIG_SCHEMA_ID = void 0;
const lodash_1 = __importDefault(require("lodash"));
/**
 * The original ID of the Appium config schema.
 * We use this in the CLI to convert it to `argparse` options.
 */
exports.APPIUM_CONFIG_SCHEMA_ID = 'appium.json';
/**
 * The schema prop containing server-related options. Everything in here
 * is "native" to Appium.
 * Used by {@link flattenSchema} for transforming the schema into CLI args.
 */
exports.SERVER_PROP_NAME = 'server';
/**
 * Used to parse extension info from a schema ID.
 */
const SCHEMA_ID_REGEXP = /^(?<extType>.+?)-(?<normalizedExtName>.+)\.json$/;
/**
 * Avoid typos by using constants!
 */
const PROPERTIES = 'properties';
/**
 * An `ArgSpec` is a class representing metadata about an argument (or config
 * option) used for cross-referencing.
 *
 * This class has no instance methods, and is basically just a read-only "struct".
 * @template D
 */
class ArgSpec {
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
    constructor(name, { extType, extName, dest, defaultValue } = {}) {
        // we must normalize the extension name to fit into our convention for CLI
        // args.
        const arg = ArgSpec.toArg(name, extType, extName);
        const ref = ArgSpec.toSchemaRef(name, extType, extName);
        // if no explicit `dest` provided, just camelCase the name to avoid needing
        // to use bracket syntax when accessing props on the parsed args object.
        const rawDest = lodash_1.default.camelCase(dest ?? name);
        const destKeypath = extType && extName ? [extType, extName, rawDest].join('.') : rawDest;
        this.defaultValue = defaultValue;
        this.name = name;
        this.extType = extType;
        this.extName = extName;
        this.arg = arg;
        this.dest = destKeypath;
        this.ref = ref;
        this.rawDest = rawDest;
    }
    /**
     * Return the schema ID (`$id`) for the **argument** given the parameters.
     *
     * If you need the "root" or "base" schema ID, use {@link ArgSpec.toSchemaBaseRef} instead.
     * @param {string} name - Argument name
     * @param {ExtensionType} [extType] - Extension type
     * @param {string} [extName] - Extension name
     * @returns {string} Schema ID
     */
    static toSchemaRef(name, extType, extName) {
        const baseRef = ArgSpec.toSchemaBaseRef(extType, extName);
        if (extType && extName) {
            return [`${baseRef}#`, PROPERTIES, name].join('/');
        }
        return [`${baseRef}#`, PROPERTIES, exports.SERVER_PROP_NAME, PROPERTIES, name].join('/');
    }
    /**
     * Return the schema ID for an extension or the base schema ID.
     * @param {ExtensionType} [extType] - Extension type
     * @param {string} [extName] - Extension name
     */
    static toSchemaBaseRef(extType, extName) {
        if (extType && extName) {
            return `${extType}-${ArgSpec.toNormalizedExtName(extName)}.json`;
        }
        return exports.APPIUM_CONFIG_SCHEMA_ID;
    }
    /**
     * Return the unique ID for the argument given the parameters.
     * @param {string} name - Argument name
     * @param {ExtensionType} [extType] - Extension type
     * @param {string} [extName] - Extension name
     * @returns {string} Unique ID
     */
    static toArg(name, extType, extName) {
        const properName = lodash_1.default.kebabCase(name.replace(/^--?/, ''));
        if (extType && extName) {
            return [extType, lodash_1.default.kebabCase(extName), properName].join('-');
        }
        return properName;
    }
    /**
     * Normalizes a raw extension name (not including the type).
     * @param {string} extName - Extension name
     * @returns {string} Normalized extension name
     */
    static toNormalizedExtName(extName) {
        return lodash_1.default.kebabCase(extName);
    }
    /**
     * When given the root ID of a schema for an extension (`<extType>-<normalizedExtName>.json`) Returns an object containing the extension type and the _normalized_ extension name.
     * @param {string} schemaId - Root schema ID
     * @returns { {extType?: ExtensionType, normalizedExtName?: string} }
     */
    static extensionInfoFromRootSchemaId(schemaId) {
        const matches = schemaId.match(SCHEMA_ID_REGEXP);
        if (matches?.groups) {
            const { extType, normalizedExtName } = 
            /** @type { {extType: ExtensionType, normalizedExtName: string} } */ (matches.groups);
            return { extType, normalizedExtName };
        }
        return {};
    }
    /**
     * Creates an `ArgSpec`
     *
     * @param {string} name - The canonical name of the argument. Corresponds to a key in a schema's
     * `properties` property.
     * @template D
     * @param {ArgSpecOptions<D>} [opts] - Options
     * @returns {Readonly<ArgSpec>}
     */
    static create(name, opts) {
        return Object.freeze(new ArgSpec(name, opts));
    }
    /**
     * String representation, useful for debugging
     * @returns {string}
     */
    /* istanbul ignore next */
    toString() {
        let str = `[ArgSpec] ${this.name} (${this.ref})`;
        if (this.extType && this.extName) {
            str += ` (ext: ${this.extType}/${this.extName})`;
        }
        return str;
    }
}
exports.ArgSpec = ArgSpec;
/**
 * Options for {@link ArgSpec.create}
 * @template D
 * @typedef ArgSpecOptions
 * @property {string} [extName]
 * @property {ExtensionType} [extType]
 * @property {string} [dest]
 * @property {D} [defaultValue]
 */
/**
 * @typedef {import('@appium/types').ExtensionType} ExtensionType
 */
//# sourceMappingURL=arg-spec.js.map