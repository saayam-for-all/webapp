/**
 * Scaffolding functions for CLI `init` command
 *
 * @module
 */
import { Simplify } from 'type-fest';
import { ScaffoldTaskOptions } from './scaffold';
import type { ScaffoldTask } from './scaffold';
import { MkDocsYml, TsConfigJson } from './model';
/**
 * Function which scaffolds a `tsconfig.json` file
 */
export declare const initTsConfigJson: ScaffoldTask<InitTsConfigOptions, TsConfigJson>;
/**
 * Function which scaffolds an `mkdocs.yml` file
 */
export declare const initMkDocs: ScaffoldTask<InitMkDocsOptions, MkDocsYml>;
/**
 * Installs Python dependencies
 * @param opts Options
 */
export declare function initPython({ pythonPath, dryRun, upgrade, }?: InitPythonOptions): Promise<void>;
/**
 * Options for {@linkcode initMkDocs}
 */
export interface InitMkDocsOptions extends ScaffoldTaskOptions {
    copyright?: string;
    repoName?: string;
    repoUrl?: string;
    siteDescription?: string;
    siteName?: string;
}
/**
 * Main handler for `init` command.
 *
 * This runs tasks in serial; it _could_ run in parallel, but it has deleterious effects upon
 * console output which would need mitigation.
 */
export declare function init({ typescript, python, tsconfigJson: tsconfigJsonPath, packageJson: packageJsonPath, overwrite, include, mkdocs, mkdocsYml: mkdocsYmlPath, siteName, repoName, repoUrl, copyright, dryRun, cwd, pythonPath, upgrade, }?: InitOptions): Promise<void>;
export interface InitTsConfigOptions extends ScaffoldTaskOptions {
    /**
     * List of source files (globs supported); typically `src` or `lib`
     */
    include?: string[];
}
export interface InitPythonOptions extends ScaffoldTaskOptions {
    /**
     * Path to `python` (v3.x) executable
     */
    pythonPath?: string;
    /**
     * If true, upgrade only
     */
    upgrade?: boolean;
}
/**
 * Options for `init` command handler
 *
 * The props of the various "path" options are rewritten as `dest` for the scaffold tasks functions.
 */
export type InitOptions = Simplify<Omit<InitPythonOptions & InitTsConfigOptions & InitMkDocsOptions, 'dest'> & {
    /**
     * If `true` will initialize a `tsconfig.json` file
     */
    typescript?: boolean;
    /**
     * If `true` will install Python deps
     */
    python?: boolean;
    /**
     * If `true` will initialize a `mkdocs.yml` file
     */
    mkdocs?: boolean;
    /**
     * Path to new or existing `tsconfig.json` file
     */
    tsconfigJson?: string;
    /**
     * Path to existing `package.json` file
     */
    packageJson?: string;
    /**
     * Path to new or existing `mkdocs.yml` file
     */
    mkdocsYml?: string;
    /**
     * If `true`, upgrade only
     */
    upgrade?: boolean;
}>;
//# sourceMappingURL=init.d.ts.map