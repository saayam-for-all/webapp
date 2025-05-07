import { createCreateConversationFunction } from '../../ai/createCreateConversationFunction.mjs';
import { createGetConversationFunction } from '../../ai/createGetConversationFunction.mjs';
import { createListConversationsFunction } from '../../ai/createListConversationsFunction.mjs';
import { createDeleteConversationFunction } from '../../ai/createDeleteConversationFunction.mjs';
import { createUpdateConversationFunction } from '../../ai/createUpdateConversationFunction.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function generateConversationsProperty(client, apiGraphQLConfig, getInternals) {
    const modelIntrospection = apiGraphQLConfig?.modelIntrospection;
    // conversations will be absent from model intro schema if no conversation routes
    // are present on the source schema.
    if (!modelIntrospection?.conversations) {
        return {};
    }
    const conversations = {};
    for (const { name, conversation, message, models, nonModels, enums, } of Object.values(modelIntrospection.conversations)) {
        const conversationModel = models[conversation.modelName];
        const conversationMessageModel = models[message.modelName];
        if (!conversationModel || !conversationMessageModel) {
            return {};
        }
        const conversationModelIntrospection = {
            ...modelIntrospection,
            models: {
                ...modelIntrospection.models,
                ...models,
            },
            nonModels: {
                ...modelIntrospection.nonModels,
                ...nonModels,
            },
            enums: {
                ...modelIntrospection.enums,
                ...enums,
            },
        };
        conversations[name] = {
            update: createUpdateConversationFunction(client, conversationModelIntrospection, name, conversationModel, conversationMessageModel, getInternals),
            create: createCreateConversationFunction(client, conversationModelIntrospection, name, conversationModel, conversationMessageModel, getInternals),
            get: createGetConversationFunction(client, conversationModelIntrospection, name, conversationModel, conversationMessageModel, getInternals),
            delete: createDeleteConversationFunction(client, conversationModelIntrospection, name, conversationModel, conversationMessageModel, getInternals),
            list: createListConversationsFunction(client, conversationModelIntrospection, name, conversationModel, conversationMessageModel, getInternals),
        };
    }
    return conversations;
}

export { generateConversationsProperty };
//# sourceMappingURL=generateConversationsProperty.mjs.map
