/**
 * Given an array of errors and the result of loading a config file, generate a
 * helpful string for the user.
 *
 * - If `opts` contains a `json` property, this should be the original JSON
 *   _string_ of the config file.  This is only applicable if the config file
 *   was in JSON format. If present, it will associate line numbers with errors.
 * - If `errors` happens to be empty, this will throw.
 * @param {import('ajv').ErrorObject[]} errors - Non-empty array of errors. Required.
 * @param {ReadConfigFileResult['config']|any} [config] -
 * Configuration & metadata
 * @param {FormatConfigErrorsOptions} [opts]
 * @throws {TypeError} If `errors` is empty
 * @returns {string}
 */
export function formatErrors(errors?: import("ajv").ErrorObject[], config?: ReadConfigFileResult["config"] | any, opts?: FormatConfigErrorsOptions): string;
/**
 * Given an optional path, read a config file. Validates the config file.
 *
 * Call {@link validate} if you already have a config object.
 * @param {string} [filepath] - Path to config file, if we have one
 * @param {ReadConfigFileOptions} [opts] - Options
 * @public
 * @returns {Promise<ReadConfigFileResult>} Contains config and filepath, if found, and any errors
 */
export function readConfigFile(filepath?: string, opts?: ReadConfigFileOptions): Promise<ReadConfigFileResult>;
/**
 * Convert schema property names to either a) the value of the `appiumCliDest` property, if any; or b) camel-case
 * @param {AppiumConfig} config - Configuration object
 * @returns {NormalizedAppiumConfig} New object with camel-cased keys (or `dest` keys).
 */
export function normalizeConfig(config: AppiumConfig): NormalizedAppiumConfig;
/**
 * Result of calling {@link readConfigFile}.
 */
export type ReadConfigFileResult = {
    /**
     * - Validation errors
     */
    errors?: import("ajv").ErrorObject<string, Record<string, any>, any>[] | undefined;
    /**
     * - The path to the config file, if found
     */
    filepath?: string | undefined;
    /**
     * - If `true`, the config file exists but is empty
     */
    isEmpty?: boolean | undefined;
    /**
     * - The parsed configuration
     */
    config?: import("@appium/types").NormalizedAppiumConfig | undefined;
    /**
     * - Human-readable error messages and suggestions. If the `pretty` option is `true`, this will be a nice string to print.
     */
    reason?: string | import("@sidvind/better-ajv-errors").IOutputError[] | undefined;
};
/**
 * Options for {@link readConfigFile}.
 */
export type ReadConfigFileOptions = {
    /**
     * If `false`, do not use color and fancy formatting in the `reason` property of the {@link ReadConfigFileResult}. The value of `reason` is then suitable for machine-reading.
     */
    pretty?: boolean | undefined;
};
/**
 * This is an `AsyncSearcher` which is inexplicably _not_ exported by the `lilconfig` type definition.
 */
export type LilconfigAsyncSearcher = ReturnType<typeof import("lilconfig")["lilconfig"]>;
/**
 * The contents of an Appium config file. Generated from schema
 */
export type AppiumConfig = import("@appium/types").AppiumConfig;
/**
 * The contents of an Appium config file with camelcased property names (and using `appiumCliDest` value if present). Generated from {@link AppiumConfig}
 */
export type NormalizedAppiumConfig = import("@appium/types").NormalizedAppiumConfig;
/**
 * The string should be a raw JSON string.
 */
export type RawJson = string;
/**
 * Options for {@link formatErrors}.
 */
export type FormatConfigErrorsOptions = {
    /**
     * - Raw JSON config (as string)
     */
    json?: string | undefined;
    /**
     * - Whether to format errors as a CLI-friendly string
     */
    pretty?: boolean | undefined;
    /**
     * - Specific ID of a prop; otherwise entire schema
     */
    schemaId?: string | undefined;
};
//# sourceMappingURL=config-file.d.ts.map