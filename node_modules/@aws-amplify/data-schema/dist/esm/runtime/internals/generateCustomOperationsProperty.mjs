import { customOpFactory } from './operations/custom.mjs';

const operationTypeMap = {
    queries: 'query',
    mutations: 'mutation',
    subscriptions: 'subscription',
};
function generateCustomOperationsProperty(client, config, operationsType, getInternals) {
    // some bundlers end up with `Amplify.configure` being called *after* generate client.
    // if that occurs, we need to *not error* while we wait. handling for late configuration
    // occurs in `generateClient()`. we do not need to subscribe to Hub events here.
    if (!config) {
        return {};
    }
    const modelIntrospection = config.modelIntrospection;
    // model intro schema might be absent if there's not actually a configured GraphQL API
    if (!modelIntrospection) {
        return {};
    }
    // custom operations will be absent from model intro schema if no custom ops
    // are present on the source schema.
    const operations = modelIntrospection[operationsType];
    if (!operations) {
        return {};
    }
    const ops = {};
    const useContext = getInternals(client).amplify === null;
    for (const operation of Object.values(operations)) {
        ops[operation.name] = customOpFactory(client, modelIntrospection, operationTypeMap[operationsType], operation, useContext, getInternals);
    }
    return ops;
}
function generateCustomMutationsProperty(client, config, getInternals) {
    return generateCustomOperationsProperty(client, config, 'mutations', getInternals);
}
function generateCustomQueriesProperty(client, config, getInternals) {
    return generateCustomOperationsProperty(client, config, 'queries', getInternals);
}
function generateCustomSubscriptionsProperty(client, config, getInternals) {
    return generateCustomOperationsProperty(client, config, 'subscriptions', getInternals);
}

export { generateCustomMutationsProperty, generateCustomOperationsProperty, generateCustomQueriesProperty, generateCustomSubscriptionsProperty };
//# sourceMappingURL=generateCustomOperationsProperty.mjs.map
