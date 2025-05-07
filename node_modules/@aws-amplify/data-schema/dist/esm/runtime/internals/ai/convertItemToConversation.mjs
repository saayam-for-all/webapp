import { createListMessagesFunction } from './createListMessagesFunction.mjs';
import { createOnStreamEventFunction } from './createOnStreamEventFunction.mjs';
import { createSendMessageFunction } from './createSendMessageFunction.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const convertItemToConversation = (client, modelIntrospection, conversationId, conversationCreatedAt, conversationUpdatedAt, conversationRouteName, conversationMessageModel, getInternals, conversationMetadata, conversationName) => {
    if (!conversationId) {
        throw new Error(`An error occurred converting a ${conversationRouteName} conversation: Missing ID`);
    }
    return {
        id: conversationId,
        createdAt: conversationCreatedAt,
        updatedAt: conversationUpdatedAt,
        metadata: conversationMetadata,
        name: conversationName,
        onStreamEvent: createOnStreamEventFunction(client, modelIntrospection, conversationId, conversationRouteName, getInternals),
        sendMessage: createSendMessageFunction(client, modelIntrospection, conversationId, conversationRouteName, getInternals),
        listMessages: createListMessagesFunction(client, modelIntrospection, conversationId, conversationMessageModel, getInternals),
    };
};

export { convertItemToConversation };
//# sourceMappingURL=convertItemToConversation.mjs.map
