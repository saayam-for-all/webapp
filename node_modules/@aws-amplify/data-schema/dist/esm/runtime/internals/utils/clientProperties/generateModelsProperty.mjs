import { listFactory } from '../../operations/list.mjs';
import { indexQueryFactory } from '../../operations/indexQuery.mjs';
import { getFactory } from '../../operations/get.mjs';
import { subscriptionFactory } from '../../operations/subscription.mjs';
import { observeQueryFactory } from '../../operations/observeQuery.mjs';
import { excludeDisabledOps, getSecondaryIndexesFromSchemaModel } from '../../clientUtils.mjs';

function generateModelsProperty(client, apiGraphQLConfig, getInternals) {
    const models = {};
    const modelIntrospection = apiGraphQLConfig.modelIntrospection;
    if (!modelIntrospection) {
        return {};
    }
    const SUBSCRIPTION_OPS = ['ONCREATE', 'ONUPDATE', 'ONDELETE'];
    for (const model of Object.values(modelIntrospection.models)) {
        const { name } = model;
        models[name] = {};
        const enabledModelOps = excludeDisabledOps(modelIntrospection, name);
        Object.entries(enabledModelOps).forEach(([key, { operationPrefix }]) => {
            const operation = key;
            if (operation === 'LIST') {
                models[name][operationPrefix] = listFactory(client, modelIntrospection, model, getInternals);
            }
            else if (SUBSCRIPTION_OPS.includes(operation)) {
                models[name][operationPrefix] = subscriptionFactory(client, modelIntrospection, model, operation, getInternals);
            }
            else if (operation === 'OBSERVEQUERY') {
                models[name][operationPrefix] = observeQueryFactory(models, model);
            }
            else {
                models[name][operationPrefix] = getFactory(client, modelIntrospection, model, operation, getInternals);
            }
        });
        const secondaryIdxs = getSecondaryIndexesFromSchemaModel(model);
        for (const idx of secondaryIdxs) {
            models[name][idx.queryField] = indexQueryFactory(client, modelIntrospection, model, idx, getInternals);
        }
    }
    return models;
}

export { generateModelsProperty };
//# sourceMappingURL=generateModelsProperty.mjs.map
