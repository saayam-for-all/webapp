/**
 * A shortcut for a successful required doctor check
 *
 * @param {string} message
 * @returns {DoctorCheckResult}
 */
export function ok(message: string): DoctorCheckResult;
/**
 * A shortcut for an unsuccessful required doctor check
 *
 * @param {string} message
 * @returns {DoctorCheckResult}
 */
export function nok(message: string): DoctorCheckResult;
/**
 * A shortcut for a successful optional doctor check
 *
 * @param {string} message
 * @returns {DoctorCheckResult}
 */
export function okOptional(message: string): DoctorCheckResult;
/**
 * A shortcut for an unsuccessful optional doctor check
 *
 * @param {string} message
 * @returns {DoctorCheckResult}
 */
export function nokOptional(message: string): DoctorCheckResult;
/**
 * Throw this exception in the fix() method
 * of your doctor check to skip the actual fix if hasAutofix() is true
 */
export class FixSkippedError extends Error {
}
export type DoctorCheckResult = import("@appium/types").DoctorCheckResult;
//# sourceMappingURL=doctor.d.ts.map