"use strict";
// @ts-check
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isW3cCaps = isW3cCaps;
exports.fixCaps = fixCaps;
const lodash_1 = __importDefault(require("lodash"));
function isW3cCaps(caps) {
    if (!lodash_1.default.isPlainObject(caps)) {
        return false;
    }
    const isFirstMatchValid = () => lodash_1.default.isArray(caps.firstMatch) &&
        !lodash_1.default.isEmpty(caps.firstMatch) &&
        lodash_1.default.every(caps.firstMatch, lodash_1.default.isPlainObject);
    const isAlwaysMatchValid = () => lodash_1.default.isPlainObject(caps.alwaysMatch);
    if (lodash_1.default.has(caps, 'firstMatch') && lodash_1.default.has(caps, 'alwaysMatch')) {
        return isFirstMatchValid() && isAlwaysMatchValid();
    }
    if (lodash_1.default.has(caps, 'firstMatch')) {
        return isFirstMatchValid();
    }
    if (lodash_1.default.has(caps, 'alwaysMatch')) {
        return isAlwaysMatchValid();
    }
    return false;
}
/**
 *
 * @template {Constraints} C
 * @param {any} oldCaps
 * @param {C} desiredCapConstraints
 * @param {AppiumLogger} log
 * @returns {Capabilities<C>}
 */
function fixCaps(oldCaps, desiredCapConstraints, log) {
    let caps = lodash_1.default.clone(oldCaps);
    // boolean capabilities can be passed in as strings 'false' and 'true'
    // which we want to translate into boolean values
    let booleanCaps = lodash_1.default.keys(lodash_1.default.pickBy(desiredCapConstraints, (k) => k.isBoolean === true));
    for (let cap of booleanCaps) {
        let value = oldCaps[cap];
        if (lodash_1.default.isString(value)) {
            value = value.toLowerCase();
            if (value === 'true' || value === 'false') {
                log.warn(`Capability '${cap}' changed from string to boolean. This may cause unexpected behavior`);
                caps[cap] = value === 'true';
            }
        }
    }
    // int capabilities are often sent in as strings by frameworks
    let intCaps = /** @type {import('type-fest').StringKeyOf<typeof caps>[]} */ (lodash_1.default.keys(lodash_1.default.pickBy(desiredCapConstraints, (k) => k.isNumber === true)));
    for (let cap of intCaps) {
        let value = oldCaps[cap];
        if (lodash_1.default.isString(value)) {
            value = value.trim();
            let newValue = parseInt(value, 10);
            if (value !== `${newValue}`) {
                newValue = parseFloat(value);
            }
            log.warn(`Capability '${cap}' changed from string ('${value}') to integer (${newValue}). This may cause unexpected behavior`);
            caps[cap] = newValue;
        }
    }
    return caps;
}
/**
 * @typedef {import('@appium/types').Constraints} Constraints
 * @typedef {import('@appium/types').AppiumLogger} AppiumLogger
 * @typedef {import('@appium/types').StringRecord} StringRecord
 * @typedef {import('@appium/types').BaseDriverCapConstraints} BaseDriverCapConstraints
 */
/**
 * @template {Constraints} C
 * @typedef {import('@appium/types').Capabilities<C>} Capabilities
 */
//# sourceMappingURL=capabilities.js.map