'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertItemToConversationStreamEvent = void 0;
const convertItemToConversationStreamEvent = ({ id, conversationId, associatedUserMessageId, contentBlockIndex, contentBlockDoneAtIndex, contentBlockDeltaIndex, contentBlockText, contentBlockToolUse, stopReason, errors, }) => {
    if (errors) {
        const error = {
            id,
            conversationId,
            associatedUserMessageId,
            errors,
        };
        return { error };
    }
    const next = removeNullsFromConversationStreamEvent({
        id,
        conversationId,
        associatedUserMessageId,
        contentBlockIndex,
        contentBlockDoneAtIndex,
        contentBlockDeltaIndex,
        text: contentBlockText,
        toolUse: deserializeToolUseBlock(contentBlockToolUse),
        stopReason,
    });
    return { next };
};
exports.convertItemToConversationStreamEvent = convertItemToConversationStreamEvent;
const deserializeToolUseBlock = (contentBlockToolUse) => {
    if (contentBlockToolUse) {
        const toolUseBlock = {
            ...contentBlockToolUse,
            input: JSON.parse(contentBlockToolUse.input),
        };
        return toolUseBlock;
    }
};
const removeNullsFromConversationStreamEvent = (block) => Object.fromEntries(Object.entries(block).filter(([_, v]) => v !== null));
//# sourceMappingURL=conversationStreamEventDeserializers.js.map
