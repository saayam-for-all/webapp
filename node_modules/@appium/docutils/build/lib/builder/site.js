"use strict";
/**
 * Runs `mkdocs`, pulling in documentation from the `docs_dir` directory
 * (as configured in `mkdocs.yml`).
 *
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSite = buildSite;
const node_path_1 = __importDefault(require("node:path"));
const teen_process_1 = require("teen_process");
const constants_1 = require("../constants");
const error_1 = require("../error");
const fs_1 = require("../fs");
const logger_1 = require("../logger");
const util_1 = require("../util");
const log = (0, logger_1.getLogger)('mkdocs');
/**
 * Runs `mkdocs serve`
 * @param pythonPath Path to Python 3 executable
 * @param args Extra args to `mkdocs build`
 * @param opts Extra options for `teen_process.Subprocess.start`
 * @param mkDocsPath Path to `mkdocs` executable
 */
async function doServe(pythonPath, args = [], opts = {}) {
    const finalArgs = ['-m', constants_1.NAME_MKDOCS, 'serve', ...args];
    log.debug('Executing %s via: %s, %O', constants_1.NAME_MKDOCS, pythonPath, finalArgs);
    return (0, util_1.spawnBackgroundProcess)(pythonPath, finalArgs, opts);
}
/**
 * Runs `mkdocs build`
 * @param pythonPath Path to Python 3 executable
 * @param args Extra args to `mkdocs build`
 * @param opts Extra options to `teen_process.exec`
 */
async function doBuild(pythonPath, args = [], opts = {}) {
    const finalArgs = ['-m', constants_1.NAME_MKDOCS, 'build', ...args];
    log.debug('Executing %s via: %s, %O', constants_1.NAME_MKDOCS, pythonPath, finalArgs);
    return await (0, teen_process_1.exec)(pythonPath, finalArgs, opts);
}
/**
 * Runs `mkdocs build` or `mkdocs serve`
 * @param opts
 */
async function buildSite({ mkdocsYml: mkDocsYmlPath, siteDir, cwd = process.cwd(), serve = false, serveOpts, execOpts, } = {}) {
    const stop = (0, util_1.stopwatch)('build-mkdocs');
    const pythonPath = await (0, fs_1.findPython)();
    if (!pythonPath) {
        throw new error_1.DocutilsError(`Could not find ${constants_1.NAME_PYTHON}3/${constants_1.NAME_PYTHON} executable in PATH; please install Python v3`);
    }
    mkDocsYmlPath = mkDocsYmlPath
        ? node_path_1.default.resolve(process.cwd(), mkDocsYmlPath)
        : await (0, fs_1.findMkDocsYml)(cwd);
    if (!mkDocsYmlPath) {
        throw new error_1.DocutilsError(`Could not find ${constants_1.NAME_MKDOCS_YML} from ${cwd}; run "${constants_1.NAME_BIN} init" to create it`);
    }
    const mkdocsArgs = ['-f', mkDocsYmlPath];
    if (siteDir) {
        mkdocsArgs.push('-d', siteDir);
    }
    if (serve) {
        // unsure about how SIGHUP is handled here
        await doServe(pythonPath, mkdocsArgs, serveOpts);
    }
    else {
        log.info('Building site...');
        await doBuild(pythonPath, mkdocsArgs, execOpts);
        let relSiteDir;
        if (siteDir) {
            relSiteDir = (0, util_1.relative)(cwd, siteDir);
        }
        else {
            ({ site_dir: siteDir } = await (0, fs_1.readMkDocsYml)(mkDocsYmlPath));
            if (siteDir) {
                log.debug('Found site_dir %s', siteDir);
                relSiteDir = (0, util_1.relative)(node_path_1.default.dirname(mkDocsYmlPath), siteDir);
            }
            else {
                log.warn('No site_dir specified in args or %s; using default site_dir: %s', constants_1.NAME_MKDOCS_YML, constants_1.DEFAULT_SITE_DIR);
                relSiteDir = (0, util_1.relative)(cwd, constants_1.DEFAULT_SITE_DIR);
            }
        }
        log.success('Finished building site into %s (%dms)', relSiteDir, stop());
    }
}
//# sourceMappingURL=site.js.map