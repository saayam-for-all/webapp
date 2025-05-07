"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const logger_1 = __importDefault(require("./logger"));
const validate_js_1 = __importDefault(require("validate.js"));
const bluebird_1 = __importDefault(require("bluebird"));
exports.validator = 
/** @type {import('validate.js').ValidateJS & {promise: typeof import('bluebird')}} */ (validate_js_1.default);
exports.validator.validators.isString = function isString(value) {
    if (typeof value === 'string') {
        return null;
    }
    if (typeof value === 'undefined') {
        return null;
    }
    return 'must be of type string';
};
exports.validator.validators.isNumber = function isNumber(value) {
    if (typeof value === 'number') {
        return null;
    }
    if (typeof value === 'undefined') {
        return null;
    }
    // allow a string value
    if (typeof value === 'string' && !isNaN(Number(value))) {
        logger_1.default.warn('Number capability passed in as string. Functionality may be compromised.');
        return null;
    }
    return 'must be of type number';
};
exports.validator.validators.isBoolean = function isBoolean(value) {
    if (typeof value === 'boolean') {
        return null;
    }
    // allow a string value
    if (typeof value === 'string' && ['true', 'false', ''].includes(value)) {
        return null;
    }
    if (typeof value === 'undefined') {
        return null;
    }
    return 'must be of type boolean';
};
exports.validator.validators.isObject = function isObject(value) {
    if (typeof value === 'object') {
        return null;
    }
    if (typeof value === 'undefined') {
        return null;
    }
    return 'must be of type object';
};
exports.validator.validators.isArray = function isArray(value) {
    if (Array.isArray(value)) {
        return null;
    }
    if (typeof value === 'undefined') {
        return null;
    }
    return 'must be of type array';
};
exports.validator.validators.deprecated = function deprecated(value, options, key) {
    // do not print caps that hasn't been provided.
    if (typeof value !== 'undefined' && options) {
        logger_1.default.warn(`The '${key}' capability has been deprecated and must not be used anymore. ` +
            `Please check the driver documentation for possible alternatives.`);
    }
    return null;
};
exports.validator.validators.inclusionCaseInsensitive = function inclusionCaseInsensitive(value, options) {
    if (typeof value === 'undefined') {
        return null;
    }
    else if (typeof value !== 'string') {
        return 'unrecognised';
    }
    for (let option of options) {
        if (option.toLowerCase() === value.toLowerCase()) {
            return null;
        }
    }
    return `${value} not part of ${options.toString()}`;
};
exports.validator.promise = bluebird_1.default;
exports.validator.prettify = function prettify(val) {
    return val;
};
//# sourceMappingURL=desired-caps.js.map