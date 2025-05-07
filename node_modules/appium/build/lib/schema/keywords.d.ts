/**
 * Collection of keyword definitions to add to the singleton `Ajv` instance.
 * @type {Record<string,KeywordDefinition>}
 */
export const keywords: Record<string, KeywordDefinition>;
/**
 * These are the valid values for the `appiumCliTransformer` keyword.
 * Unfortunately, TS cannot infer this in a JS context.  In TS, we'd use
 * `as const` when defining `argTransformers`, then get `keyof typeof argTransformers`. alas.
 */
export type AppiumCliTransformerName = "csv" | "json";
/**
 * These are the custom keywords that Appium recognizes.
 */
export type AppiumJSONSchemaKeywords = {
    appiumCliDest?: string | undefined;
    appiumCliDescription?: string | undefined;
    appiumCliAliases?: string[] | undefined;
    appiumCliIgnored?: boolean | undefined;
    appiumCliTransformer?: AppiumCliTransformerName | undefined;
    appiumDeprecated?: boolean | undefined;
};
export type KeywordDefinition = import("ajv").KeywordDefinition;
//# sourceMappingURL=keywords.d.ts.map