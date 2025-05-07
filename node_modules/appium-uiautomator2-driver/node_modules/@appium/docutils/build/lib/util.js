"use strict";
/**
 * Utilities
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.argify = exports.isStringArray = exports.relative = void 0;
exports.stopwatch = stopwatch;
exports.spawnBackgroundProcess = spawnBackgroundProcess;
const lodash_1 = __importDefault(require("lodash"));
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
/**
 * Computes a relative path, prepending `./`
 */
exports.relative = lodash_1.default.curry((from, to) => `.${node_path_1.default.sep}${node_path_1.default.relative(from, to)}`);
/**
 * A stopwatch-like thing
 *
 * Used for displaying elapsed time in milliseconds
 * @param id - Unique identifier
 * @returns Function that returns the elapsed time in milliseconds
 */
function stopwatch(id) {
    const start = Date.now();
    stopwatch.cache.set(id, start);
    return () => {
        const result = Date.now() - (stopwatch.cache.get(id) ?? 0);
        stopwatch.cache.delete(id);
        return result;
    };
}
stopwatch.cache = new Map();
/**
 * Type guard to narrow an array to a string array
 * @param value any value
 * @returns `true` if the array is `string[]`
 */
exports.isStringArray = lodash_1.default.overEvery(lodash_1.default.isArray, lodash_1.default.partial(lodash_1.default.every, lodash_1.default, lodash_1.default.isString));
/**
 * Converts an object of string values to an array of arguments for CLI
 *
 * Supports `boolean` and `number` values as well.  `boolean`s are assumed to be flags which default
 * to `false`, so they will only be added to the array if the value is `true`.
 */
exports.argify = lodash_1.default.flow(lodash_1.default.entries, (list) => list.map(([key, value]) => {
    if (value === true) {
        return [`--${key}`];
    }
    else if (value === false || value === undefined) {
        return;
    }
    return [`--${key}`, value];
}), lodash_1.default.flatten);
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
async function spawnBackgroundProcess(command, args, opts) {
    return new Promise((resolve, reject) => {
        (0, node_child_process_1.spawn)(command, args, { ...opts, stdio: 'inherit' })
            .on('error', reject)
            .on('close', (code) => {
            // can be null or number
            if (code) {
                return reject(new Error(`${command} exited with code ${code}`));
            }
            resolve();
        });
    });
}
//# sourceMappingURL=util.js.map