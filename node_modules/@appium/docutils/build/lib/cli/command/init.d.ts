/**
 * Yargs command module for the `init` command.
 * @module
 */
import type { CommandModule, InferredOptionTypes } from 'yargs';
declare enum InitCommandGroup {
    MkDocs = "MkDocs Config:",
    Paths = "Custom Paths:",
    Behavior = "Initialization Behavior:"
}
/**
 * Note the groups here; _some_ opts are paths and would usually be checked via
 * {@linkcode checkMissingPaths}, but in this case we do not care if the path exists or not, because
 * we may create it.
 */
declare const opts: {
    readonly copyright: {
        readonly description: "Copyright notice";
        readonly group: InitCommandGroup.MkDocs;
        readonly nargs: 1;
        readonly requiresArg: true;
        readonly type: "string";
        readonly implies: "mkdocs";
    };
    readonly dir: {
        readonly default: ".";
        readonly defaultDescription: "(current directory)";
        readonly description: "Directory of package";
        readonly group: InitCommandGroup.Paths;
        readonly normalize: true;
        readonly type: "string";
    };
    readonly 'dry-run': {
        readonly describe: "Do not write any files; show what would be done";
        readonly group: InitCommandGroup.Behavior;
        readonly type: "boolean";
    };
    readonly force: {
        readonly alias: "f";
        readonly describe: "Overwrite existing configurations";
        readonly group: InitCommandGroup.Behavior;
        readonly type: "boolean";
    };
    readonly include: {
        readonly alias: "i";
        readonly array: true;
        readonly coerce: (value: string | string[]) => string[];
        readonly description: "Files to include in compilation (globs OK)";
        readonly nargs: 1;
        readonly group: InitCommandGroup.MkDocs;
        readonly requiresArg: true;
        readonly type: "string";
        readonly implies: "mkdocs";
    };
    readonly mkdocs: {
        readonly default: true;
        readonly description: "Create mkdocs.yml if needed";
        readonly group: InitCommandGroup.Behavior;
        readonly type: "boolean";
    };
    readonly 'mkdocs-yml': {
        readonly defaultDescription: "./mkdocs.yml";
        readonly description: "Path to new or existing mkdocs.yml";
        readonly group: InitCommandGroup.MkDocs;
        readonly nargs: 1;
        readonly normalize: true;
        readonly requiresArg: true;
        readonly type: "string";
        readonly implies: "mkdocs";
    };
    readonly 'package-json': {
        readonly defaultDescription: "./package.json";
        readonly describe: "Path to existing package.json";
        readonly group: InitCommandGroup.Paths;
        readonly nargs: 1;
        readonly normalize: true;
        readonly requiresArg: true;
        readonly type: "string";
    };
    readonly python: {
        readonly default: true;
        readonly description: "Install Python dependencies if needed";
        readonly group: InitCommandGroup.Behavior;
        readonly type: "boolean";
    };
    readonly 'python-path': {
        readonly defaultDescription: "(derived from shell)";
        readonly description: "Path to python 3 executable";
        readonly group: InitCommandGroup.Paths;
        readonly nargs: 1;
        readonly normalize: true;
        readonly requiresArg: true;
        readonly type: "string";
        readonly implies: "python";
    };
    readonly 'repo-name': {
        readonly defaultDescription: "(derived from --repo-url)";
        readonly description: "Name of extension repository";
        readonly group: InitCommandGroup.MkDocs;
        readonly nargs: 1;
        readonly requiresArg: true;
        readonly type: "string";
        readonly implies: "mkdocs";
    };
    readonly 'repo-url': {
        readonly defaultDescription: "(from package.json)";
        readonly description: "URL of extension repository";
        readonly group: InitCommandGroup.MkDocs;
        readonly nargs: 1;
        readonly requiresArg: true;
        readonly type: "string";
        readonly implies: "mkdocs";
    };
    readonly 'site-description': {
        readonly defaultDescription: "(from package.json)";
        readonly description: "Site description";
        readonly group: InitCommandGroup.MkDocs;
        readonly nargs: 1;
        readonly requiresArg: true;
        readonly type: "string";
        readonly implies: "mkdocs";
    };
    readonly 'site-name': {
        readonly defaultDescription: "(extension package name)";
        readonly description: "Name of site";
        readonly group: InitCommandGroup.MkDocs;
        readonly nargs: 1;
        readonly requiresArg: true;
        readonly type: "string";
        readonly implies: "mkdocs";
    };
    readonly 'tsconfig-json': {
        readonly defaultDescription: "./tsconfig.json";
        readonly describe: "Path to new or existing tsconfig.json";
        readonly group: InitCommandGroup.Behavior;
        readonly nargs: 1;
        readonly normalize: true;
        readonly requiresArg: true;
        readonly type: "string";
        readonly implies: "typescript";
    };
    readonly typescript: {
        readonly default: true;
        readonly description: "Create tsconfig.json if needed";
        readonly group: InitCommandGroup.Behavior;
        readonly type: "boolean";
    };
    readonly upgrade: {
        readonly alias: "up";
        readonly describe: "Only upgrade Python dependencies if out-of-date";
        readonly group: InitCommandGroup.Behavior;
        readonly type: "boolean";
        readonly conflicts: "force";
        readonly implies: "python";
    };
};
type InitOptions = InferredOptionTypes<typeof opts>;
declare const _default: CommandModule<object, InitOptions>;
export default _default;
//# sourceMappingURL=init.d.ts.map