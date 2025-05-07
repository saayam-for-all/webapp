import { listFactory } from '../operations/list.mjs';
import { indexQueryFactory } from '../operations/indexQuery.mjs';
import { getFactory } from '../operations/get.mjs';
import { excludeDisabledOps, getSecondaryIndexesFromSchemaModel } from '../clientUtils.mjs';

function generateModelsProperty(client, params, getInternals) {
    const models = {};
    const { config } = params;
    const useContext = params.amplify === null;
    if (!config) {
        throw new Error('generateModelsProperty cannot retrieve Amplify config');
    }
    if (!config.API?.GraphQL) {
        return {};
    }
    const modelIntrospection = config.API.GraphQL.modelIntrospection;
    if (!modelIntrospection) {
        return {};
    }
    const SSR_UNSUPORTED_OPS = [
        'ONCREATE',
        'ONUPDATE',
        'ONDELETE',
        'OBSERVEQUERY',
    ];
    for (const model of Object.values(modelIntrospection.models)) {
        const { name } = model;
        models[name] = {};
        const enabledModelOps = excludeDisabledOps(modelIntrospection, name);
        Object.entries(enabledModelOps).forEach(([key, { operationPrefix }]) => {
            const operation = key;
            // subscriptions are not supported in SSR
            if (SSR_UNSUPORTED_OPS.includes(operation))
                return;
            if (operation === 'LIST') {
                models[name][operationPrefix] = listFactory(client, modelIntrospection, model, getInternals, useContext);
            }
            else {
                models[name][operationPrefix] = getFactory(client, modelIntrospection, model, operation, getInternals, useContext);
            }
        });
        const secondaryIdxs = getSecondaryIndexesFromSchemaModel(model);
        for (const idx of secondaryIdxs) {
            models[name][idx.queryField] = indexQueryFactory(client, modelIntrospection, model, idx, getInternals, useContext);
        }
    }
    return models;
}

export { generateModelsProperty };
//# sourceMappingURL=generateModelsProperty.mjs.map
