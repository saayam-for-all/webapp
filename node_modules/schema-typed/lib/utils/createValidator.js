"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidator = void 0;
const formatErrorMessage_1 = __importDefault(require("./formatErrorMessage"));
function isObj(o) {
    return o != null && (typeof o === 'object' || typeof o == 'function');
}
function isPromiseLike(v) {
    return v instanceof Promise || (isObj(v) && typeof v.then === 'function');
}
/**
 * Create a data validator
 * @param data
 */
function createValidator(data, name, label) {
    return (value, rules) => {
        for (let i = 0; i < rules.length; i += 1) {
            const { onValid, errorMessage, params, isAsync } = rules[i];
            if (isAsync)
                continue;
            const checkResult = onValid(value, data, name);
            const errorMsg = typeof errorMessage === 'function' ? errorMessage() : errorMessage;
            if (checkResult === false) {
                return {
                    hasError: true,
                    errorMessage: (0, formatErrorMessage_1.default)(errorMsg, {
                        ...params,
                        name: label || (Array.isArray(name) ? name.join('.') : name)
                    })
                };
            }
            else if (isPromiseLike(checkResult)) {
                throw new Error('synchronous validator had an async result, you should probably call "checkAsync()"');
            }
            else if (typeof checkResult === 'object' && (checkResult.hasError || checkResult.array)) {
                return checkResult;
            }
        }
        return null;
    };
}
exports.createValidator = createValidator;
exports.default = createValidator;
//# sourceMappingURL=createValidator.js.map