'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpdateConversationFunction = void 0;
const get_1 = require("../operations/get");
const convertItemToConversation_1 = require("./convertItemToConversation");
const getCustomUserAgentDetails_1 = require("./getCustomUserAgentDetails");
const createUpdateConversationFunction = (client, modelIntrospection, conversationRouteName, conversationModel, conversationMessageModel, getInternals) => async ({ id, metadata: metadataObject, name }) => {
    const metadata = JSON.stringify(metadataObject);
    const updateOperation = (0, get_1.getFactory)(client, modelIntrospection, conversationModel, 'UPDATE', getInternals, false, (0, getCustomUserAgentDetails_1.getCustomUserAgentDetails)(getCustomUserAgentDetails_1.AiAction.UpdateConversation));
    const { data, errors } = await updateOperation({ id, metadata, name });
    return {
        data: data
            ? (0, convertItemToConversation_1.convertItemToConversation)(client, modelIntrospection, data?.id, data?.createdAt, data?.updatedAt, conversationRouteName, conversationMessageModel, getInternals, data?.metadata, data?.name)
            : data,
        errors,
    };
};
exports.createUpdateConversationFunction = createUpdateConversationFunction;
//# sourceMappingURL=createUpdateConversationFunction.js.map
