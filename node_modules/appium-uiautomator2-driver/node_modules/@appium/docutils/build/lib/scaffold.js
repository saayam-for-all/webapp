"use strict";
/**
 * Implementation of a generic "create and/or update some file" task
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScaffoldTask = createScaffoldTask;
const support_1 = require("@appium/support");
const logger_1 = require("./logger");
const node_path_1 = __importDefault(require("node:path"));
const diff_1 = require("diff");
const error_1 = require("./error");
const util_1 = require("./util");
const lodash_1 = __importDefault(require("lodash"));
const fs_1 = require("./fs");
const constants_1 = require("./constants");
const log = (0, logger_1.getLogger)('init');
const dryRunLog = (0, logger_1.getLogger)('dry-run', log);
/**
 * Creates a unified patch for display in "dry run" mode
 * @param filename - File name to use
 * @param oldData - Old data
 * @param newData - New Data
 * @returns Patch string
 */
function makePatch(filename, oldData, newData, serializer = fs_1.stringifyJson) {
    return (0, diff_1.createPatch)(filename, lodash_1.default.isString(oldData) ? oldData : serializer(oldData), lodash_1.default.isString(newData) ? newData : serializer(newData));
}
/**
 * Factory for a {@linkcode ScaffoldTask}.
 *
 * @param defaultFilename Default file to create
 * @param defaultContent Default content to use
 * @param description Description of task
 * @param opts Options
 * @returns A scaffold task
 */
function createScaffoldTask(defaultFilename, defaultContent, description, { transform = lodash_1.default.identity, deserialize = JSON.parse, serialize = fs_1.stringifyJson, } = {}) {
    return async ({ overwrite = false, cwd = process.cwd(), packageJson: packageJsonPath, dest, dryRun = false, ...opts }) => {
        const relativePath = (0, util_1.relative)(cwd);
        const { pkgPath, pkg } = await (0, fs_1.readPackageJson)(packageJsonPath ? node_path_1.default.dirname(packageJsonPath) : cwd, true);
        const pkgDir = node_path_1.default.dirname(pkgPath);
        dest = dest ?? node_path_1.default.join(pkgDir, defaultFilename);
        const relativeDest = relativePath(dest);
        log.debug('Initializing %s', relativeDest);
        let shouldWriteDest = false;
        let isNew = false;
        let destContent;
        let result;
        try {
            destContent = deserialize(await support_1.fs.readFile(dest, 'utf8'));
            log.debug('Found existing file %s', relativeDest);
        }
        catch (e) {
            const err = e;
            if (err.code !== constants_1.NAME_ERR_ENOENT) {
                throw err;
            }
            shouldWriteDest = true;
            log.debug('Creating new file %s', relativeDest);
            destContent = {};
            isNew = true;
        }
        const defaults = transform(defaultContent, opts, pkg);
        const finalDestContent = lodash_1.default.defaultsDeep({}, destContent, defaults);
        shouldWriteDest = shouldWriteDest || !lodash_1.default.isEqual(destContent, finalDestContent);
        if (shouldWriteDest) {
            log.info('Changes needed in %s', relativeDest);
            log.debug('Original %s: %O', relativeDest, destContent);
            log.debug('Final %s: %O', relativeDest, finalDestContent);
            const patch = makePatch(dest, destContent, finalDestContent, serialize);
            if (dryRun) {
                dryRunLog.info('Would apply the following patch: \n\n%s', patch);
                result = { path: dest, content: finalDestContent };
                return result;
            }
            try {
                await (0, fs_1.safeWriteFile)(dest, finalDestContent, overwrite);
                if (isNew) {
                    log.success('Initialized %s', description);
                }
                else {
                    log.success('Updated %s', description);
                }
            }
            catch (e) {
                const err = e;
                // this should only be thrown if `force` is false
                if (err.code === constants_1.NAME_ERR_EEXIST) {
                    log.info(`${relativeDest} already exists; continuing...`);
                    log.debug(`Tried to apply patch:\n\n${patch}`);
                }
                else {
                    throw new error_1.DocutilsError(`Could not write to ${relativeDest}. Reason: ${err.message}`, {
                        cause: err,
                    });
                }
            }
        }
        else {
            log.info('No changes necessary for %s', relativeDest);
        }
        log.success(`${description}: done`);
        return { path: dest, content: finalDestContent };
    };
}
//# sourceMappingURL=scaffold.js.map