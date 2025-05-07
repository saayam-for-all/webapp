import { listFactory } from '../operations/list.mjs';
import { convertItemToConversation } from './convertItemToConversation.mjs';
import { getCustomUserAgentDetails, AiAction } from './getCustomUserAgentDetails.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createListConversationsFunction = (client, modelIntrospection, conversationRouteName, conversationModel, conversationMessageModel, getInternals) => async (input) => {
    const list = listFactory(client, modelIntrospection, conversationModel, getInternals, false, getCustomUserAgentDetails(AiAction.ListConversations));
    const { data, nextToken, errors } = await list(input);
    return {
        data: data.map((datum) => {
            return convertItemToConversation(client, modelIntrospection, datum.id, datum.createdAt, datum.updatedAt, conversationRouteName, conversationMessageModel, getInternals, datum?.metadata, datum?.name);
        }),
        nextToken,
        errors,
    };
};

export { createListConversationsFunction };
//# sourceMappingURL=createListConversationsFunction.mjs.map
