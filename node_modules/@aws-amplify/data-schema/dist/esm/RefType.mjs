import { allow } from './Authorization.mjs';
import './ModelField.mjs';

function brandedBuilder(builder) {
    return builder;
}
function _ref(link) {
    const data = {
        type: 'ref',
        link,
        valueRequired: false,
        array: false,
        arrayRequired: false,
        mutationOperations: [],
        authorization: [],
    };
    const builder = brandedBuilder({
        required() {
            if (data.array) {
                data.arrayRequired = true;
            }
            else {
                data.valueRequired = true;
            }
            return this;
        },
        array() {
            data.array = true;
            return this;
        },
        authorization(callback) {
            const rules = callback(allow);
            data.authorization = Array.isArray(rules) ? rules : [rules];
            return this;
        },
        mutations(operations) {
            data.mutationOperations = operations;
            return this;
        },
    });
    return { ...builder, data };
}
function ref(link) {
    return _ref(link);
}

export { ref };
//# sourceMappingURL=RefType.mjs.map
