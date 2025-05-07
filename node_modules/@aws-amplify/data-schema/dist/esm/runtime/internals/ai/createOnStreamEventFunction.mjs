import { customOpFactory } from '../operations/custom.mjs';
import { getCustomUserAgentDetails, AiAction } from './getCustomUserAgentDetails.mjs';
import { convertItemToConversationStreamEvent } from './conversationStreamEventDeserializers.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createOnStreamEventFunction = (client, modelIntrospection, conversationId, conversationRouteName, getInternals) => (handler) => {
    const { conversations } = modelIntrospection;
    // Safe guard for standalone function. When called as part of client generation, this should never be falsy.
    if (!conversations) {
        return {};
    }
    const subscribeSchema = conversations[conversationRouteName].message.subscribe;
    const subscribeOperation = customOpFactory(client, modelIntrospection, 'subscription', subscribeSchema, false, getInternals, getCustomUserAgentDetails(AiAction.OnStreamEvent));
    return subscribeOperation({ conversationId }).subscribe((data) => {
        const { next, error } = convertItemToConversationStreamEvent(data);
        if (error)
            handler.error(error);
        if (next)
            handler.next(next);
    });
};

export { createOnStreamEventFunction };
//# sourceMappingURL=createOnStreamEventFunction.mjs.map
