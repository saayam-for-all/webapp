"use strict";
/**
 * Handles reading of a config file for docutils
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findConfig = findConfig;
exports.loadConfig = loadConfig;
const lilconfig_ts_loader_1 = __importDefault(require("@sliphua/lilconfig-ts-loader"));
const lilconfig_1 = require("lilconfig");
const lodash_1 = __importDefault(require("lodash"));
const node_path_1 = __importDefault(require("node:path"));
const yaml_1 = __importDefault(require("yaml"));
const yargs_parser_1 = __importDefault(require("yargs-parser"));
const helpers_1 = require("yargs/helpers");
const constants_1 = require("../constants");
const logger_1 = require("../logger");
const util_1 = require("../util");
const log = (0, logger_1.getLogger)('config');
/**
 * `lilconfig` loader for YAML
 */
const loadYaml = lodash_1.default.rearg(yaml_1.default.parse, [2, 0, 1]);
/**
 * `lilconfig` loader for ESM/CJS
 */
const loadEsm = (filepath) => import(filepath);
/**
 * Controls how we load/find a config file.
 *
 * Takes _raw_ args from the CLI, and uses `yargs-parser` to parse them as to not interfere with the
 * main usage of args.
 *
 * We're looking for various things in the CLI args:
 * - `--no-config` - if this is present, we don't load a config file
 * - `--log-level` - if this is present, we set the log level
 * - `--verbose` - same as above
 * - `--config` - if this is present, we load the config file at the given path
 * - `--help`, `--version` - do nothing
 * @param argv Raw CLI args
 * @returns
 */
async function findConfig(argv = (0, helpers_1.hideBin)(process.argv)) {
    const preArgs = (0, yargs_parser_1.default)(argv);
    // if --verbose is used, set the log level to debug.
    // otherwise use --log-level or the default.
    let logLevel;
    if (preArgs.verbose) {
        logLevel = 'debug';
    }
    else {
        // if the loglevel is valid, use it, otherwise use the default
        logLevel = (0, logger_1.isLogLevelString)(preArgs.logLevel) ? preArgs.logLevel : constants_1.DEFAULT_LOG_LEVEL;
    }
    (0, logger_1.initLogger)(logLevel);
    if (preArgs.noConfig) {
        log.debug('Not loading config because --no-config was provided');
    }
    return preArgs.noConfig || preArgs.help || preArgs.version
        ? {}
        : await loadConfig(preArgs.config);
}
/**
 * Loads a config file or finds and loads one if none provided
 * @param filepath Config file path, if provided
 * @param cwd Current working directory
 * @returns A config object or an empty object. Could be anything; `yargs` will validate it.
 */
async function loadConfig(filepath, cwd = process.cwd()) {
    const relativePath = (0, util_1.relative)(cwd);
    const searcher = (0, lilconfig_1.lilconfig)(constants_1.NAME_BIN, {
        loaders: {
            '.yaml': loadYaml,
            '.yml': loadYaml,
            '.ts': lilconfig_ts_loader_1.default,
            '.js': loadEsm,
            '.cjs': loadEsm,
            '.mjs': loadEsm,
        },
    });
    const result = filepath
        ? await searcher.load(node_path_1.default.normalize(filepath))
        : await searcher.search(cwd);
    if (result === null) {
        log.debug('No config found');
        return {};
    }
    if (result.isEmpty) {
        log.debug('Config loaded at %s but it was empty', result.filepath);
        return {};
    }
    const relFilepath = relativePath(result.filepath);
    log.success('Loaded config from %s', relFilepath);
    log.debug('Config contents: %O', result.config);
    return result.config;
}
//# sourceMappingURL=config.js.map