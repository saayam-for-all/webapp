import { getFactory } from '../operations/get.mjs';
import { convertItemToConversation } from './convertItemToConversation.mjs';
import { getCustomUserAgentDetails, AiAction } from './getCustomUserAgentDetails.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createCreateConversationFunction = (client, modelIntrospection, conversationRouteName, conversationModel, conversationMessageModel, getInternals) => async (input) => {
    const { name, metadata: metadataObject } = input ?? {};
    const metadata = JSON.stringify(metadataObject);
    const createOperation = getFactory(client, modelIntrospection, conversationModel, 'CREATE', getInternals, false, getCustomUserAgentDetails(AiAction.CreateConversation));
    const { data, errors } = await createOperation({ name, metadata });
    return {
        data: convertItemToConversation(client, modelIntrospection, data?.id, data?.createdAt, data?.updatedAt, conversationRouteName, conversationMessageModel, getInternals, data?.metadata, data?.name),
        errors,
    };
};

export { createCreateConversationFunction };
//# sourceMappingURL=createCreateConversationFunction.mjs.map
