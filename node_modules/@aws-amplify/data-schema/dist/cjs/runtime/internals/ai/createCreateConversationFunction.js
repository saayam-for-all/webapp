'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCreateConversationFunction = void 0;
const get_1 = require("../operations/get");
const convertItemToConversation_1 = require("./convertItemToConversation");
const getCustomUserAgentDetails_1 = require("./getCustomUserAgentDetails");
const createCreateConversationFunction = (client, modelIntrospection, conversationRouteName, conversationModel, conversationMessageModel, getInternals) => async (input) => {
    const { name, metadata: metadataObject } = input ?? {};
    const metadata = JSON.stringify(metadataObject);
    const createOperation = (0, get_1.getFactory)(client, modelIntrospection, conversationModel, 'CREATE', getInternals, false, (0, getCustomUserAgentDetails_1.getCustomUserAgentDetails)(getCustomUserAgentDetails_1.AiAction.CreateConversation));
    const { data, errors } = await createOperation({ name, metadata });
    return {
        data: (0, convertItemToConversation_1.convertItemToConversation)(client, modelIntrospection, data?.id, data?.createdAt, data?.updatedAt, conversationRouteName, conversationMessageModel, getInternals, data?.metadata, data?.name),
        errors,
    };
};
exports.createCreateConversationFunction = createCreateConversationFunction;
//# sourceMappingURL=createCreateConversationFunction.js.map
