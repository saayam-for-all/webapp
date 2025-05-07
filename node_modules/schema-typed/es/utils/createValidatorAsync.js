import formatErrorMessage, { joinName } from './formatErrorMessage';
/**
 * Create a data asynchronous validator
 * @param data
 */
export function createValidatorAsync(data, name, label) {
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
            return Promise.resolve(onValid(value, data, name)).then(check(formatErrorMessage(errorMsg, {
                ...params,
                name: label || joinName(name)
            })));
        });
        return Promise.all(promises).then(results => results.find((item) => item && (item === null || item === void 0 ? void 0 : item.hasError)));
    };
}
export default createValidatorAsync;
//# sourceMappingURL=createValidatorAsync.js.map