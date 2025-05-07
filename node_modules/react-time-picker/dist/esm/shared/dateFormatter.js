import getUserLocale from 'get-user-locale';
var formatterCache = new Map();
export function getFormatter(options) {
    return function formatter(locale, date) {
        var localeWithDefault = locale || getUserLocale();
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
var numberFormatterCache = new Map();
export function getNumberFormatter(options) {
    return function (locale, number) {
        var localeWithDefault = locale || getUserLocale();
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
