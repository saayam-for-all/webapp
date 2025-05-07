/**
 * Yargs command module for the `build` command.
 * @module
 */
import type { CommandModule, InferredOptionTypes } from 'yargs';
declare enum BuildCommandGroup {
    Build = "Build Config:",
    Deploy = "Deployment Config:",
    Serve = "Dev Server Config:",
    BuildPaths = "Custom Paths:"
}
declare const opts: {
    readonly site: {
        readonly describe: "Run MkDocs build (HTML)";
        readonly group: BuildCommandGroup.Build;
        readonly type: "boolean";
        readonly default: true;
    };
    readonly 'site-dir': {
        readonly alias: "d";
        readonly describe: "HTML output directory";
        readonly group: BuildCommandGroup.Build;
        readonly nargs: 1;
        readonly requiresArg: true;
        readonly type: "string";
        readonly normalize: true;
        readonly coerce: (...paths: string[]) => string;
        readonly implies: "site";
        readonly defaultDescription: "(from mkdocs.yml)";
    };
    readonly 'package-json': {
        readonly defaultDescription: "./package.json";
        readonly describe: "Path to package.json";
        readonly group: BuildCommandGroup.BuildPaths;
        readonly nargs: 1;
        readonly normalize: true;
        readonly coerce: (...paths: string[]) => string;
        readonly requiresArg: true;
        readonly type: "string";
    };
    readonly 'mkdocs-yml': {
        readonly defaultDescription: "./mkdocs.yml";
        readonly description: "Path to mkdocs.yml";
        readonly group: BuildCommandGroup.BuildPaths;
        readonly nargs: 1;
        readonly normalize: true;
        readonly requiresArg: true;
        readonly coerce: (...paths: string[]) => string;
        readonly type: "string";
    };
    readonly deploy: {
        readonly describe: "Commit HTML output to a branch using mike";
        readonly group: BuildCommandGroup.Deploy;
        readonly type: "boolean";
        readonly implies: "site";
    };
    readonly push: {
        readonly describe: "Push after deploy";
        readonly group: BuildCommandGroup.Deploy;
        readonly type: "boolean";
        readonly implies: "deploy";
    };
    readonly branch: {
        readonly alias: "b";
        readonly describe: "Branch to commit to";
        readonly implies: "deploy";
        readonly group: BuildCommandGroup.Deploy;
        readonly type: "string";
        readonly requiresArg: true;
        readonly nargs: 1;
        readonly defaultDescription: "gh-pages";
    };
    readonly remote: {
        readonly alias: "r";
        readonly describe: "Remote to push to";
        readonly implies: "push";
        readonly group: BuildCommandGroup.Deploy;
        readonly type: "string";
        readonly requiresArg: true;
        readonly nargs: 1;
        readonly defaultDescription: "origin";
    };
    readonly 'deploy-prefix': {
        readonly describe: "Subdirectory within <branch> to commit to";
        readonly implies: "branch";
        readonly group: BuildCommandGroup.Deploy;
        readonly type: "string";
        readonly nargs: 1;
        readonly requiresArg: true;
    };
    readonly message: {
        readonly alias: "m";
        readonly describe: "Commit message. Use \"%s\" for version placeholder";
        readonly implies: "deploy";
        readonly group: BuildCommandGroup.Deploy;
        readonly type: "string";
        readonly nargs: 1;
        readonly requiresArg: true;
    };
    readonly 'deploy-version': {
        readonly describe: "Version (directory) to deploy build to";
        readonly implies: "deploy";
        readonly group: BuildCommandGroup.Deploy;
        readonly type: "string";
        readonly nargs: 1;
        readonly requiresArg: true;
        readonly defaultDescription: "(derived from package.json)";
    };
    readonly alias: {
        readonly describe: "Alias for the build (e.g., \"latest\"); triggers alias update";
        readonly implies: "deploy";
        readonly group: BuildCommandGroup.Deploy;
        readonly type: "string";
        readonly nargs: 1;
        readonly requiresArg: true;
        readonly defaultDescription: "latest";
    };
    readonly 'alias-type': {
        readonly describe: "Alias creation strategy";
        readonly implies: "deploy";
        readonly group: BuildCommandGroup.Deploy;
        readonly type: "string";
        readonly nargs: 1;
        readonly requiresArg: true;
        readonly choices: readonly ["symlink", "redirect", "copy"];
        readonly defaultDescription: "redirect";
    };
    readonly serve: {
        readonly describe: "Start development server";
        readonly group: BuildCommandGroup.Serve;
        readonly type: "boolean";
    };
    readonly port: {
        readonly alias: "p";
        readonly describe: "Development server port";
        readonly group: BuildCommandGroup.Serve;
        readonly type: "number";
        readonly defaultDescription: "8000";
        readonly implies: "serve";
        readonly nargs: 1;
        readonly requiresArg: true;
    };
    readonly host: {
        readonly alias: "h";
        readonly describe: "Development server host";
        readonly group: BuildCommandGroup.Serve;
        readonly type: "string";
        readonly nargs: 1;
        readonly requiresArg: true;
        readonly implies: "serve";
        readonly defaultDescription: "localhost";
    };
};
type BuildOptions = InferredOptionTypes<typeof opts>;
declare const _default: CommandModule<object, BuildOptions>;
export default _default;
//# sourceMappingURL=build.d.ts.map