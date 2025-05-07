"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberFormatter = exports.getFormatter = void 0;
var get_user_locale_1 = __importDefault(require("get-user-locale"));
var formatterCache = new Map();
function getFormatter(options) {
    return function formatter(locale, date) {
        var localeWithDefault = locale || (0, get_user_locale_1.default)();
        if (!formatterCache.has(localeWithDefault)) {
            formatterCache.set(localeWithDefault, new Map());
        }
        var formatterCacheLocale = formatterCache.get(localeWithDefault);
        if (!formatterCacheLocale.has(options)) {
            formatterCacheLocale.set(options, new Intl.DateTimeFormat(localeWithDefault || undefined, options).format);
        }
        return formatterCacheLocale.get(options)(date);
    };
}
exports.getFormatter = getFormatter;
var numberFormatterCache = new Map();
function getNumberFormatter(options) {
    return function (locale, number) {
        var localeWithDefault = locale || (0, get_user_locale_1.default)();
        if (!numberFormatterCache.has(localeWithDefault)) {
            numberFormatterCache.set(localeWithDefault, new Map());
        }
        var numberFormatterCacheLocale = numberFormatterCache.get(localeWithDefault);
        if (!numberFormatterCacheLocale.has(options)) {
            numberFormatterCacheLocale.set(options, new Intl.NumberFormat(localeWithDefault || undefined, options).format);
        }
        return numberFormatterCacheLocale.get(options)(number);
    };
}
exports.getNumberFormatter = getNumberFormatter;
