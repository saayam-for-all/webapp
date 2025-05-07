import { MJSONWP_ELEMENT_KEY } from '../constants';
import { W3C_ELEMENT_KEY } from '../constants';
/**
 * Preprocesses the resulting value for API responses,
 * so they have keys for both W3C and JSONWP protocols.
 * The argument value is NOT mutated
 *
 * @param {?Object} resValue The actual response value
 * @returns {?Object} Either modified value or the same one if
 * nothing has been modified
 */
export function formatResponseValue(resValue: any | null): any | null;
/**
 * Properly formats the status for API responses,
 * so they are correct for the W3C protocol.
 *
 * @param {Object} responseBody
 * @returns {Object} The fixed response body
 */
export function formatStatus(responseBody: any): any;
export { MJSONWP_ELEMENT_KEY, W3C_ELEMENT_KEY };
//# sourceMappingURL=helpers.d.ts.map