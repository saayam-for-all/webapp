"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unleakString = unleakString;
/**
 * This function is necessary to workaround unexpected memory leaks
 * caused by NodeJS string interning
 * behavior described in https://bugs.chromium.org/p/v8/issues/detail?id=2869
 *
 * @param {any} s - The string to unleak
 * @return {string} Either the unleaked string or the original object converted to string
 */
function unleakString(s) {
    return ` ${s}`.substring(1);
}
//# sourceMappingURL=utils.js.map