/**
 * Functions for running `mike`
 *
 * @module
 */
import { TeenProcessExecOptions } from 'teen_process';
import { SpawnBackgroundProcessOpts } from '../util';
/**
 * Runs `mike build` or `mike serve`
 * @param opts Options
 */
export declare function deploy({ mkdocsYml: mkDocsYmlPath, packageJson: packageJsonPath, deployVersion: version, cwd, serve, push, branch, remote, deployPrefix, message, alias, aliasType, port, host, serveOpts, execOpts, }?: DeployOpts): Promise<void>;
/**
 * Options for {@linkcode deploy}.
 */
export interface DeployOpts {
    /**
     * Path to `mike.yml`
     */
    mkdocsYml?: string;
    /**
     * Current working directory
     * @defaultValue `process.cwd()`
     */
    cwd?: string;
    /**
     * Path to `package.json`
     *
     * Used to find `mike.yml` if unspecified.
     */
    packageJson?: string;
    /**
     * If `true`, run `mike serve` instead of `mike build`
     */
    serve?: boolean;
    /**
     * If `true`, push `branch` to `remote`
     */
    push?: boolean;
    /**
     * Branch to commit to
     * @defaultValue gh-pages
     */
    branch?: string;
    /**
     * Remote to push to
     * @defaultValue origin
     */
    remote?: string;
    /**
     * Subdirectory within `branch` to deploy to
     */
    deployPrefix?: string;
    /**
     * Commit message
     */
    message?: string;
    /**
     * Version (dir) to deploy build to
     */
    deployVersion?: string;
    /**
     * Alias for the build (e.g., `latest`); triggers alias update
     */
    alias?: string;
    /**
     * The approach for creating build alias (`symlink`, `redirect` or `copy`)
     */
    aliasType?: string;
    /**
     * Port to serve on
     * @defaultValue 8000
     */
    port?: number;
    /**
     * Host to serve on
     * @defaultValue localhost
     */
    host?: string;
    /**
     * Extra options for {@linkcode teen_process.exec}
     */
    execOpts?: TeenProcessExecOptions;
    /**
     * Extra options for {@linkcode spawnBackgroundProcess}
     */
    serveOpts?: SpawnBackgroundProcessOpts;
}
//# sourceMappingURL=deploy.d.ts.map