/**
 * Utilities
 * @module
 */
import _ from 'lodash';
import { SpawnOptions } from 'node:child_process';
/**
 * Computes a relative path, prepending `./`
 */
export declare const relative: _.CurriedFunction2<string, string, string>;
/**
 * A stopwatch-like thing
 *
 * Used for displaying elapsed time in milliseconds
 * @param id - Unique identifier
 * @returns Function that returns the elapsed time in milliseconds
 */
export declare function stopwatch(id: string): () => number;
export declare namespace stopwatch {
    var cache: Map<string, number>;
}
/**
 * Converts a tuple to an object; use for extracting parameter types from a function signature
 */
export type TupleToObject<T extends readonly any[], M extends Record<Exclude<keyof T, keyof any[]>, PropertyKey>> = {
    [K in Exclude<keyof T, keyof any[]> as M[K]]: T[K];
};
/**
 * Type guard to narrow an array to a string array
 * @param value any value
 * @returns `true` if the array is `string[]`
 */
export declare const isStringArray: (value: any) => value is string[];
/**
 * Converts an object of string values to an array of arguments for CLI
 *
 * Supports `boolean` and `number` values as well.  `boolean`s are assumed to be flags which default
 * to `false`, so they will only be added to the array if the value is `true`.
 */
export declare const argify: (obj: Record<string, string | number | boolean | undefined>) => string[];
/**
 * Spawns a long-running "background" child process.  This is expected to only return control to the
 * parent process in the case of a nonzero exit code from the child process.
 * @param command Command to run
 * @param args Args to pass to command
 * @param opts Spawn options. `{stdio: 'inherit'}` will always be true
 * @privateRemarks `teen_process` is good for running a one-shot command, but not so great for
 * background tasks; we use node's `child_process` directly here to pass `stdio` through, since
 * `teen_process` basically does not respect `{stdio: 'inherit'}`.
 */
export declare function spawnBackgroundProcess(command: string, args: string[], opts: SpawnOptions): Promise<void>;
export type SpawnBackgroundProcessOpts = Omit<SpawnOptions, 'stdio'>;
//# sourceMappingURL=util.d.ts.map