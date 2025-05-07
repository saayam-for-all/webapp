import { graphQLOperationsInfo } from './APIClient.mjs';

const attributeIsSecondaryIndex = (attr) => {
    return (attr.type === 'key' &&
        // presence of `name` property distinguishes GSI from primary index
        attr.properties?.name &&
        attr.properties?.queryField &&
        attr.properties?.fields.length > 0);
};
const getSecondaryIndexesFromSchemaModel = (model) => {
    const idxs = model.attributes
        ?.filter(attributeIsSecondaryIndex)
        .map((attr) => {
        const queryField = attr.properties.queryField;
        const [pk, ...sk] = attr.properties.fields;
        return {
            queryField,
            pk,
            sk,
        };
    });
    return idxs || [];
};
/**
 * returns graphQLOperationsInfo, but filters out operations that were disabled via model().disableOperations([...])
 */
const excludeDisabledOps = (mis, modelName) => {
    /* Example model attributes in MIS {
      "type": "model",
      "properties": {
        "subscriptions": null,
        "mutations": { "delete": null }
        "timestamps": null
      } }*/
    const modelAttrs = mis.models[modelName].attributes?.find((attr) => attr.type === 'model');
    const coarseToFineDict = {
        queries: ['list', 'get', 'observeQuery'],
        mutations: ['create', 'update', 'delete'],
        subscriptions: ['onCreate', 'onUpdate', 'onDelete'],
    };
    const disabledOps = [];
    if (!modelAttrs) {
        return graphQLOperationsInfo;
    }
    if (modelAttrs.properties) {
        for (const [key, value] of Object.entries(modelAttrs.properties)) {
            // model.properties can contain other values that are not relevant to disabling ops, e.g. timestamps
            if (!(key in coarseToFineDict)) {
                continue;
            }
            if (value === null) {
                // coarse-grained disable, e.g. "subscriptions": null,
                disabledOps.push(...coarseToFineDict[key]);
            }
            else if (value instanceof Object) {
                // fine-grained, e.g. "mutations": { "delete": null }
                disabledOps.push(...Object.keys(value));
            }
        }
    }
    // observeQuery only exists on the client side, so can't be explicitly disabled via schema builder.
    // It's unusable without `list`
    if (disabledOps.includes('list')) {
        disabledOps.push('observeQuery');
    }
    // graphQLOperationsInfo keys are in caps
    const disabledOpsUpper = disabledOps.map((op) => op.toUpperCase());
    const filteredGraphQLOperations = Object.fromEntries(Object.entries(graphQLOperationsInfo).filter(([key]) => !disabledOpsUpper.includes(key)));
    return filteredGraphQLOperations;
};

export { excludeDisabledOps, getSecondaryIndexesFromSchemaModel };
//# sourceMappingURL=clientUtils.mjs.map
