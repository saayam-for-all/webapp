/**
 *
 * @param {import('../types').ParsedArgs} args
 * @returns {Promise<void>}
 */
export function init(args: import("../types").ParsedArgs): Promise<void>;
/**
 * @returns {void}
 */
export function clear(): void;
/**
 * Strips color control codes from the given string
 *
 * @param {string} text
 * @returns {string}
 */
export function stripColorCodes(text: string): string;
export default init;
export type ParsedArgs = import("appium/types").ParsedArgs;
export type MessageObject = import("@appium/logger").MessageObject;
//# sourceMappingURL=logsink.d.ts.map