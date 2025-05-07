import formatErrorMessage from './formatErrorMessage';
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
export function createValidator(data, name, label) {
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
                    errorMessage: formatErrorMessage(errorMsg, {
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
export default createValidator;
//# sourceMappingURL=createValidator.js.map