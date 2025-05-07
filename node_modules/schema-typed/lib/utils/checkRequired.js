"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basicEmptyCheck_1 = __importDefault(require("./basicEmptyCheck"));
const isEmpty_1 = __importDefault(require("./isEmpty"));
function checkRequired(value, trim, emptyAllowed) {
    // String trim
    if (trim && typeof value === 'string') {
        value = value.replace(/(^\s*)|(\s*$)/g, '');
    }
    if (emptyAllowed) {
        return !(0, basicEmptyCheck_1.default)(value);
    }
    // Array
    if (Array.isArray(value)) {
        return !!value.length;
    }
    return !(0, isEmpty_1.default)(value);
}
exports.default = checkRequired;
//# sourceMappingURL=checkRequired.js.map