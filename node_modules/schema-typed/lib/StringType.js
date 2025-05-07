"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringType = void 0;
const MixedType_1 = require("./MixedType");
class StringType extends MixedType_1.MixedType {
    constructor(errorMessage) {
        super('string');
        super.pushRule({
            onValid: v => typeof v === 'string',
            errorMessage: errorMessage || this.locale.type
        });
    }
    containsLetter(errorMessage = this.locale.containsLetter) {
        super.pushRule({
            onValid: v => /[a-zA-Z]/.test(v),
            errorMessage
        });
        return this;
    }
    containsUppercaseLetter(errorMessage = this.locale.containsUppercaseLetter) {
        super.pushRule({
            onValid: v => /[A-Z]/.test(v),
            errorMessage
        });
        return this;
    }
    containsLowercaseLetter(errorMessage = this.locale.containsLowercaseLetter) {
        super.pushRule({
            onValid: v => /[a-z]/.test(v),
            errorMessage
        });
        return this;
    }
    containsLetterOnly(errorMessage = this.locale.containsLetterOnly) {
        super.pushRule({
            onValid: v => /^[a-zA-Z]+$/.test(v),
            errorMessage
        });
        return this;
    }
    containsNumber(errorMessage = this.locale.containsNumber) {
        super.pushRule({
            onValid: v => /[0-9]/.test(v),
            errorMessage
        });
        return this;
    }
    isOneOf(values, errorMessage = this.locale.isOneOf) {
        super.pushRule({
            onValid: v => !!~values.indexOf(v),
            errorMessage,
            params: { values }
        });
        return this;
    }
    isEmail(errorMessage = this.locale.isEmail) {
        // http://emailregex.com/
        const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        super.pushRule({
            onValid: v => regexp.test(v),
            errorMessage
        });
        return this;
    }
    isURL(errorMessage = this.locale.isURL, options) {
        var _a;
        const regexp = new RegExp(((_a = options === null || options === void 0 ? void 0 : options.allowMailto) !== null && _a !== void 0 ? _a : false)
            ? '^(?:mailto:|(?:(?:http|https|ftp)://|//))(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$'
            : '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
        super.pushRule({
            onValid: v => regexp.test(v),
            errorMessage
        });
        return this;
    }
    isHex(errorMessage = this.locale.isHex) {
        const regexp = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;
        super.pushRule({
            onValid: v => regexp.test(v),
            errorMessage
        });
        return this;
    }
    pattern(regexp, errorMessage = this.locale.pattern) {
        super.pushRule({
            onValid: v => regexp.test(v),
            errorMessage,
            params: { regexp }
        });
        return this;
    }
    rangeLength(minLength, maxLength, errorMessage = this.locale.rangeLength) {
        super.pushRule({
            onValid: value => value.length >= minLength && value.length <= maxLength,
            errorMessage,
            params: { minLength, maxLength }
        });
        return this;
    }
    minLength(minLength, errorMessage = this.locale.minLength) {
        super.pushRule({
            onValid: value => Array.from(value).length >= minLength,
            errorMessage,
            params: { minLength }
        });
        return this;
    }
    maxLength(maxLength, errorMessage = this.locale.maxLength) {
        super.pushRule({
            onValid: value => Array.from(value).length <= maxLength,
            errorMessage,
            params: { maxLength }
        });
        return this;
    }
}
exports.StringType = StringType;
function getStringType(errorMessage) {
    return new StringType(errorMessage);
}
exports.default = getStringType;
//# sourceMappingURL=StringType.js.map