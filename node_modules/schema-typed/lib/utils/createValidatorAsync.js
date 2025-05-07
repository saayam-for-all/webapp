"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidatorAsync = void 0;
const formatErrorMessage_1 = __importStar(require("./formatErrorMessage"));
/**
 * Create a data asynchronous validator
 * @param data
 */
function createValidatorAsync(data, name, label) {
    function check(errorMessage) {
        return (checkResult) => {
            if (checkResult === false) {
                return { hasError: true, errorMessage };
            }
            else if (typeof checkResult === 'object' && (checkResult.hasError || checkResult.array)) {
                return checkResult;
            }
            return null;
        };
    }
    return (value, rules) => {
        const promises = rules.map(rule => {
            const { onValid, errorMessage, params } = rule;
            const errorMsg = typeof errorMessage === 'function' ? errorMessage() : errorMessage;
            return Promise.resolve(onValid(value, data, name)).then(check((0, formatErrorMessage_1.default)(errorMsg, {
                ...params,
                name: label || (0, formatErrorMessage_1.joinName)(name)
            })));
        });
        return Promise.all(promises).then(results => results.find((item) => item && (item === null || item === void 0 ? void 0 : item.hasError)));
    };
}
exports.createValidatorAsync = createValidatorAsync;
exports.default = createValidatorAsync;
//# sourceMappingURL=createValidatorAsync.js.map