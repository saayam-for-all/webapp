/**
 * This module provides custom keywords for Appium schemas, as well as
 * "transformers" (see `argTransformers` below).
 *
 * Custom keywords are just properties that will appear in a schema (e.g.,
 * `appium-config-schema.js`) beyond what the JSON Schema spec offers.  These
 * are usable by extensions, as well.
 */
/**
 * Splits a CSV string into an array
 * @param {string} value
 * @returns {string[]}
 */
export function parseCsvLine(value: string): string[];
export namespace transformers {
    function csv(csvOrPath: string): string[];
    function json(jsonOrPath: string): object;
}
//# sourceMappingURL=cli-transformers.d.ts.map