/**
 * Handles reading of a config file for docutils
 * @module
 */
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
export declare function findConfig(argv?: string[]): Promise<any>;
/**
 * Loads a config file or finds and loads one if none provided
 * @param filepath Config file path, if provided
 * @param cwd Current working directory
 * @returns A config object or an empty object. Could be anything; `yargs` will validate it.
 */
export declare function loadConfig(filepath?: string, cwd?: string): Promise<any>;
//# sourceMappingURL=config.d.ts.map