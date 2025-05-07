import { deserializeContent } from './conversationMessageDeserializers.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const convertItemToConversationMessage = ({ content, createdAt, id, conversationId, role, }) => ({
    content: deserializeContent(content ?? []),
    conversationId,
    createdAt,
    id,
    role,
});

export { convertItemToConversationMessage };
//# sourceMappingURL=convertItemToConversationMessage.mjs.map
