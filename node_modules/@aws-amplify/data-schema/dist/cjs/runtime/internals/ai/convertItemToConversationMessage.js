'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertItemToConversationMessage = void 0;
const conversationMessageDeserializers_1 = require("./conversationMessageDeserializers");
const convertItemToConversationMessage = ({ content, createdAt, id, conversationId, role, }) => ({
    content: (0, conversationMessageDeserializers_1.deserializeContent)(content ?? []),
    conversationId,
    createdAt,
    id,
    role,
});
exports.convertItemToConversationMessage = convertItemToConversationMessage;
//# sourceMappingURL=convertItemToConversationMessage.js.map
