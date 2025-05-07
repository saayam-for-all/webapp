'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListConversationsFunction = void 0;
const list_1 = require("../operations/list");
const convertItemToConversation_1 = require("./convertItemToConversation");
const getCustomUserAgentDetails_1 = require("./getCustomUserAgentDetails");
const createListConversationsFunction = (client, modelIntrospection, conversationRouteName, conversationModel, conversationMessageModel, getInternals) => async (input) => {
    const list = (0, list_1.listFactory)(client, modelIntrospection, conversationModel, getInternals, false, (0, getCustomUserAgentDetails_1.getCustomUserAgentDetails)(getCustomUserAgentDetails_1.AiAction.ListConversations));
    const { data, nextToken, errors } = await list(input);
    return {
        data: data.map((datum) => {
            return (0, convertItemToConversation_1.convertItemToConversation)(client, modelIntrospection, datum.id, datum.createdAt, datum.updatedAt, conversationRouteName, conversationMessageModel, getInternals, datum?.metadata, datum?.name);
        }),
        nextToken,
        errors,
    };
};
exports.createListConversationsFunction = createListConversationsFunction;
//# sourceMappingURL=createListConversationsFunction.js.map
