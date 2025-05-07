"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanType = void 0;
const MixedType_1 = require("./MixedType");
class BooleanType extends MixedType_1.MixedType {
    constructor(errorMessage) {
        super('boolean');
        super.pushRule({
            onValid: v => typeof v === 'boolean',
            errorMessage: errorMessage || this.locale.type
        });
    }
}
exports.BooleanType = BooleanType;
function getBooleanType(errorMessage) {
    return new BooleanType(errorMessage);
}
exports.default = getBooleanType;
//# sourceMappingURL=BooleanType.js.map