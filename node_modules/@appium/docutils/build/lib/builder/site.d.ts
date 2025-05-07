/**
 * Runs `mkdocs`, pulling in documentation from the `docs_dir` directory
 * (as configured in `mkdocs.yml`).
 *
 * @module
 */
import { TeenProcessExecOptions } from 'teen_process';
import { SpawnBackgroundProcessOpts } from '../util';
/**
 * Runs `mkdocs build` or `mkdocs serve`
 * @param opts
 */
export declare function buildSite({ mkdocsYml: mkDocsYmlPath, siteDir, cwd, serve, serveOpts, execOpts, }?: BuildMkDocsOpts): Promise<void>;
/**
 * Options for {@linkcode buildSite}.
 */
export interface BuildMkDocsOpts {
    /**
     * Path to `mkdocs.yml`
     */
    mkdocsYml?: string;
    /**
     * Path to output directory
     */
    siteDir?: string;
    /**
     * MkDocs theme to use
     * @defaultValue 'mkdocs'
     */
    theme?: string;
    /**
     * Current working directory
     * @defaultValue `process.cwd()`
     */
    cwd?: string;
    /**
     * Path to `package.json`
     *
     * Used to find `mkdocs.yml` if unspecified.
     */
    packageJson?: string;
    /**
     * If `true`, run `mkdocs serve` instead of `mkdocs build`
     */
    serve?: boolean;
    /**
     * Extra options for {@linkcode teen_process.exec}
     */
    execOpts?: TeenProcessExecOptions;
    /**
     * Extra options for {@linkcode spawnBackgroundProcess}
     */
    serveOpts?: SpawnBackgroundProcessOpts;
}
//# sourceMappingURL=site.d.ts.map