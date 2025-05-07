'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListMessagesFunction = void 0;
const list_1 = require("../operations/list");
const convertItemToConversationMessage_1 = require("./convertItemToConversationMessage");
const getCustomUserAgentDetails_1 = require("./getCustomUserAgentDetails");
const createListMessagesFunction = (client, modelIntrospection, conversationId, conversationMessageModel, getInternals) => async (input) => {
    const list = (0, list_1.listFactory)(client, modelIntrospection, conversationMessageModel, getInternals, false, (0, getCustomUserAgentDetails_1.getCustomUserAgentDetails)(getCustomUserAgentDetails_1.AiAction.ListMessages));
    const { data, nextToken, errors } = await list({
        ...input,
        filter: { conversationId: { eq: conversationId } },
    });
    return {
        data: data.map((item) => (0, convertItemToConversationMessage_1.convertItemToConversationMessage)(item)),
        nextToken,
        errors,
    };
};
exports.createListMessagesFunction = createListMessagesFunction;
//# sourceMappingURL=createListMessagesFunction.js.map
