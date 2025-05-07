import { getFactory } from '../operations/get.mjs';
import { convertItemToConversation } from './convertItemToConversation.mjs';
import { getCustomUserAgentDetails, AiAction } from './getCustomUserAgentDetails.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createDeleteConversationFunction = (client, modelIntrospection, conversationRouteName, conversationModel, conversationMessageModel, getInternals) => async ({ id }) => {
    const deleteOperation = getFactory(client, modelIntrospection, conversationModel, 'DELETE', getInternals, false, getCustomUserAgentDetails(AiAction.DeleteConversation));
    const { data, errors } = await deleteOperation({ id });
    return {
        data: data
            ? convertItemToConversation(client, modelIntrospection, data?.id, data?.createdAt, data?.updatedAt, conversationRouteName, conversationMessageModel, getInternals, data?.metadata, data?.name)
            : data,
        errors,
    };
};

export { createDeleteConversationFunction };
//# sourceMappingURL=createDeleteConversationFunction.mjs.map
