"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLOBAL_LOG = exports.Log = void 0;
const lodash_1 = __importDefault(require("lodash"));
const node_events_1 = require("node:events");
// @ts-ignore This module does not provide type definitions
const set_blocking_1 = __importDefault(require("set-blocking"));
// @ts-ignore This module does not provide type definitions
const console_control_strings_1 = __importDefault(require("console-control-strings"));
const util = __importStar(require("node:util"));
const node_async_hooks_1 = require("node:async_hooks");
const utils_1 = require("./utils");
const secure_values_preprocessor_1 = require("./secure-values-preprocessor");
const lru_cache_1 = require("lru-cache");
const DEFAULT_LOG_LEVELS = [
    ['silly', -Infinity, { inverse: true }, 'sill'],
    ['verbose', 1000, { fg: 'cyan', bg: 'black' }, 'verb'],
    ['debug', 1500, { fg: 'cyan', bg: 'black' }, 'dbug'],
    ['info', 2000, { fg: 'green' }],
    ['timing', 2500, { fg: 'green', bg: 'black' }],
    ['http', 3000, { fg: 'green', bg: 'black' }],
    ['notice', 3500, { fg: 'cyan', bg: 'black' }],
    ['warn', 4000, { fg: 'black', bg: 'yellow' }, 'WARN'],
    ['error', 5000, { fg: 'red', bg: 'black' }, 'ERR!'],
    ['silent', Infinity],
];
const DEFAULT_HISTORY_SIZE = 10000;
(0, set_blocking_1.default)(true);
class Log extends node_events_1.EventEmitter {
    constructor() {
        super();
        this.level = 'info';
        this._buffer = [];
        this._maxRecordSize = DEFAULT_HISTORY_SIZE;
        this._history = new lru_cache_1.LRUCache({ max: this.maxRecordSize });
        this.stream = process.stderr;
        this.heading = '';
        this.prefixStyle = { fg: 'magenta' };
        this.headingStyle = { fg: 'white', bg: 'black' };
        this._id = 0;
        this._paused = false;
        this._asyncStorage = new node_async_hooks_1.AsyncLocalStorage();
        this._secureValuesPreprocessor = new secure_values_preprocessor_1.SecureValuesPreprocessor();
        this._style = {};
        this._levels = {};
        this._disp = {};
        this.initDefaultLevels();
        // allow 'error' prefix
        this.on('error', () => { });
    }
    get record() {
        return [...this._history.rvalues()];
    }
    get maxRecordSize() {
        return this._maxRecordSize;
    }
    set maxRecordSize(value) {
        if (value === this._maxRecordSize) {
            return;
        }
        this._maxRecordSize = value;
        const newHistory = new lru_cache_1.LRUCache({ max: value });
        for (const [key, value] of this._history.rentries()) {
            newHistory.set(key, value);
        }
        this._history = newHistory;
    }
    useColor() {
        // by default, decide based on tty-ness.
        return (this._colorEnabled ?? Boolean(this.stream && 'isTTY' in this.stream && this.stream.isTTY));
    }
    get asyncStorage() {
        return this._asyncStorage;
    }
    updateAsyncStorage(contextInfo, replace) {
        if (!lodash_1.default.isPlainObject(contextInfo)) {
            return;
        }
        if (replace) {
            this._asyncStorage.enterWith({ ...contextInfo });
        }
        else {
            const store = this._asyncStorage.getStore() ?? {};
            Object.assign(store, contextInfo);
            this._asyncStorage.enterWith(store);
        }
    }
    enableColor() {
        this._colorEnabled = true;
    }
    disableColor() {
        this._colorEnabled = false;
    }
    // this functionality has been deliberately disabled
    enableUnicode() { }
    disableUnicode() { }
    enableProgress() { }
    disableProgress() { }
    progressEnabled() {
        return false;
    }
    /**
     * Temporarily stop emitting, but don't drop
     */
    pause() {
        this._paused = true;
    }
    resume() {
        if (!this._paused) {
            return;
        }
        this._paused = false;
        const b = this._buffer;
        this._buffer = [];
        for (const m of b) {
            this.emitLog(m);
        }
    }
    silly(prefix, message, ...args) {
        this.log('silly', prefix, message, ...args);
    }
    verbose(prefix, message, ...args) {
        this.log('verbose', prefix, message, ...args);
    }
    debug(prefix, message, ...args) {
        this.log('debug', prefix, message, ...args);
    }
    info(prefix, message, ...args) {
        this.log('info', prefix, message, ...args);
    }
    timing(prefix, message, ...args) {
        this.log('timing', prefix, message, ...args);
    }
    http(prefix, message, ...args) {
        this.log('http', prefix, message, ...args);
    }
    notice(prefix, message, ...args) {
        this.log('notice', prefix, message, ...args);
    }
    warn(prefix, message, ...args) {
        this.log('warn', prefix, message, ...args);
    }
    error(prefix, message, ...args) {
        this.log('error', prefix, message, ...args);
    }
    silent(prefix, message, ...args) {
        this.log('silent', prefix, message, ...args);
    }
    addLevel(level, n, style, disp) {
        this._levels[level] = n;
        this._style[level] = style;
        if (!this[level]) {
            this[level] = (prefix, message, ...args) => {
                this.log(level, prefix, message, ...args);
            };
        }
        // If 'disp' is null or undefined, use the level as a default
        this._disp[level] = disp ?? level;
    }
    /**
     * Creates a log message
     * @param level
     * @param prefix
     * @param message message of the log which will be formatted using utils.format()
     * @param args additional arguments appended to the log message also formatted using utils.format()
     */
    log(level, prefix, message, ...args) {
        const l = this._levels[level];
        if (l === undefined) {
            this.emit('error', new Error(util.format('Undefined log level: %j', level)));
            return;
        }
        const messageArguments = [];
        let stack = null;
        for (const formatArg of [message, ...args]) {
            messageArguments.push(formatArg);
            // resolve stack traces to a plain string.
            if (lodash_1.default.isError(formatArg) && formatArg.stack) {
                Object.defineProperty(formatArg, 'stack', {
                    value: (stack = formatArg.stack + ''),
                    enumerable: true,
                    writable: true,
                });
            }
        }
        if (stack) {
            messageArguments.unshift(`${stack}\n`);
        }
        const formattedMessage = util.format(...messageArguments);
        const m = {
            id: this._id++,
            timestamp: Date.now(),
            level,
            prefix: this._secureValuesPreprocessor.preprocess((0, utils_1.unleakString)(prefix || '')),
            message: this._secureValuesPreprocessor.preprocess((0, utils_1.unleakString)(formattedMessage)),
        };
        this.emit('log', m);
        this.emit('log.' + level, m);
        if (m.prefix) {
            this.emit(m.prefix, m);
        }
        this._history.set(m.id, m);
        this.emitLog(m);
    }
    /**
     * Loads the JSON file containing secure values replacement rules.
     * This might be necessary to hide sensitive values that may possibly
     * appear in Appium logs.
     * Each call to this method replaces the previously loaded rules if any existed.
     *
     * @param {string|string[]|LogFiltersConfig} rulesJsonPath The full path to the JSON file containing
     * the replacement rules. Each rule could either be a string to be replaced
     * or an object with predefined properties.
     * @throws {Error} If the given file cannot be loaded
     * @returns {Promise<PreprocessingRulesLoadResult>}
     */
    async loadSecureValuesPreprocessingRules(rulesJsonPath) {
        const issues = await this._secureValuesPreprocessor.loadRules(rulesJsonPath);
        return {
            issues,
            rules: lodash_1.default.cloneDeep(this._secureValuesPreprocessor.rules),
        };
    }
    emitLog(m) {
        if (this._paused) {
            this._buffer.push(m);
            return;
        }
        const l = this._levels[m.level];
        if (l === undefined) {
            return;
        }
        if (l < this._levels[this.level]) {
            return;
        }
        if (l > 0 && !isFinite(l)) {
            return;
        }
        // If 'disp' is null or undefined, use the lvl as a default
        // Allows: '', 0 as valid disp
        const disp = this._disp[m.level];
        this.clearProgress();
        for (const line of m.message.split(/\r?\n/)) {
            const heading = this.heading;
            if (heading) {
                this.write(heading, this.headingStyle);
                this.write(' ');
            }
            this.write(String(disp), this._style[m.level]);
            const p = m.prefix || '';
            if (p) {
                this.write(' ');
            }
            this.write(p, this.prefixStyle);
            this.write(` ${line}\n`);
        }
        this.showProgress();
    }
    _format(msg, style = {}) {
        if (!this.stream) {
            return;
        }
        let output = '';
        if (this.useColor()) {
            const settings = [];
            if (style.fg) {
                settings.push(style.fg);
            }
            if (style.bg) {
                settings.push('bg' + style.bg[0].toUpperCase() + style.bg.slice(1));
            }
            if (style.bold) {
                settings.push('bold');
            }
            if (style.underline) {
                settings.push('underline');
            }
            if (style.inverse) {
                settings.push('inverse');
            }
            if (settings.length) {
                output += console_control_strings_1.default.color(settings);
            }
            if (style.bell) {
                output += console_control_strings_1.default.beep();
            }
        }
        output += msg;
        if (this.useColor()) {
            output += console_control_strings_1.default.color('reset');
        }
        return output;
    }
    write(msg, style = {}) {
        if (!this.stream) {
            return;
        }
        const formatted = this._format(msg, style);
        if (formatted !== undefined) {
            this.stream.write(formatted);
        }
    }
    initDefaultLevels() {
        for (const [level, index, style, disp] of DEFAULT_LOG_LEVELS) {
            this._levels[level] = index;
            this._style[level] = style;
            this._disp[level] = disp ?? level;
        }
    }
    // this functionality has been deliberately disabled
    clearProgress() { }
    showProgress() { }
}
exports.Log = Log;
exports.GLOBAL_LOG = new Log();
exports.default = exports.GLOBAL_LOG;
//# sourceMappingURL=log.js.map