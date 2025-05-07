"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandClasses = void 0;
exports.runExtensionCommand = runExtensionCommand;
/* eslint-disable no-console */
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const driver_command_1 = __importDefault(require("./driver-command"));
const plugin_command_1 = __importDefault(require("./plugin-command"));
const utils_2 = require("./utils");
exports.commandClasses = Object.freeze(
/** @type {const} */ ({
    [constants_1.DRIVER_TYPE]: driver_command_1.default,
    [constants_1.PLUGIN_TYPE]: plugin_command_1.default,
}));
/**
 * Run a subcommand of the 'appium driver' type. Each subcommand has its own set of arguments which
 * can be represented as a JS object.
 *
 * @template {import('appium/types').CliExtensionCommand} Cmd
 * @template {import('appium/types').CliExtensionSubcommand} SubCmd
 * @param {import('appium/types').Args<Cmd, SubCmd>} args - JS object where the key is the parameter name (as defined in
 * driver-parser.js)
 * @param {import('../extension/extension-config').ExtensionConfig<Cmd>} config - Extension config object
 */
async function runExtensionCommand(args, config) {
    // TODO driver config file should be locked while any of these commands are
    // running to prevent weird situations
    let jsonResult = null;
    const { extensionType: type } = config; // NOTE this is the same as `args.subcommand`
    if (!(0, utils_1.isExtensionCommandArgs)(args)) {
        throw new TypeError(`Cannot call ${type} command without a subcommand like 'install'`);
    }
    let { json, suppressOutput } = args;
    json = Boolean(json);
    if (suppressOutput) {
        json = true;
    }
    const CommandClass = /** @type {ExtCommand<Cmd>} */ (exports.commandClasses[type]);
    const cmd = new CommandClass({ config, json });
    try {
        jsonResult = await cmd.execute(args);
    }
    catch (err) {
        // in the suppress output case, we are calling this function internally and should
        // just throw instead of printing an error and ending the process
        if (suppressOutput) {
            throw err;
        }
        (0, utils_2.errAndQuit)(json, err);
    }
    if (json && !suppressOutput) {
        console.log(JSON.stringify(jsonResult, null, utils_2.JSON_SPACES));
    }
    return jsonResult;
}
/**
 * @template {ExtensionType} ExtType
 * @typedef {ExtType extends DriverType ? Class<DriverCliCommand> : ExtType extends PluginType ? Class<PluginCliCommand> : never} ExtCommand
 */
/**
 * @typedef {import('@appium/types').ExtensionType} ExtensionType
 * @typedef {import('@appium/types').DriverType} DriverType
 * @typedef {import('@appium/types').PluginType} PluginType
 */
/**
 * @template T
 * @typedef {import('@appium/types').Class<T>} Class
 */
//# sourceMappingURL=extension.js.map