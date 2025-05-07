"use strict";
/**
 * Validates an environment for building documentation; used by `validate` command
 *
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocutilsValidator = void 0;
const support_1 = require("@appium/support");
const chalk_1 = __importDefault(require("chalk"));
const lodash_1 = __importDefault(require("lodash"));
const node_events_1 = require("node:events");
const node_path_1 = __importDefault(require("node:path"));
const semver_1 = require("semver");
const teen_process_1 = require("teen_process");
const constants_1 = require("./constants");
const error_1 = require("./error");
const fs_1 = require("./fs");
const logger_1 = require("./logger");
const util_1 = require("./util");
/**
 * Matches the Python version string from `python --version`
 */
const PYTHON_VER_STR = 'Python 3.';
/**
 * Matches the TypeScript version string from `tsc --version`
 */
const TYPESCRIPT_VERSION_REGEX = /Version\s(\d+\.\d+\..+)/;
/**
 * Matches the MkDocs version string from `mkdocs --version`
 */
const MKDOCS_VERSION_REGEX = /\s+version\s+(\d+\.\d+\.\S+)/;
const log = (0, logger_1.getLogger)('validate');
/**
 * This class is designed to run _all_ validation checks (as requested by the user), and emit events for
 * each failure encountered.
 *
 * Whenever a method _rejects or throws_, this is considered an "unexpected" error, and the validation
 * will abort.
 *
 * @todo Use [`strict-event-emitter-types`](https://npm.im/strict-event-emitter-types)
 */
