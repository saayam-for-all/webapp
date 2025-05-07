'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSendMessageFunction = void 0;
const custom_1 = require("../operations/custom");
const convertItemToConversationMessage_1 = require("./convertItemToConversationMessage");
const conversationMessageSerializers_1 = require("./conversationMessageSerializers");
const getCustomUserAgentDetails_1 = require("./getCustomUserAgentDetails");
const createSendMessageFunction = (client, modelIntrospection, conversationId, conversationRouteName, getInternals) => async (input) => {
    const { conversations } = modelIntrospection;
    // Safe guard for standalone function. When called as part of client generation, this should never be falsy.
    if (!conversations) {
        return {};
    }
    const processedInput = typeof input === 'string' ? { content: [{ text: input }] } : input;
    const { content, aiContext, toolConfiguration } = processedInput;
    const sendSchema = conversations[conversationRouteName].message.send;
    const sendOperation = (0, custom_1.customOpFactory)(client, modelIntrospection, 'mutation', sendSchema, false, getInternals, (0, getCustomUserAgentDetails_1.getCustomUserAgentDetails)(getCustomUserAgentDetails_1.AiAction.SendMessage));
    const { data, errors } = await sendOperation({
        conversationId,
        content: (0, conversationMessageSerializers_1.serializeContent)(content),
        ...(aiContext && { aiContext: (0, conversationMessageSerializers_1.serializeAiContext)(aiContext) }),
        ...(toolConfiguration && {
            toolConfiguration: (0, conversationMessageSerializers_1.serializeToolConfiguration)(toolConfiguration),
        }),
    });
    return {
        data: data ? (0, convertItemToConversationMessage_1.convertItemToConversationMessage)(data) : data,
        errors,
    };
};
exports.createSendMessageFunction = createSendMessageFunction;
//# sourceMappingURL=createSendMessageFunction.js.map
