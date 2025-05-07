import { MixedType, schemaSpecKey } from './MixedType';
import { createValidator, createValidatorAsync, checkRequired, isEmpty, formatErrorMessage } from './utils';
export class ObjectType extends MixedType {
    constructor(errorMessage) {
        super('object');
        super.pushRule({
            onValid: v => typeof v === 'object',
            errorMessage: errorMessage || this.locale.type
        });
    }
    check(value = this.value, data, fieldName) {
        const check = (value, data, type, childFieldKey) => {
            var _a;
            if (type.required && !checkRequired(value, type.trim, type.emptyAllowed)) {
                return {
                    hasError: true,
                    errorMessage: formatErrorMessage(type.requiredMessage || ((_a = type.locale) === null || _a === void 0 ? void 0 : _a.isRequired), {
                        name: type.fieldLabel || childFieldKey || fieldName
                    })
                };
            }
            if (type[schemaSpecKey] && typeof value === 'object') {
                const checkResultObject = {};
                let hasError = false;
                Object.entries(type[schemaSpecKey]).forEach(([k, v]) => {
                    const checkResult = check(value[k], value, v, k);
                    if (checkResult === null || checkResult === void 0 ? void 0 : checkResult.hasError) {
                        hasError = true;
                    }
                    checkResultObject[k] = checkResult;
                });
                return { hasError, object: checkResultObject };
            }
            const validator = createValidator(data, childFieldKey || fieldName, type.fieldLabel);
            const checkStatus = validator(value, type.priorityRules);
            if (checkStatus) {
                return checkStatus;
            }
            if (!type.required && isEmpty(value)) {
                return { hasError: false };
            }
            return validator(value, type.rules) || { hasError: false };
        };
        return check(value, data, this);
    }
    checkAsync(value = this.value, data, fieldName) {
        const check = (value, data, type, childFieldKey) => {
            var _a;
            if (type.required && !checkRequired(value, type.trim, type.emptyAllowed)) {
                return Promise.resolve({
                    hasError: true,
                    errorMessage: formatErrorMessage(type.requiredMessage || ((_a = type.locale) === null || _a === void 0 ? void 0 : _a.isRequired), {
                        name: type.fieldLabel || childFieldKey || fieldName
                    })
                });
            }
            const validator = createValidatorAsync(data, childFieldKey || fieldName, type.fieldLabel);
            return new Promise(resolve => {
                if (type[schemaSpecKey] && typeof value === 'object') {
                    const checkResult = {};
                    const checkAll = [];
                    const keys = [];
                    Object.entries(type[schemaSpecKey]).forEach(([k, v]) => {
                        checkAll.push(check(value[k], value, v, k));
                        keys.push(k);
                    });
                    return Promise.all(checkAll).then(values => {
                        let hasError = false;
                        values.forEach((v, index) => {
                            if (v === null || v === void 0 ? void 0 : v.hasError) {
                                hasError = true;
                            }
                            checkResult[keys[index]] = v;
                        });
                        resolve({ hasError, object: checkResult });
                    });
                }
                return validator(value, type.priorityRules)
                    .then((checkStatus) => {
                    if (checkStatus) {
                        resolve(checkStatus);
                    }
                })
                    .then(() => {
                    if (!type.required && isEmpty(value)) {
                        resolve({ hasError: false });
                    }
                })
                    .then(() => validator(value, type.rules))
                    .then((checkStatus) => {
                    if (checkStatus) {
                        resolve(checkStatus);
                    }
                    resolve({ hasError: false });
                });
            });
        };
        return check(value, data, this);
    }
    /**
     * @example
     * ObjectType().shape({
     *  name: StringType(),
     *  age: NumberType()
     * })
     */
    shape(fields) {
        this[schemaSpecKey] = fields;
        return this;
    }
}
export default function getObjectType(errorMessage) {
    return new ObjectType(errorMessage);
}
//# sourceMappingURL=ObjectType.js.map