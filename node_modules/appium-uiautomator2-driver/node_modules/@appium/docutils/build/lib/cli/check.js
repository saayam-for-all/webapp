"use strict";
/**
 * Provides functions to validate user-provided options as part of Yargs' post-parsing "check" phase
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMissingPaths = checkMissingPaths;
const support_1 = require("@appium/support");
const lodash_1 = __importDefault(require("lodash"));
const logger_1 = require("../logger");
const log = (0, logger_1.getLogger)('check');
/**
 * Given a list of objects with `id` and `path` props, filters out the ones that do not exist
 * @param paths Filepaths
 * @returns Missing files
 */
async function filterMissing(paths) {
    const exists = await Promise.all(paths.map(async ({ id, path }) => ({ id, path, exists: await support_1.fs.exists(path) })));
    const results = lodash_1.default.reject(exists, 'exists');
    return lodash_1.default.map(results, (result) => lodash_1.default.omit(result, 'exists'));
}
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
async function checkMissingPaths(opts, group, argv) {
    const argsToCheck = lodash_1.default.keys(lodash_1.default.pickBy(opts, (opt, id) => opt?.group === group && id in argv));
    // yargs is pretty loose about allowing CLI args multiple times, and the value could potentially
    // be a `string[]` instead of `string`; we don't want to allow more than one path per arg.
    if (!argsToCheck.every((id) => lodash_1.default.isString(argv[id]))) {
        return 'Paths may only be provided once each';
    }
    const pathsToCheck = lodash_1.default.map(argsToCheck, (id) => ({
        id,
        path: String(argv[id]), // this must be a string per the above check
    }));
    log.debug('Checking for existence of %s: %s', support_1.util.pluralize('path', pathsToCheck.length), lodash_1.default.map(pathsToCheck, 'path'));
    const missingPaths = await filterMissing(pathsToCheck);
    if (missingPaths.length) {
        return missingPaths
            .map(({ id, path }) => `Default or specified path via --${lodash_1.default.kebabCase(id)} (${path}) does not exist`)
            .join('\n');
    }
    return true;
}
//# sourceMappingURL=check.js.map