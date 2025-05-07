import { customOpFactory } from '../../operations/custom.mjs';
import { getCustomUserAgentDetails, AiAction } from '../../ai/getCustomUserAgentDetails.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function generateGenerationsProperty(client, apiGraphQLConfig, getInternals) {
    const modelIntrospection = apiGraphQLConfig?.modelIntrospection;
    // generations will be absent from model intro schema if no generation routes
    // are present on the source schema.
    if (!modelIntrospection?.generations) {
        return {};
    }
    const generations = {};
    for (const generation of Object.values(modelIntrospection.generations)) {
        generations[generation.name] = customOpFactory(client, modelIntrospection, 'query', generation, false, getInternals, getCustomUserAgentDetails(AiAction.Generation));
    }
    return generations;
}

export { generateGenerationsProperty };
//# sourceMappingURL=generateGenerationsProperty.mjs.map
