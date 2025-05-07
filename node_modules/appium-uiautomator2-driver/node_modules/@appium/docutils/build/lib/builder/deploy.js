"use strict";
/**
 * Functions for running `mike`
 *
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = deploy;
const lodash_1 = __importDefault(require("lodash"));
const node_path_1 = __importDefault(require("node:path"));
const teen_process_1 = require("teen_process");
const constants_1 = require("../constants");
const error_1 = require("../error");
const fs_1 = require("../fs");
const logger_1 = require("../logger");
const util_1 = require("../util");
const log = (0, logger_1.getLogger)('builder:deploy');
/**
 * Runs `mike serve`
 * @param mikePath Path to `mike` executable
 * @param args Extra args to `mike build`
 * @param opts Extra options for `teen_process.Subprocess.start`
 */
async function doServe(mikePath, args = [], opts = {}) {
    const finalArgs = ['serve', ...args];
    return (0, util_1.spawnBackgroundProcess)(mikePath, finalArgs, opts);
}
/**
 * Runs `mike build`
 * @param mikePath Path to `mike` executable
 * @param args Extra args to `mike build`
 * @param opts Extra options to `teen_process.exec`
 */
async function doDeploy(mikePath, args = [], opts = {}) {
    const finalArgs = ['deploy', ...args];
    log.debug('Executing %s via: %s %O', constants_1.NAME_MIKE, mikePath, finalArgs);
    return await (0, teen_process_1.exec)(mikePath, finalArgs, opts);
}
/**
 * Derives a deployment version from `package.json`
 * @param packageJsonPath Path to `package.json` if known
 * @param cwd Current working directory
 */
async function findDeployVersion(packageJsonPath, cwd = process.cwd()) {
    const { pkg } = await (0, fs_1.readPackageJson)(packageJsonPath ? node_path_1.default.dirname(packageJsonPath) : cwd, true);
    const version = pkg.version;
    if (!version) {
        throw new error_1.DocutilsError('No "version" field found in package.json; please add one or specify a version to deploy');
    }
    // return MAJOR.MINOR as the version by default, if that is a thing we can extract, otherwise
    // just return the version as is
    const versionParts = version.split('.');
    if (versionParts.length === 1) {
        return version;
    }
    return `${versionParts[0]}.${versionParts[1]}`;
}
/**
 * Runs `mike build` or `mike serve`
 * @param opts Options
 */
async function deploy({ mkdocsYml: mkDocsYmlPath, packageJson: packageJsonPath, deployVersion: version, cwd = process.cwd(), serve = false, push = false, branch = constants_1.DEFAULT_DEPLOY_BRANCH, remote = constants_1.DEFAULT_DEPLOY_REMOTE, deployPrefix, message, alias, aliasType = constants_1.DEFAULT_DEPLOY_ALIAS_TYPE, port = constants_1.DEFAULT_SERVE_PORT, host = constants_1.DEFAULT_SERVE_HOST, serveOpts, execOpts, } = {}) {
    const stop = (0, util_1.stopwatch)('deploy');
    const pythonPath = await (0, fs_1.findPython)();
    if (!pythonPath) {
        throw new error_1.DocutilsError(`Could not find ${constants_1.NAME_PYTHON}3/${constants_1.NAME_PYTHON} executable in PATH; please install Python v3`);
    }
    mkDocsYmlPath = mkDocsYmlPath ?? (await (0, fs_1.findMkDocsYml)(cwd));
    if (!mkDocsYmlPath) {
        throw new error_1.DocutilsError(`Could not find ${constants_1.NAME_MKDOCS_YML} from ${cwd}; run "${constants_1.NAME_BIN} init" to create it`);
    }
    version = version ?? (await findDeployVersion(packageJsonPath, cwd));
    // substitute %s in message with version
    message = message?.replace('%s', version);
    const mikeOpts = {
        'config-file': mkDocsYmlPath,
        push,
        remote,
        branch,
        'deploy-prefix': deployPrefix,
        message,
        port,
        host,
    };
    const mikePath = await (0, fs_1.findMike)();
    if (!mikePath) {
        throw new error_1.DocutilsError(`Could not find ${constants_1.NAME_MIKE} executable; please run "${constants_1.NAME_BIN} init"`);
    }
    if (serve) {
        const mikeArgs = [
            ...(0, util_1.argify)(lodash_1.default.pickBy(mikeOpts, (value) => lodash_1.default.isNumber(value) || Boolean(value))),
        ];
        stop(); // discard
        // unsure about how SIGHUP is handled here
        await doServe(mikePath, mikeArgs, serveOpts);
    }
    else {
        log.info('Deploying into branch %s', branch);
        const mikeArgs = [
            ...(0, util_1.argify)(lodash_1.default.omitBy(mikeOpts, (value, key) => lodash_1.default.includes(['port', 'host'], key) || (!lodash_1.default.isNumber(value) && !value))),
        ];
        if (alias) {
            mikeArgs.push('--update-aliases', '--alias-type', aliasType);
            mikeArgs.push(version, alias);
        }
        else {
            mikeArgs.push(version);
        }
        await doDeploy(mikePath, mikeArgs, execOpts);
        log.success('Finished deployment into branch %s (%dms)', branch, stop());
    }
}
//# sourceMappingURL=deploy.js.map