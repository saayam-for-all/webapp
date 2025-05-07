"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toParserArgs = toParserArgs;
const argparse_1 = require("argparse");
const lodash_1 = __importDefault(require("lodash"));
const config_file_1 = require("../config-file");
const schema_1 = require("./schema");
const cli_transformers_1 = require("./cli-transformers");
/**
 * This module concerns functions which convert schema definitions to
 * `argparse`-compatible data structures, for deriving CLI arguments from a
 * schema.
 */
/**
 * Lookup of possible values for the `type` field in a JSON schema.
 * @type {Readonly<Record<string, import('json-schema').JSONSchema7TypeName>>}
 */
const TYPENAMES = Object.freeze({
    ARRAY: 'array',
    OBJECT: 'object',
    BOOLEAN: 'boolean',
    INTEGER: 'integer',
    NUMBER: 'number',
    NULL: 'null',
    STRING: 'string',
});
/**
 * Options with alias lengths less than this will be considered "short" flags.
 */
const SHORT_ARG_CUTOFF = 3;
/**
 * Convert an alias (`foo`) to a flag (`--foo`) or a short flag (`-f`).
 * @param {ArgSpec} argSpec - the argument specification
 * @param {string} [alias] - the alias to convert to a flag
 * @returns {string} the flag
 */
function aliasToFlag(argSpec, alias) {
    const { extType, extName, name } = argSpec;
    const arg = alias ?? name;
    const isShort = arg.length < SHORT_ARG_CUTOFF;
    if (extType && extName) {
        return isShort
            ? `--${extType}-${lodash_1.default.kebabCase(extName)}-${arg}`
            : `--${extType}-${lodash_1.default.kebabCase(extName)}-${lodash_1.default.kebabCase(arg)}`;
    }
    return isShort ? `-${arg}` : `--${lodash_1.default.kebabCase(arg)}`;
}
/**
 * Converts a string to SCREAMING_SNAKE_CASE
 */
const screamingSnakeCase = lodash_1.default.flow(lodash_1.default.snakeCase, lodash_1.default.toUpper);
/**
 * Given unique property name `name`, return a function which validates a value
 * against a property within the schema.
 * @template Coerced
 * @param {ArgSpec} argSpec - Argument name
 * @param {(value: string) => Coerced} [coerce] - Function to coerce to a different
 * primitive
 * @todo See if we can remove `coerce` by allowing Ajv to coerce in its
 * constructor options
 * @returns
 */
function getSchemaValidator({ ref: schemaId }, coerce = lodash_1.default.identity) {
    /** @param {string} value */
    return (value) => {
        const coerced = coerce(value);
        const errors = (0, schema_1.validate)(coerced, schemaId);
        if (lodash_1.default.isEmpty(errors)) {
            return coerced;
        }
        throw new argparse_1.ArgumentTypeError('\n\n' + (0, config_file_1.formatErrors)(errors, value, { schemaId }));
    };
}
/**
 * Determine the description for display on the CLI, given the schema.
 * @param {AppiumJSONSchema} schema
 * @returns {string}
 */
function makeDescription(schema) {
    const { appiumCliDescription, description = '', appiumDeprecated } = schema;
    let desc = appiumCliDescription ?? description;
    if (appiumDeprecated) {
        desc = `[DEPRECATED] ${desc}`;
    }
    return desc;
}
/**
 * Given arg `name`, a JSON schema `subSchema`, and options, return an argument definition
 * as understood by `argparse`.
 * @param {AppiumJSONSchema} subSchema - JSON schema for the option
 * @param {ArgSpec} argSpec - Argument spec tuple
 * @returns {[[string]|[string, string], import('argparse').ArgumentOptions]} Tuple of flag and options
 */
