"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWindows = isWindows;
exports.isMac = isMac;
exports.isLinux = isLinux;
exports.isOSWin64 = isOSWin64;
exports.arch = arch;
exports.macOsxVersion = macOsxVersion;
const teen_process_1 = require("teen_process");
const lodash_1 = __importDefault(require("lodash"));
const os_1 = __importDefault(require("os"));
const VERSION_PATTERN = /^(\d+\.\d+)/m;
function isWindows() {
    return os_1.default.type() === 'Windows_NT';
}
function isMac() {
    return os_1.default.type() === 'Darwin';
}
function isLinux() {
    return !isWindows() && !isMac();
}
function isOSWin64() {
    return process.arch === 'x64' || lodash_1.default.has(process.env, 'PROCESSOR_ARCHITEW6432');
}
async function arch() {
    if (isLinux() || isMac()) {
        let { stdout } = await (0, teen_process_1.exec)('uname', ['-m']);
        return stdout.trim() === 'i686' ? '32' : '64';
    }
    else if (isWindows()) {
        let is64 = this.isOSWin64();
        return is64 ? '64' : '32';
    }
}
async function macOsxVersion() {
    let stdout;
    try {
        stdout = (await (0, teen_process_1.exec)('sw_vers', ['-productVersion'])).stdout.trim();
    }
    catch (err) {
        throw new Error(`Could not detect Mac OS X Version: ${err}`);
    }
    const versionMatch = VERSION_PATTERN.exec(stdout);
    if (!versionMatch) {
        throw new Error(`Could not detect Mac OS X Version from sw_vers output: '${stdout}'`);
    }
    return versionMatch[1];
}
//# sourceMappingURL=system.js.map