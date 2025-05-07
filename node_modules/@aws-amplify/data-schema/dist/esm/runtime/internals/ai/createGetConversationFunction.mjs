import { getFactory } from '../operations/get.mjs';
import { convertItemToConversation } from './convertItemToConversation.mjs';
import { getCustomUserAgentDetails, AiAction } from './getCustomUserAgentDetails.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createGetConversationFunction = (client, modelIntrospection, conversationRouteName, conversationModel, conversationMessageModel, getInternals) => async ({ id }) => {
    const get = getFactory(client, modelIntrospection, conversationModel, 'GET', getInternals, false, getCustomUserAgentDetails(AiAction.GetConversation));
    const { data, errors } = await get({ id });
    return {
        data: data
            ? convertItemToConversation(client, modelIntrospection, data.id, data.createdAt, data.updatedAt, conversationRouteName, conversationMessageModel, getInternals, data?.metadata, data?.name)
            : data,
        errors,
    };
};

export { createGetConversationFunction };
//# sourceMappingURL=createGetConversationFunction.mjs.map
