import { brand } from './util/Brand.mjs';
import { allow } from './Authorization.mjs';
import { modelIndex } from './ModelIndex.mjs';

const brandName = 'modelType';
function _model(fields) {
    const data = {
        fields,
        identifier: ['id'],
        secondaryIndexes: [],
        authorization: [],
        disabledOperations: [],
    };
    const builder = {
        identifier(identifier) {
            data.identifier = identifier;
            return this;
        },
        secondaryIndexes(callback) {
            data.secondaryIndexes = callback(modelIndex);
            return this;
        },
        disableOperations(ops) {
            data.disabledOperations = ops;
            return this;
        },
        authorization(callback) {
            const { resource: _, ...rest } = allow;
            const rules = callback(rest);
            data.authorization = Array.isArray(rules) ? rules : [rules];
            return this;
        },
        ...brand(brandName),
    };
    return {
        ...builder,
        data,
        relationships(relationships) {
            data.fields = { ...data.fields, ...relationships };
        },
        fields: data.fields,
    };
}
/**
 * Model Type type guard
 * @param modelType - api-next ModelType
 * @returns true if the given value is a ModelSchema
 */
const isSchemaModelType = (modelType) => {
    const internalType = modelType;
    return (typeof internalType === 'object' &&
        internalType.data !== undefined &&
        internalType.data.fields !== undefined &&
        internalType.data.authorization !== undefined &&
        internalType.data.identifier !== undefined &&
        internalType.data.secondaryIndexes !== undefined &&
        typeof internalType.relationships === 'function');
};
/**
 * A data model that creates a matching Amazon DynamoDB table and provides create, read (list and get), update,
 * delete, and subscription APIs.
 *
 * @param fields database table fields. Supports scalar types and relationship types.
 * @returns a data model definition
 */
function model(fields) {
    return _model(fields);
}

export { isSchemaModelType, model };
//# sourceMappingURL=ModelType.mjs.map