function subSchemaToArgDef(subSchema, argSpec) {
    let { type, appiumCliAliases, appiumCliTransformer, enum: enumValues } = subSchema;
    const { name, arg } = argSpec;
    const aliases = [
        aliasToFlag(argSpec),
        ... /** @type {string[]} */(appiumCliAliases ?? []).map((alias) => aliasToFlag(argSpec, alias)),
    ];
    /** @type {import('argparse').ArgumentOptions} */
    let argOpts = {
        required: false,
        help: makeDescription(subSchema),
    };
    /**
     * Generally we will provide a `type` to `argparse` as a function which
     * validates using ajv (which is much more full-featured than what `argparse`
     * can offer). The exception is `boolean`-type options, which have no
     * `argType`.
     *
     * Not sure if this type is correct, but it's not doing what I want.  I want
     * to say "this is a function which returns something of type `T` where `T` is
     * never a `Promise`".  This function must be sync.
     * @type {((value: string) => unknown)|undefined}
     */
    let argTypeFunction;
    // handle special cases for various types
    switch (type) {
        // booleans do not have a type per `ArgumentOptions`, just an "action"
        // NOTE: due to limitations of `argparse`, we cannot provide fancy help text, and must rely on its internal error messaging.
        case TYPENAMES.BOOLEAN: {
            argOpts.action = 'store_const';
            argOpts.const = true;
            break;
        }
        case TYPENAMES.OBJECT: {
            argTypeFunction = lodash_1.default.flow(cli_transformers_1.transformers.json, (o) => {
                // Arrays and plain strings are also valid JSON
                if (!lodash_1.default.isPlainObject(o)) {
                    throw new argparse_1.ArgumentTypeError(`'${lodash_1.default.truncate(o, { length: 100 })}' must be a plain object`);
                    ;
                }
                return o;
            });
            break;
        }
        // arrays are treated as CSVs, because `argparse` doesn't handle array data.
        case TYPENAMES.ARRAY: {
            argTypeFunction = cli_transformers_1.parseCsvLine;
            break;
        }
        // "number" type is coerced to float. `argparse` does this for us if we use `float` type, but
        // we don't.
        case TYPENAMES.NUMBER: {
            argTypeFunction = getSchemaValidator(argSpec, parseFloat);
            break;
        }
        // "integer" is coerced to an .. integer.  again, `argparse` would do this for us if we used `int`.
        case TYPENAMES.INTEGER: {
            argTypeFunction = getSchemaValidator(argSpec, lodash_1.default.parseInt);
            break;
        }
        // strings (like number and integer) are subject to further validation
        // (e.g., must satisfy a mask or regex or even some custom validation
        // function)
        case TYPENAMES.STRING: {
            argTypeFunction = getSchemaValidator(argSpec);
            break;
        }
        // TODO: there may be some way to restrict this at the Ajv level --
        // that may involve patching the metaschema.
        case TYPENAMES.NULL:
        // falls through
        default: {
            throw new TypeError(`Schema property "${arg}": \`${type}\` type unknown or disallowed`);
        }
    }
    // metavar is used in help text. `boolean` cannot have a metavar--it is not
    // displayed--and `argparse` throws if you give it one.
    if (type !== TYPENAMES.BOOLEAN) {
        argOpts.metavar = screamingSnakeCase(name);
    }
    if (appiumCliTransformer && cli_transformers_1.transformers[appiumCliTransformer]) {
        if (type === TYPENAMES.ARRAY) {
            const csvTransformer = /** @type {(x: string) => string[]} */ (argTypeFunction);
            argTypeFunction = (val) => lodash_1.default.flatMap(csvTransformer(val).map(cli_transformers_1.transformers[appiumCliTransformer]));
        }
        else {
            argTypeFunction = lodash_1.default.flow(argTypeFunction ?? lodash_1.default.identity, cli_transformers_1.transformers[appiumCliTransformer]);
        }
    }
    if (argTypeFunction) {
        argOpts.type = argTypeFunction;
    }
    // convert JSON schema `enum` to `choices`. `enum` can contain any JSON type, but `argparse`
    // is limited to a single type per arg (I think).  so let's make everything a string.
    // and might as well _require_ the `type: string` while we're at it.
    if (enumValues && !lodash_1.default.isEmpty(enumValues)) {
        if (type === TYPENAMES.STRING) {
            argOpts.choices = enumValues.map(String);
        }
        else {
            throw new TypeError(`Problem with schema for ${arg}; \`enum\` is only supported for \`type: 'string'\``);
        }
    }
    // TODO: argparse only accepts the command name and a single alias; any extra aliases
    // will be silently discarded.
    const finalAliases = /** @type {[string]|[string, string]} */ (aliases);
    return [finalAliases, argOpts];
}
/**
 * Converts the finalized, flattened schema representation into
 * ArgumentDefinitions for handoff to `argparse`.
 *
 * @throws If schema has not been added to ajv (via `finalizeSchema()`)
 * @returns {import('../cli/args').ArgumentDefinitions} A map of arryas of
 * aliases to `argparse` arguments; empty if no schema found
 */
function toParserArgs() {
    const flattened = (0, schema_1.flattenSchema)().filter(({ schema }) => !schema.appiumCliIgnored);
    return new Map(lodash_1.default.map(flattened, ({ schema, argSpec }) => subSchemaToArgDef(schema, argSpec)));
}
/**
 * @template {string|number} T
 * @typedef {import('ajv/dist/types').FormatValidator<T>} FormatValidator<T>
 */
/**
 * A JSON 7 schema with our custom keywords.
 * @typedef {import('./keywords').AppiumJSONSchemaKeywords & import('json-schema').JSONSchema7} AppiumJSONSchema
 */
/**
 * @typedef {import('./arg-spec').ArgSpec} ArgSpec
 */
//# sourceMappingURL=cli-args.js.map