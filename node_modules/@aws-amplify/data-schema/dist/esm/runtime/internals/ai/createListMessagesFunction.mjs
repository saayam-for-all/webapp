import { listFactory } from '../operations/list.mjs';
import { convertItemToConversationMessage } from './convertItemToConversationMessage.mjs';
import { getCustomUserAgentDetails, AiAction } from './getCustomUserAgentDetails.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createListMessagesFunction = (client, modelIntrospection, conversationId, conversationMessageModel, getInternals) => async (input) => {
    const list = listFactory(client, modelIntrospection, conversationMessageModel, getInternals, false, getCustomUserAgentDetails(AiAction.ListMessages));
    const { data, nextToken, errors } = await list({
        ...input,
        filter: { conversationId: { eq: conversationId } },
    });
    return {
        data: data.map((item) => convertItemToConversationMessage(item)),
        nextToken,
        errors,
    };
};

export { createListMessagesFunction };
//# sourceMappingURL=createListMessagesFunction.mjs.map
