import { brand } from './util/Brand.mjs';

const brandName = 'modelIndexType';
function _modelIndex(partitionKeyFieldName) {
    const data = {
        partitionKey: partitionKeyFieldName,
        sortKeys: [],
        indexName: '',
        queryField: '',
    };
    const builder = {
        sortKeys(sortKeys) {
            data.sortKeys = sortKeys;
            return this;
        },
        name(name) {
            data.indexName = name;
            return this;
        },
        queryField(field) {
            data.queryField = field;
            return this;
        },
        ...brand(brandName),
    };
    return { ...builder, data };
}
function modelIndex(partitionKeyFieldName) {
    return _modelIndex(partitionKeyFieldName);
}

export { modelIndex };
//# sourceMappingURL=ModelIndex.mjs.map
