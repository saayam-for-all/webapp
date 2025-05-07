import { getFactory } from '../operations/get.mjs';
import { convertItemToConversation } from './convertItemToConversation.mjs';
import { getCustomUserAgentDetails, AiAction } from './getCustomUserAgentDetails.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createUpdateConversationFunction = (client, modelIntrospection, conversationRouteName, conversationModel, conversationMessageModel, getInternals) => async ({ id, metadata: metadataObject, name }) => {
    const metadata = JSON.stringify(metadataObject);
    const updateOperation = getFactory(client, modelIntrospection, conversationModel, 'UPDATE', getInternals, false, getCustomUserAgentDetails(AiAction.UpdateConversation));
    const { data, errors } = await updateOperation({ id, metadata, name });
    return {
        data: data
            ? convertItemToConversation(client, modelIntrospection, data?.id, data?.createdAt, data?.updatedAt, conversationRouteName, conversationMessageModel, getInternals, data?.metadata, data?.name)
            : data,
        errors,
    };
};

export { createUpdateConversationFunction };
//# sourceMappingURL=createUpdateConversationFunction.mjs.map
