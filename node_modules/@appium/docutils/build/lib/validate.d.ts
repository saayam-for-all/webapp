/**
 * Validates an environment for building documentation; used by `validate` command
 *
 * @module
 */
import { EventEmitter } from 'node:events';
import { NAME_MKDOCS, NAME_NPM, NAME_PYTHON, NAME_TYPESCRIPT } from './constants';
import { DocutilsError } from './error';
import { PipPackage } from './model';
/**
 * The "kinds" of validation which were requested to be performed
 */
export type ValidationKind = typeof NAME_PYTHON | typeof NAME_TYPESCRIPT | typeof NAME_NPM | typeof NAME_MKDOCS;
/**
 * This class is designed to run _all_ validation checks (as requested by the user), and emit events for
 * each failure encountered.
 *
 * Whenever a method _rejects or throws_, this is considered an "unexpected" error, and the validation
 * will abort.
 *
 * @todo Use [`strict-event-emitter-types`](https://npm.im/strict-event-emitter-types)
 */
export declare class DocutilsValidator extends EventEmitter {
    /**
     * Current working directory. Defaults to `process.cwd()`
     * @todo This cannot yet be overriden by user
     */
    protected readonly cwd: string;
    /**
     * Path to `npm` executable.
     */
    protected readonly npmPath?: string;
    /**
     * Path to `python` executable.
     */
    protected readonly pythonPath?: string;
    /**
     * List of validations to perform
     */
    protected readonly validations: Set<ValidationKind>;
    /**
     * Mapping of error messages to errors.
     *
     * Used to prevent duplicate emission of errors and track error count; if non-empty, the validation
     * process should be considered to have failed.
     *
     * Reset after {@linkcode DocutilsValidator.validate validate} completes.
     */
    protected emittedErrors: Map<string, DocutilsError>;
    /**
     * Path to `mkdocs.yml`.  If not provided, will be lazily resolved.
     */
    protected mkDocsYmlPath?: string;
    /**
     * Path to `package.json`.  If not provided, will be lazily resolved.
     */
    protected packageJsonPath?: string;
    /**
     * Path to the package directory.  If not provided, will be lazily resolved.
     */
    protected pkgDir?: string;
    /**
     * Path to `tsconfig.json`.  If not provided, will be lazily resolved.
     */
    protected tsconfigJsonPath?: string;
    /**
     * Emitted when validation begins with a list of validation kinds to be performed
     * @event
     */
    static readonly BEGIN = "begin";
    /**
     * Emitted when validation ends with an error count
     * @event
     */
    static readonly END = "end";
    /**
     * Emitted when a validation fails, with the associated {@linkcode DocutilsError}
     * @event
     */
    static readonly FAILURE = "fail";
    /**
     * Emitted when a validation succeeds
     * @event
     */
    static readonly SUCCESS = "ok";
    private requirementsTxt;
    /**
     * Creates a listener to track errors emitted
     */
    constructor(opts?: DocutilsValidatorOpts);
    /**
     * Runs the configured validations, then resets internal state upon completion or rejection.
     */
    validate(): Promise<void>;
    /**
     * If a thing like `err` has not already been emitted, emit
     * {@linkcode DocutilsValidator.FAILURE}.
     * @param err A validation error
     * @returns
     */
    protected fail(err: DocutilsError | string): void;
    /**
     * Resolves with a the parent directory of `package.json`, if we can find it.
     */
    protected findPkgDir(): Promise<string | undefined>;
    /**
     * Emits a {@linkcode DocutilsValidator.SUCCESS} event
     * @param message Success message
     */
    protected ok(message: string): void;
    /**
     * Parses a `requirements.txt` file and returns an array of packages
     *
     * Caches the result.
     * @returns List of package data w/ name and version
     */
    protected parseRequirementsTxt(): Promise<PipPackage[]>;
    /**
     * Resets the cache of emitted errors
     */
    protected reset(): void;
    /**
     * Validates that the correct version of `mkdocs` is installed
     */
    protected validateMkDocs(): Promise<void>;
    /**
     * Validates (sort of) an `mkdocs.yml` config file.
     *
     * It checks if the file exists, if it can be parsed as YAML, and if it has a `site_name` property.
     */
    protected validateMkDocsConfig(mkDocsYmlPath?: string): Promise<void>;
    /**
     * Validates that the version of `npm` matches what's described in this package's `engines` field.
     *
     * This is required because other validators need `npm exec` to work, which is only available in npm 7+.
     */
    protected validateNpmVersion(): Promise<void>;
    /**
     * Asserts that the dependencies as listed in `requirements.txt` are installed.
     *
     * @privateRemarks This lists all installed packages with `pip` and then compares them to the
     * contents of our `requirements.txt`. Versions _must_ match exactly.
     */
    protected validatePythonDeps(): Promise<void>;
    /**
     * Asserts that the Python version is 3.x
     */
    protected validatePythonVersion(): Promise<void>;
    /**
     * Asserts that TypeScript is installed, runnable, the correct version, and a parseable `tsconfig.json` exists.
     */
    protected validateTypeScript(): Promise<void>;
    /**
     * Validates a `tsconfig.json` file
     */
    protected validateTypeScriptConfig(): Promise<void>;
}
/**
 * Options for {@linkcode DocutilsValidator} constructor
 */
export interface DocutilsValidatorOpts {
    /**
     * Current working directory
     */
    cwd?: string;
    /**
     * Path to `mkdocs.yml`
     */
    mkdocsYml?: string;
    /**
     * Path to `npm` executable
     */
    npm?: string;
    /**
     * Path to `package.json`
     */
    packageJson?: string;
    /**
     * If `true`, run Python validation
     */
    python?: boolean;
    /**
     * Path to `python` executable
     */
    pythonPath?: string;
    /**
     * Path to `tsconfig.json`
     */
    tsconfigJson?: string;
    /**
     * If `true`, run TypeScript validation
     */
    typescript?: boolean;
    /**
     * If `true`, run MkDocs validation
     */
    mkdocs?: boolean;
}
//# sourceMappingURL=validate.d.ts.map