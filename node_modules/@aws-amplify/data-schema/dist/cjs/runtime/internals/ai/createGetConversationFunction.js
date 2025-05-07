'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetConversationFunction = void 0;
const get_1 = require("../operations/get");
const convertItemToConversation_1 = require("./convertItemToConversation");
const getCustomUserAgentDetails_1 = require("./getCustomUserAgentDetails");
const createGetConversationFunction = (client, modelIntrospection, conversationRouteName, conversationModel, conversationMessageModel, getInternals) => async ({ id }) => {
    const get = (0, get_1.getFactory)(client, modelIntrospection, conversationModel, 'GET', getInternals, false, (0, getCustomUserAgentDetails_1.getCustomUserAgentDetails)(getCustomUserAgentDetails_1.AiAction.GetConversation));
    const { data, errors } = await get({ id });
    return {
        data: data
            ? (0, convertItemToConversation_1.convertItemToConversation)(client, modelIntrospection, data.id, data.createdAt, data.updatedAt, conversationRouteName, conversationMessageModel, getInternals, data?.metadata, data?.name)
            : data,
        errors,
    };
};
exports.createGetConversationFunction = createGetConversationFunction;
//# sourceMappingURL=createGetConversationFunction.js.map
