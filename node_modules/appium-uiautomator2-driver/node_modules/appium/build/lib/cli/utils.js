"use strict";
/* eslint-disable no-console */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RingBuffer = exports.JSON_SPACES = void 0;
exports.errAndQuit = errAndQuit;
exports.log = log;
exports.spinWith = spinWith;
const ora_1 = __importDefault(require("ora"));
exports.JSON_SPACES = 4;
/***
 * Log an error to the console and exit the process.
 * @param {boolean} json - whether we should log json or text
 * @param {any} msg - error message, object, Error instance, etc.
 */
function errAndQuit(json, msg) {
    if (json) {
        console.log(JSON.stringify({ error: `${msg}` }, null, exports.JSON_SPACES));
    }
    else {
        console.error(`${msg}`.red);
        if (msg.stderr) {
            console.error(`${msg.stderr}`.red);
        }
    }
    process.exit(1);
}
/**
 * Conditionally log something to the console
 * @param {boolean} json - whether we are in json mode (and should therefore not log)
 * @param {string} msg - string to log
 */
function log(json, msg) {
    if (!json) {
        console.log(msg);
    }
}
/**
 * Start a spinner, execute an async function, and then stop the spinner
 * @param {boolean} json - whether we are in json mode (and should therefore not log)
 * @param {string} msg - string to log
 * @param {function} fn - function to wrap with spinning
 */
async function spinWith(json, msg, fn) {
    if (json) {
        return await fn();
    }
    const spinner = (0, ora_1.default)(msg).start();
    let res;
    try {
        res = await fn();
        spinner.succeed();
        return res;
    }
    catch (err) {
        spinner.fail();
        throw err;
    }
}
class RingBuffer {
    constructor(size = 50) {
        this.size = size;
        this.buffer = [];
    }
    getBuff() {
        return this.buffer;
    }
    dequeue() {
        this.buffer.shift();
    }
    enqueue(item) {
        if (this.buffer.length >= this.size) {
            this.dequeue();
        }
        this.buffer.push(item);
    }
}
exports.RingBuffer = RingBuffer;
//# sourceMappingURL=utils.js.map