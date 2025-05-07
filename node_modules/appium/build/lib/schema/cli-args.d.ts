/**
 * Converts the finalized, flattened schema representation into
 * ArgumentDefinitions for handoff to `argparse`.
 *
 * @throws If schema has not been added to ajv (via `finalizeSchema()`)
 * @returns {import('../cli/args').ArgumentDefinitions} A map of arryas of
 * aliases to `argparse` arguments; empty if no schema found
 */
export function toParserArgs(): import("../cli/args").ArgumentDefinitions;
/**
 * <T>
 */
export type FormatValidator<T extends string | number> = import("ajv/dist/types").FormatValidator<T>;
/**
 * A JSON 7 schema with our custom keywords.
 */
export type AppiumJSONSchema = import("./keywords").AppiumJSONSchemaKeywords & import("json-schema").JSONSchema7;
export type ArgSpec = import("./arg-spec").ArgSpec<any>;
//# sourceMappingURL=cli-args.d.ts.map