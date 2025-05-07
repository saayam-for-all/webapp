import { MixedType } from './MixedType';
function toNumber(value) {
    return +value;
}
export class NumberType extends MixedType {
    constructor(errorMessage) {
        super('number');
        super.pushRule({
            onValid: value => /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value + ''),
            errorMessage: errorMessage || this.locale.type
        });
    }
    isInteger(errorMessage = this.locale.isInteger) {
        super.pushRule({
            onValid: value => /^-?\d+$/.test(value + ''),
            errorMessage
        });
        return this;
    }
    pattern(regexp, errorMessage = this.locale.pattern) {
        super.pushRule({
            onValid: value => regexp.test(value + ''),
            errorMessage,
            params: { regexp }
        });
        return this;
    }
    isOneOf(values, errorMessage = this.locale.isOneOf) {
        super.pushRule({
            onValid: value => values.includes(toNumber(value)),
            errorMessage,
            params: { values }
        });
        return this;
    }
    range(min, max, errorMessage = this.locale.range) {
        super.pushRule({
            onValid: value => toNumber(value) >= min && toNumber(value) <= max,
            errorMessage,
            params: { min, max }
        });
        return this;
    }
    min(min, errorMessage = this.locale.min) {
        super.pushRule({
            onValid: value => toNumber(value) >= min,
            errorMessage,
            params: { min }
        });
        return this;
    }
    max(max, errorMessage = this.locale.max) {
        super.pushRule({
            onValid: value => toNumber(value) <= max,
            errorMessage,
            params: { max }
        });
        return this;
    }
}
export default function getNumberType(errorMessage) {
    return new NumberType(errorMessage);
}
//# sourceMappingURL=NumberType.js.map