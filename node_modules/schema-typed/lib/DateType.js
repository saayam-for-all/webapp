"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateType = void 0;
const MixedType_1 = require("./MixedType");
class DateType extends MixedType_1.MixedType {
    constructor(errorMessage) {
        super('date');
        super.pushRule({
            onValid: value => !/Invalid|NaN/.test(new Date(value).toString()),
            errorMessage: errorMessage || this.locale.type
        });
    }
    range(min, max, errorMessage = this.locale.range) {
        super.pushRule({
            onValid: value => new Date(value) >= new Date(min) && new Date(value) <= new Date(max),
            errorMessage,
            params: { min, max }
        });
        return this;
    }
    min(min, errorMessage = this.locale.min) {
        super.pushRule({
            onValid: value => new Date(value) >= new Date(min),
            errorMessage,
            params: { min }
        });
        return this;
    }
    max(max, errorMessage = this.locale.max) {
        super.pushRule({
            onValid: value => new Date(value) <= new Date(max),
            errorMessage,
            params: { max }
        });
        return this;
    }
}
exports.DateType = DateType;
function getDateType(errorMessage) {
    return new DateType(errorMessage);
}
exports.default = getDateType;
//# sourceMappingURL=DateType.js.map