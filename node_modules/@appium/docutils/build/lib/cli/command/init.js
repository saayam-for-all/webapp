"use strict";
/**
 * Yargs command module for the `init` command.
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const init_1 = require("../../init");
const logger_1 = require("../../logger");
const util_1 = require("../../util");
const check_1 = require("../check");
const log = (0, logger_1.getLogger)('init');
var InitCommandGroup;
(function (InitCommandGroup) {
    InitCommandGroup["MkDocs"] = "MkDocs Config:";
    InitCommandGroup["Paths"] = "Custom Paths:";
    InitCommandGroup["Behavior"] = "Initialization Behavior:";
})(InitCommandGroup || (InitCommandGroup = {}));
/**
 * Note the groups here; _some_ opts are paths and would usually be checked via
 * {@linkcode checkMissingPaths}, but in this case we do not care if the path exists or not, because
 * we may create it.
 */
const opts = {
    copyright: {
        description: 'Copyright notice',
        group: InitCommandGroup.MkDocs,
        nargs: 1,
        requiresArg: true,
        type: 'string',
        implies: 'mkdocs',
    },
    dir: {
        default: '.',
        defaultDescription: '(current directory)',
        description: 'Directory of package',
        group: InitCommandGroup.Paths,
        normalize: true,
        type: 'string',
    },
    'dry-run': {
        describe: 'Do not write any files; show what would be done',
        group: InitCommandGroup.Behavior,
        type: 'boolean',
    },
    force: {
        alias: 'f',
        describe: 'Overwrite existing configurations',
        group: InitCommandGroup.Behavior,
        type: 'boolean',
    },
    include: {
        alias: 'i',
        array: true,
        coerce: (value) => lodash_1.default.castArray(value),
        description: 'Files to include in compilation (globs OK)',
        nargs: 1,
        group: InitCommandGroup.MkDocs,
        requiresArg: true,
        type: 'string',
        implies: 'mkdocs',
    },
    mkdocs: {
        default: true,
        description: 'Create mkdocs.yml if needed',
        group: InitCommandGroup.Behavior,
        type: 'boolean',
    },
    'mkdocs-yml': {
        defaultDescription: './mkdocs.yml',
        description: 'Path to new or existing mkdocs.yml',
        group: InitCommandGroup.MkDocs,
        nargs: 1,
        normalize: true,
        requiresArg: true,
        type: 'string',
        implies: 'mkdocs',
    },
    'package-json': {
        defaultDescription: './package.json',
        describe: 'Path to existing package.json',
        group: InitCommandGroup.Paths,
        nargs: 1,
        normalize: true,
        requiresArg: true,
        type: 'string',
    },
    python: {
        default: true,
        description: 'Install Python dependencies if needed',
        group: InitCommandGroup.Behavior,
        type: 'boolean',
    },
    'python-path': {
        defaultDescription: '(derived from shell)',
        description: 'Path to python 3 executable',
        group: InitCommandGroup.Paths,
        nargs: 1,
        normalize: true,
        requiresArg: true,
        type: 'string',
        implies: 'python',
    },
    'repo-name': {
        defaultDescription: '(derived from --repo-url)',
        description: 'Name of extension repository',
        group: InitCommandGroup.MkDocs,
        nargs: 1,
        requiresArg: true,
        type: 'string',
        implies: 'mkdocs',
    },
    'repo-url': {
        defaultDescription: '(from package.json)',
        description: 'URL of extension repository',
        group: InitCommandGroup.MkDocs,
        nargs: 1,
        requiresArg: true,
        type: 'string',
        implies: 'mkdocs',
    },
    'site-description': {
        defaultDescription: '(from package.json)',
        description: 'Site description',
        group: InitCommandGroup.MkDocs,
        nargs: 1,
        requiresArg: true,
        type: 'string',
        implies: 'mkdocs',
    },
    'site-name': {
        defaultDescription: '(extension package name)',
        description: 'Name of site',
        group: InitCommandGroup.MkDocs,
        nargs: 1,
        requiresArg: true,
        type: 'string',
        implies: 'mkdocs',
    },
    'tsconfig-json': {
        defaultDescription: './tsconfig.json',
        describe: 'Path to new or existing tsconfig.json',
        group: InitCommandGroup.Behavior,
        nargs: 1,
        normalize: true,
        requiresArg: true,
        type: 'string',
        implies: 'typescript',
    },
    typescript: {
        default: true,
        description: 'Create tsconfig.json if needed',
        group: InitCommandGroup.Behavior,
        type: 'boolean',
    },
    upgrade: {
        alias: 'up',
        describe: 'Only upgrade Python dependencies if out-of-date',
        group: InitCommandGroup.Behavior,
        type: 'boolean',
        conflicts: 'force',
        implies: 'python',
    },
};
exports.default = {
    command: 'init',
    describe: 'Initialize package for doc generation',
    builder(yargs) {
        return yargs
            .options(opts)
            .check(async (argv) => (0, check_1.checkMissingPaths)(opts, InitCommandGroup.Paths, argv));
    },
    async handler(args) {
        const done = (0, util_1.stopwatch)('init');
        await (0, init_1.init)({ ...args, overwrite: args.force, cwd: args.dir });
        log.success('Done (%dms)', done());
    },
};
//# sourceMappingURL=init.js.map