'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertItemToConversation = void 0;
const createListMessagesFunction_1 = require("./createListMessagesFunction");
const createOnStreamEventFunction_1 = require("./createOnStreamEventFunction");
const createSendMessageFunction_1 = require("./createSendMessageFunction");
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
        onStreamEvent: (0, createOnStreamEventFunction_1.createOnStreamEventFunction)(client, modelIntrospection, conversationId, conversationRouteName, getInternals),
        sendMessage: (0, createSendMessageFunction_1.createSendMessageFunction)(client, modelIntrospection, conversationId, conversationRouteName, getInternals),
        listMessages: (0, createListMessagesFunction_1.createListMessagesFunction)(client, modelIntrospection, conversationId, conversationMessageModel, getInternals),
    };
};
exports.convertItemToConversation = convertItemToConversation;
//# sourceMappingURL=convertItemToConversation.js.map