class DocutilsValidator extends node_events_1.EventEmitter {
    /**
     * Creates a listener to track errors emitted
     */
    constructor(opts = {}) {
        super();
        /**
         * List of validations to perform
         */
        this.validations = new Set();
        /**
         * Mapping of error messages to errors.
         *
         * Used to prevent duplicate emission of errors and track error count; if non-empty, the validation
         * process should be considered to have failed.
         *
         * Reset after {@linkcode DocutilsValidator.validate validate} completes.
         */
        this.emittedErrors = new Map();
        this.packageJsonPath = opts.packageJson;
        this.pythonPath = opts.pythonPath;
        this.cwd = opts.cwd ?? process.cwd();
        this.tsconfigJsonPath = opts.tsconfigJson;
        this.npmPath = opts.npm;
        this.mkDocsYmlPath = opts.mkdocsYml;
        if (opts.python) {
            this.validations.add(constants_1.NAME_PYTHON);
        }
        if (opts.typescript) {
            this.validations.add(constants_1.NAME_TYPESCRIPT);
            // npm validation is required for typescript
            this.validations.add(constants_1.NAME_NPM);
        }
        if (opts.mkdocs) {
            this.validations.add(constants_1.NAME_MKDOCS);
        }
        // this just tracks the emitted errors
        this.on(DocutilsValidator.FAILURE, (err) => {
            this.emittedErrors.set(err.message, err);
        });
    }
    /**
     * Runs the configured validations, then resets internal state upon completion or rejection.
     */
    async validate() {
        try {
            this.emit(DocutilsValidator.BEGIN, [...this.validations]);
            if (this.validations.has(constants_1.NAME_PYTHON)) {
                await this.validatePythonVersion();
                await this.validatePythonDeps();
            }
            if (this.validations.has(constants_1.NAME_MKDOCS)) {
                await this.validateMkDocs();
                await this.validateMkDocsConfig();
            }
            if (this.validations.has(constants_1.NAME_NPM)) {
                await this.validateNpmVersion();
            }
            if (this.validations.has(constants_1.NAME_TYPESCRIPT)) {
                await this.validateTypeScript();
                await this.validateTypeScriptConfig();
            }
            this.emit(DocutilsValidator.END, this.emittedErrors.size);
        }
        finally {
            this.reset();
        }
    }
    /**
     * If a thing like `err` has not already been emitted, emit
     * {@linkcode DocutilsValidator.FAILURE}.
     * @param err A validation error
     * @returns
     */
    fail(err) {
        const dErr = lodash_1.default.isString(err) ? new error_1.DocutilsError(err) : err;
        if (!this.emittedErrors.has(dErr.message)) {
            this.emit(DocutilsValidator.FAILURE, dErr);
        }
    }
    /**
     * Resolves with a the parent directory of `package.json`, if we can find it.
     */
    async findPkgDir() {
        return (this.pkgDir ??
            (this.pkgDir = this.packageJsonPath
                ? node_path_1.default.dirname(this.packageJsonPath)
                : await (0, fs_1.findPkgDir)(this.cwd)));
    }
    /**
     * Emits a {@linkcode DocutilsValidator.SUCCESS} event
     * @param message Success message
     */
    ok(message) {
        this.emit(DocutilsValidator.SUCCESS, message);
    }
    /**
     * Parses a `requirements.txt` file and returns an array of packages
     *
     * Caches the result.
     * @returns List of package data w/ name and version
     */
    async parseRequirementsTxt() {
        if (this.requirementsTxt) {
            return this.requirementsTxt;
        }
        const requiredPackages = [];
        try {
            let requirementsTxt = await support_1.fs.readFile(constants_1.REQUIREMENTS_TXT_PATH, 'utf8');
            requirementsTxt = requirementsTxt.trim();
            log.debug('Raw %s: %s', constants_1.NAME_REQUIREMENTS_TXT, requirementsTxt);
            for (const line of requirementsTxt.split(/\r?\n/)) {
                const [name, version] = line.trim().split('==');
                requiredPackages.push({ name, version });
            }
            log.debug('Parsed %s: %O', constants_1.NAME_REQUIREMENTS_TXT, requiredPackages);
        }
        catch {
            throw new error_1.DocutilsError(`Could not find ${constants_1.REQUIREMENTS_TXT_PATH}. This is a bug`);
        }
        return (this.requirementsTxt = requiredPackages);
    }
    /**
     * Resets the cache of emitted errors
     */
    reset() {
        this.emittedErrors.clear();
    }
    /**
     * Validates that the correct version of `mkdocs` is installed
     */
    async validateMkDocs() {
        const pythonPath = this.pythonPath ?? (await (0, fs_1.findPython)());
        if (!pythonPath) {
            return this.fail(`Could not find ${constants_1.NAME_PYTHON} executable in PATH. If it is installed, check your PATH environment variable.`);
        }
        let rawMkDocsVersion;
        try {
            ({ stdout: rawMkDocsVersion } = await (0, teen_process_1.exec)(pythonPath, ['-m', constants_1.NAME_MKDOCS, '--version']));
        }
        catch (err) {
            return this.fail(`Failed to get MkDocs version: ${err}`);
        }
        const match = rawMkDocsVersion.match(MKDOCS_VERSION_REGEX);
        if (match) {
            const version = match[1];
            const reqs = await this.parseRequirementsTxt();
            const mkDocsPipPkg = lodash_1.default.find(reqs, { name: constants_1.NAME_MKDOCS });
            if (!mkDocsPipPkg) {
                throw new error_1.DocutilsError(`No ${constants_1.NAME_MKDOCS} package in ${constants_1.REQUIREMENTS_TXT_PATH}. This is a bug.`);
            }
            const { version: mkDocsReqdVersion } = mkDocsPipPkg;
            if (version !== mkDocsReqdVersion) {
                return this.fail(`${constants_1.NAME_MKDOCS} is v${version}, but ${constants_1.REQUIREMENTS_TXT_PATH} requires v${mkDocsReqdVersion}`);
            }
        }
        else {
            throw new error_1.DocutilsError(`Could not parse version from MkDocs. This is a bug. Output was ${rawMkDocsVersion}`);
        }
        this.ok('MkDocs install OK');
    }
    /**
     * Validates (sort of) an `mkdocs.yml` config file.
     *
     * It checks if the file exists, if it can be parsed as YAML, and if it has a `site_name` property.
     */
    async validateMkDocsConfig(mkDocsYmlPath) {
        mkDocsYmlPath = mkDocsYmlPath ?? this.mkDocsYmlPath ?? (await (0, fs_1.findMkDocsYml)(this.cwd));
        if (!mkDocsYmlPath) {
            return this.fail(`Could not find ${constants_1.NAME_MKDOCS_YML} from ${this.cwd}. Run "${constants_1.NAME_BIN} init" to create it`);
        }
        let mkDocsYml;
        try {
            mkDocsYml = await (0, fs_1.readMkDocsYml)(mkDocsYmlPath);
        }
        catch (e) {
            const err = e;
            if (err.code === constants_1.NAME_ERR_ENOENT) {
                return this.fail(`Could not find ${constants_1.NAME_MKDOCS_YML} at ${mkDocsYmlPath}. Use --mkdocs-yml to specify a different path.`);
            }
            return this.fail(`Could not parse ${mkDocsYmlPath}: ${err}`);
        }
        if (!mkDocsYml.site_name) {
            return this.fail(`Could not find required property "site_name" in ${mkDocsYmlPath}`);
        }
        this.ok(`MkDocs config at ${mkDocsYmlPath} OK`);
    }
    /**
     * Validates that the version of `npm` matches what's described in this package's `engines` field.
     *
     * This is required because other validators need `npm exec` to work, which is only available in npm 7+.
     */
    async validateNpmVersion() {
        const npmEngineRange = constants_1.DOCUTILS_PKG.engines?.npm;
        if (!npmEngineRange) {
            throw new error_1.DocutilsError('Could not find property engines.npm in package.json. This is a bug');
        }
        try {
            const npmPath = this.npmPath ?? (await (0, fs_1.whichNpm)());
            if (!npmPath) {
                throw new error_1.DocutilsError(`Could not find ${constants_1.NAME_NPM} in PATH. That seems weird, doesn't it?`);
            }
            const { stdout: npmVersion } = await (0, teen_process_1.exec)(npmPath, ['-v']);
            if (!(0, semver_1.satisfies)(npmVersion.trim(), npmEngineRange)) {
                this.fail(`${constants_1.NAME_NPM} is version ${npmVersion}, but ${npmEngineRange} is required`);
                return;
            }
        }
        catch {
            return this.fail(`Could not find ${this.npmPath} in PATH. Is it installed?`);
        }
        this.ok(`${constants_1.NAME_NPM} version OK`);
    }
    /**
     * Asserts that the dependencies as listed in `requirements.txt` are installed.
     *
     * @privateRemarks This lists all installed packages with `pip` and then compares them to the
     * contents of our `requirements.txt`. Versions _must_ match exactly.
     */
    async validatePythonDeps() {
        let pipListOutput;
        const pythonPath = this.pythonPath ?? (await (0, fs_1.findPython)());
        if (!pythonPath) {
            return this.fail(`Could not find ${constants_1.NAME_PYTHON} in PATH. Is it installed?`);
        }
        try {
            ({ stdout: pipListOutput } = await (0, teen_process_1.exec)(pythonPath, [
                '-m',
                constants_1.NAME_PIP,
                'list',
                '--format',
                'json',
            ]));
        }
        catch {
            return this.fail(`Could not find ${constants_1.NAME_PIP} in PATH. Is it installed?`);
        }
        let installedPkgs;
        try {
            installedPkgs = JSON.parse(pipListOutput);
        }
        catch {
            throw new error_1.DocutilsError(`Could not parse output of "${constants_1.NAME_PIP} list" as JSON: ${pipListOutput}`);
        }
        const pkgsByName = lodash_1.default.mapValues(lodash_1.default.keyBy(installedPkgs, 'name'), 'version');
        log.debug('Installed Python packages: %O', pkgsByName);
        const requiredPackages = await this.parseRequirementsTxt();
        const missingPackages = [];
        const invalidVersionPackages = [];
        for (const reqdPkg of requiredPackages) {
            const version = pkgsByName[reqdPkg.name];
            if (!version) {
                missingPackages.push(reqdPkg);
            }
            if (version !== reqdPkg.version) {
                invalidVersionPackages.push([reqdPkg, { name: reqdPkg.name, version }]);
            }
        }
        const msgParts = [];
        if (missingPackages.length) {
            msgParts.push(`The following required ${support_1.util.pluralize('package', missingPackages.length)} could not be found:\n${missingPackages
                .map((p) => (0, chalk_1.default) `- {yellow ${p.name}} @ {yellow ${p.version}}`)
                .join('\n')}`);
        }
        if (invalidVersionPackages.length) {
            msgParts.push(`The following required ${support_1.util.pluralize('package', invalidVersionPackages.length)} are installed, but at the wrong version:\n${invalidVersionPackages
                .map(([expected, actual]) => (0, chalk_1.default) `- {yellow ${expected.name}} @ {yellow ${expected.version}} (found {red ${actual.version}})`)
                .join('\n')}`);
        }
        if (msgParts.length) {
            return this.fail(`Required Python dependency validation failed:\n\n${msgParts.join('\n\n')}`);
        }
        this.ok('Python dependencies OK');
    }
    /**
     * Asserts that the Python version is 3.x
     */
    async validatePythonVersion() {
        const pythonPath = this.pythonPath ?? (await (0, fs_1.findPython)());
        if (!pythonPath) {
            return this.fail(`Could not find ${constants_1.NAME_PYTHON} in PATH. Is it installed?`);
        }
        try {
            const { stdout } = await (0, teen_process_1.exec)(pythonPath, ['--version']);
            if (!stdout.includes(PYTHON_VER_STR)) {
                return this.fail(`Could not find Python 3.x in PATH; found ${stdout}.  Please use --python-path`);
            }
        }
        catch {
            return this.fail(`Could not find Python 3.x in PATH.`);
        }
        this.ok('Python version OK');
    }
    /**
     * Asserts that TypeScript is installed, runnable, the correct version, and a parseable `tsconfig.json` exists.
     */
    async validateTypeScript() {
        const pkgDir = await this.findPkgDir();
        if (!pkgDir) {
            return this.fail(`Could not find package.json in ${this.cwd}`);
        }
        let typeScriptVersion;
        let rawTypeScriptVersion;
        try {
            ({ stdout: rawTypeScriptVersion } = await (0, teen_process_1.exec)(constants_1.NAME_NPM, ['exec', 'tsc', '--', '--version'], {
                cwd: pkgDir,
            }));
        }
        catch {
            return this.fail(`Could not find TypeScript compiler ("tsc") from ${pkgDir}`);
        }
        const match = rawTypeScriptVersion.match(TYPESCRIPT_VERSION_REGEX);
        if (match) {
            typeScriptVersion = match[1];
        }
        else {
            return this.fail(`Could not parse TypeScript version from "tsc --version"; output was:\n ${rawTypeScriptVersion}`);
        }
        const reqdTypeScriptVersion = constants_1.DOCUTILS_PKG.dependencies?.typescript;
        if (!reqdTypeScriptVersion) {
            throw new error_1.DocutilsError(`Could not find a dep for ${constants_1.NAME_TYPESCRIPT} in ${constants_1.NAME_PACKAGE_JSON}. This is a bug.`);
        }
        if (!(0, semver_1.satisfies)(typeScriptVersion, reqdTypeScriptVersion)) {
            return this.fail(`Found TypeScript version ${typeScriptVersion}, but ${reqdTypeScriptVersion} is required`);
        }
        this.ok('TypeScript install OK');
    }
    /**
     * Validates a `tsconfig.json` file
     */
    async validateTypeScriptConfig() {
        const pkgDir = await this.findPkgDir();
        if (!pkgDir) {
            return this.fail(new error_1.DocutilsError(`Could not find package.json in ${this.cwd}`));
        }
        const tsconfigJsonPath = (this.tsconfigJsonPath =
            this.tsconfigJsonPath ?? node_path_1.default.join(pkgDir, constants_1.NAME_TSCONFIG_JSON));
        const relTsconfigJsonPath = (0, util_1.relative)(this.cwd, tsconfigJsonPath);
        try {
            await (0, fs_1.readJson5)(tsconfigJsonPath);
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                return this.fail(new error_1.DocutilsError(`Unparseable ${constants_1.NAME_TSCONFIG_JSON} at ${relTsconfigJsonPath}: ${e}`));
            }
            return this.fail(new error_1.DocutilsError(`Missing ${constants_1.NAME_TSCONFIG_JSON} at ${relTsconfigJsonPath}; "${constants_1.NAME_BIN} init" can help`));
        }
        this.ok('TypeScript config OK');
    }
}
exports.DocutilsValidator = DocutilsValidator;
/**
 * Emitted when validation begins with a list of validation kinds to be performed
 * @event
 */
DocutilsValidator.BEGIN = 'begin';
/**
 * Emitted when validation ends with an error count
 * @event
 */
DocutilsValidator.END = 'end';
/**
 * Emitted when a validation fails, with the associated {@linkcode DocutilsError}
 * @event
 */
DocutilsValidator.FAILURE = 'fail';
/**
 * Emitted when a validation succeeds
 * @event
 */
DocutilsValidator.SUCCESS = 'ok';
//# sourceMappingURL=validate.js.map