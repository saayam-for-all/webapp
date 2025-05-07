"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixSkippedError = void 0;
exports.ok = ok;
exports.nok = nok;
exports.okOptional = okOptional;
exports.nokOptional = nokOptional;
/**
 * A shortcut for a successful required doctor check
 *
 * @param {string} message
 * @returns {DoctorCheckResult}
 */
function ok(message) {
    return { ok: true, optional: false, message };
}
/**
 * A shortcut for an unsuccessful required doctor check
 *
 * @param {string} message
 * @returns {DoctorCheckResult}
 */
function nok(message) {
    return { ok: false, optional: false, message };
}
/**
 * A shortcut for a successful optional doctor check
 *
 * @param {string} message
 * @returns {DoctorCheckResult}
 */
function okOptional(message) {
    return { ok: true, optional: true, message };
}
/**
 * A shortcut for an unsuccessful optional doctor check
 *
 * @param {string} message
 * @returns {DoctorCheckResult}
 */
function nokOptional(message) {
    return { ok: false, optional: true, message };
}
/**
 * Throw this exception in the fix() method
 * of your doctor check to skip the actual fix if hasAutofix() is true
 */
class FixSkippedError extends Error {
}
exports.FixSkippedError = FixSkippedError;
/**
 * @typedef {import('@appium/types').DoctorCheckResult} DoctorCheckResult
 */
//# sourceMappingURL=doctor.js.map