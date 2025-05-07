/**
 * Provides functions to validate user-provided options as part of Yargs' post-parsing "check" phase
 * @module
 */
import type { Options } from 'yargs';
/**
 * Takes user-provided paths and checks for existence.
 *
 * Filters options to consider based on group name only.
 *
 * Meant to be used as a "fail-fast" strategy on the CLI, so we don't go all the way through some
 * expensive behavior before realizing we're missing a path.
 * @param opts Options object for a yargs command
 * @param group Group name to filter on
 * @param argv User-provided args
 * @returns `true` if all paths exist or otherwise an error message
 */
export declare function checkMissingPaths<T extends Record<string, Options>>(opts: T, group: string, argv: Record<string, unknown>): Promise<true | string>;
//# sourceMappingURL=check.d.ts.map