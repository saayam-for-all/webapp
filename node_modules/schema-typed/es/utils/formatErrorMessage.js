import isEmpty from './isEmpty';
export function joinName(name) {
    return Array.isArray(name) ? name.join('.') : name;
}
/**
 * formatErrorMessage('${name} is a required field', {name: 'email'});
 * output: 'email is a required field'
 */
export default function formatErrorMessage(errorMessage, params) {
    if (typeof errorMessage === 'string') {
        return errorMessage.replace(/\$\{\s*(\w+)\s*\}/g, (_, key) => {
            return isEmpty(params === null || params === void 0 ? void 0 : params[key]) ? `$\{${key}\}` : params === null || params === void 0 ? void 0 : params[key];
        });
    }
    return errorMessage;
}
//# sourceMappingURL=formatErrorMessage.js.map