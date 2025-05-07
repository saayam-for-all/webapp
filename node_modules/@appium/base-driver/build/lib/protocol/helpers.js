"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3C_ELEMENT_KEY = exports.MJSONWP_ELEMENT_KEY = void 0;
exports.formatResponseValue = formatResponseValue;
exports.formatStatus = formatStatus;
const lodash_1 = __importDefault(require("lodash"));
const helpers_1 = require("../basedriver/helpers");
const constants_1 = require("../constants");
Object.defineProperty(exports, "MJSONWP_ELEMENT_KEY", { enumerable: true, get: function () { return constants_1.MJSONWP_ELEMENT_KEY; } });
Object.defineProperty(exports, "W3C_ELEMENT_KEY", { enumerable: true, get: function () { return constants_1.W3C_ELEMENT_KEY; } });
/**
 * Preprocesses the resulting value for API responses,
 * so they have keys for both W3C and JSONWP protocols.
 * The argument value is NOT mutated
 *
 * @param {?Object} resValue The actual response value
 * @returns {?Object} Either modified value or the same one if
 * nothing has been modified
 */
function formatResponseValue(resValue) {
    if (lodash_1.default.isUndefined(resValue)) {
        // convert undefined to null
        return null;
    }
    // If the MJSONWP element key format (ELEMENT) was provided, add a duplicate key (element-6066-11e4-a52e-4f735466cecf)
    // If the W3C element key format (element-6066-11e4-a52e-4f735466cecf) was provided, add a duplicate key (ELEMENT)
    return (0, helpers_1.duplicateKeys)(resValue, constants_1.MJSONWP_ELEMENT_KEY, constants_1.W3C_ELEMENT_KEY);
}
/**
 * Properly formats the status for API responses,
 * so they are correct for the W3C protocol.
 *
 * @param {Object} responseBody
 * @returns {Object} The fixed response body
 */
function formatStatus(responseBody) {
    return lodash_1.default.isPlainObject(responseBody) ? lodash_1.default.omit(responseBody, ['status']) : responseBody;
}
//# sourceMappingURL=helpers.js.map