"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _CliConsole_console, _CliConsole_useSymbols, _CliConsole_useColor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.symbols = exports.console = exports.CliConsole = void 0;
const lodash_1 = __importDefault(require("lodash"));
const supports_color_1 = require("supports-color");
const console_1 = require("console");
require("@colors/colors");
const log_symbols_1 = __importDefault(require("log-symbols"));
exports.symbols = log_symbols_1.default;
const stream_1 = require("stream");
/**
 * Stream to nowhere. Used when we want to disable any output other than JSON output.
 */
class NullWritable extends stream_1.Writable {
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    _write(chunk, encoding, callback) {
        setImmediate(callback);
    }
}
/**
 * A particular console/logging class for Appium's CLI.
 *
 * - By default, uses some fancy symbols
 * - Writes to `STDERR`, generally.
 * - In "JSON mode", `STDERR` is squelched. Use {@linkcode Console.json} to write the JSON.
 *
 * DO NOT extend this to do anything other than what it already does. Download a library or something.
 */
class CliConsole {
    /**
     *
     * @param {ConsoleOpts} opts
     */
    constructor({ jsonMode = false, useSymbols = true, useColor } = {}) {
        /**
         * Internal console
         * @type {globalThis.Console}
         */
        _CliConsole_console.set(this, void 0);
        /**
         * Whether or not to use fancy symbols when logging.
         * @type {boolean}
         *
         */
        _CliConsole_useSymbols.set(this, void 0);
        /**
         * Whether or not to use color.
         */
        _CliConsole_useColor.set(this, void 0);
        __classPrivateFieldSet(this, _CliConsole_console, new console_1.Console(process.stdout, jsonMode ? new NullWritable() : process.stderr), "f");
        __classPrivateFieldSet(this, _CliConsole_useSymbols, Boolean(useSymbols), "f");
        __classPrivateFieldSet(this, _CliConsole_useColor, Boolean(useColor ?? (0, supports_color_1.supportsColor)(process.stderr)), "f");
    }
    /**
     * Wraps a message string in breathtaking fanciness
     *
     * Returns `undefined` if `msg` is `undefined`.
     * @param {string} [msg] - Message to decorate, if anything
     * @param {keyof typeof CliConsole['symbolToColor']} [symbol] - Symbol to use
     * @returns {string|undefined}
     */
    decorate(msg, symbol) {
        if (lodash_1.default.isString(msg)) {
            let newMsg = /** @type {string} */ (msg);
            if (lodash_1.default.isString(symbol) && __classPrivateFieldGet(this, _CliConsole_useSymbols, "f")) {
                newMsg = `${log_symbols_1.default[symbol]} ${newMsg}`;
                if (__classPrivateFieldGet(this, _CliConsole_useColor, "f")) {
                    newMsg = newMsg[CliConsole.symbolToColor[symbol]];
                }
            }
            return newMsg;
        }
        return msg;
    }
    /**
     * Writes to `STDOUT`.  Must be stringifyable.
     *
     * You probably don't want to call this more than once before exiting (since that will output invalid JSON).
     * @param {import('type-fest').JsonValue} value
     */
    json(value) {
        __classPrivateFieldGet(this, _CliConsole_console, "f").log(JSON.stringify(value));
    }
    /**
     * General logging function.
     * @param {string} [message]
     * @param {...any} args
     */
    log(message, ...args) {
        __classPrivateFieldGet(this, _CliConsole_console, "f").error(message, ...args);
    }
    /**
     * A "success" message
     * @param {string} [message]
     * @param {...any} args
     */
    ok(message, ...args) {
        __classPrivateFieldGet(this, _CliConsole_console, "f").error(this.decorate(message, 'success'), ...args);
    }
    /**
     * Alias for {@linkcode Console.log}
     * @param {string} [message]
     * @param {...any} args
     */
    debug(message, ...args) {
        this.log(message, ...args);
    }
    /**
     * Wraps {@link console.dir}
     * @param {any} item
     * @param {import('util').InspectOptions} [opts]
     */
    dump(item, opts) {
        __classPrivateFieldGet(this, _CliConsole_console, "f").dir(item, opts);
    }
    /**
     * An "info" message
     * @param {string} [message]
     * @param {...any} args
     */
    info(message, ...args) {
        this.log(this.decorate(message, 'info'), ...args);
    }
    /**
     * A "warning" message
     * @param {string} [message]
     * @param {...any} args
     */
    warn(message, ...args) {
        this.log(this.decorate(message, 'warning'), ...args);
    }
    /**
     * An "error" message
     * @param {string} [message]
     * @param {...any} args
     */
    error(message, ...args) {
        this.log(this.decorate(message, 'error'), ...args);
    }
}
exports.CliConsole = CliConsole;
_CliConsole_console = new WeakMap(), _CliConsole_useSymbols = new WeakMap(), _CliConsole_useColor = new WeakMap();
/**
 * @type {Record<keyof typeof symbols,keyof Extract<import('@colors/colors').Color, 'string'>>}
 */
CliConsole.symbolToColor = {
    success: 'green',
    info: 'cyan',
    warning: 'yellow',
    error: 'red',
};
/**
 * Options for {@linkcode CliConsole}.
 *
 * @typedef ConsoleOpts
 * @property {boolean} [jsonMode] - If _truthy_, supress all output except JSON (use {@linkcode CliConsole#json}), which writes to `STDOUT`.
 * @property {boolean} [useSymbols] - If _falsy_, do not use fancy symbols.
 * @property {boolean} [useColor] - If _falsy_, do not use color output. If _truthy_, forces color output. By default, checks terminal/TTY for support via pkg `supports-color`. Ignored if `useSymbols` is `false`.
 * @see https://npm.im/supports-color
 */
exports.console = new CliConsole();
//# sourceMappingURL=console.js.map