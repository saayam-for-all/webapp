"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinName = void 0;
const isEmpty_1 = __importDefault(require("./isEmpty"));
function joinName(name) {
    return Array.isArray(name) ? name.join('.') : name;
}
exports.joinName = joinName;
/**
 * formatErrorMessage('${name} is a required field', {name: 'email'});
 * output: 'email is a required field'
 */
function formatErrorMessage(errorMessage, params) {
    if (typeof errorMessage === 'string') {
        return errorMessage.replace(/\$\{\s*(\w+)\s*\}/g, (_, key) => {
            return (0, isEmpty_1.default)(params === null || params === void 0 ? void 0 : params[key]) ? `$\{${key}\}` : params === null || params === void 0 ? void 0 : params[key];
        });
    }
    return errorMessage;
}
exports.default = formatErrorMessage;
//# sourceMappingURL=formatErrorMessage.js.map