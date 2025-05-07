'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOnStreamEventFunction = void 0;
const custom_1 = require("../operations/custom");
const getCustomUserAgentDetails_1 = require("./getCustomUserAgentDetails");
const conversationStreamEventDeserializers_1 = require("./conversationStreamEventDeserializers");
const createOnStreamEventFunction = (client, modelIntrospection, conversationId, conversationRouteName, getInternals) => (handler) => {
    const { conversations } = modelIntrospection;
    // Safe guard for standalone function. When called as part of client generation, this should never be falsy.
    if (!conversations) {
        return {};
    }
    const subscribeSchema = conversations[conversationRouteName].message.subscribe;
    const subscribeOperation = (0, custom_1.customOpFactory)(client, modelIntrospection, 'subscription', subscribeSchema, false, getInternals, (0, getCustomUserAgentDetails_1.getCustomUserAgentDetails)(getCustomUserAgentDetails_1.AiAction.OnStreamEvent));
    return subscribeOperation({ conversationId }).subscribe((data) => {
        const { next, error } = (0, conversationStreamEventDeserializers_1.convertItemToConversationStreamEvent)(data);
        if (error)
            handler.error(error);
        if (next)
            handler.next(next);
    });
};
exports.createOnStreamEventFunction = createOnStreamEventFunction;
//# sourceMappingURL=createOnStreamEventFunction.js.map
