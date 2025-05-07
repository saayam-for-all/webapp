import { isApiGraphQLConfig } from './internals/utils/runtimeTypeGuards/isApiGraphQLProviderConfig.mjs';
import { generateCustomQueriesProperty, generateCustomMutationsProperty } from './internals/generateCustomOperationsProperty.mjs';
import { upgradeClientCancellation } from './internals/cancellation.mjs';
import './internals/ai/getCustomUserAgentDetails.mjs';
import '@smithy/util-base64';
import 'rxjs';
import { generateEnumsProperty } from './internals/utils/clientProperties/generateEnumsProperty.mjs';
import { generateModelsProperty } from './internals/server/generateModelsProperty.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// TODO: separate import path
function addSchemaToClientWithInstance(client, params, getInternals) {
    const apiGraphqlConfig = params.config?.API?.GraphQL;
    if (isApiGraphQLConfig(apiGraphqlConfig)) {
        upgradeClientCancellation(client);
        client.models = generateModelsProperty(client, params, getInternals);
        client.enums = generateEnumsProperty(apiGraphqlConfig);
        client.queries = generateCustomQueriesProperty(client, apiGraphqlConfig, getInternals);
        client.mutations = generateCustomMutationsProperty(client, apiGraphqlConfig, getInternals);
    }
    return client;
}

export { addSchemaToClientWithInstance };
//# sourceMappingURL=addSchemaToClientWithInstance.mjs.map
