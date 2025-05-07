import { generateCustomQueriesProperty, generateCustomMutationsProperty, generateCustomSubscriptionsProperty } from './internals/generateCustomOperationsProperty.mjs';
import { generateConversationsProperty } from './internals/utils/clientProperties/generateConversationsProperty.mjs';
import { generateGenerationsProperty } from './internals/utils/clientProperties/generateGenerationsProperty.mjs';
import { generateEnumsProperty } from './internals/utils/clientProperties/generateEnumsProperty.mjs';
import { generateModelsProperty } from './internals/utils/clientProperties/generateModelsProperty.mjs';
import { upgradeClientCancellation } from './internals/cancellation.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function addSchemaToClient(client, apiGraphqlConfig, getInternals) {
    upgradeClientCancellation(client);
    client.models = generateModelsProperty(client, apiGraphqlConfig, getInternals);
    client.enums = generateEnumsProperty(apiGraphqlConfig);
    client.queries = generateCustomQueriesProperty(client, apiGraphqlConfig, getInternals);
    client.mutations = generateCustomMutationsProperty(client, apiGraphqlConfig, getInternals);
    client.subscriptions = generateCustomSubscriptionsProperty(client, apiGraphqlConfig, getInternals);
    client.conversations = generateConversationsProperty(client, apiGraphqlConfig, getInternals);
    client.generations = generateGenerationsProperty(client, apiGraphqlConfig, getInternals);
    return client;
}

export { addSchemaToClient };
//# sourceMappingURL=addSchemaToClient.mjs.map
