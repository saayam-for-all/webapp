import { fromBase64 } from '@smithy/util-base64';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const deserializeContent = (content) => content.map((block) => {
    if (block.image) {
        return deserializeImageBlock(block);
    }
    if (block.document) {
        return deserializeDocumentBlock(block);
    }
    if (block.toolUse) {
        return deserializeToolUseBlock(block);
    }
    if (block.toolResult) {
        return deserializeToolResultBlock(block);
    }
    return removeNullsFromBlock(block);
});
const deserializeImageBlock = ({ image }) => ({
    image: {
        ...image,
        source: {
            ...image.source,
            bytes: fromBase64(image.source.bytes),
        },
    },
});
const deserializeDocumentBlock = ({ document }) => ({
    document: {
        ...document,
        source: {
            ...document.source,
            bytes: fromBase64(document.source.bytes),
        },
    },
});
const deserializeJsonBlock = ({ json }) => ({
    json: JSON.parse(json),
});
const deserializeToolUseBlock = ({ toolUse }) => ({
    toolUse: {
        ...toolUse,
        input: JSON.parse(toolUse.input),
    },
});
const deserializeToolResultBlock = ({ toolResult, }) => ({
    toolResult: {
        toolUseId: toolResult.toolUseId,
        content: toolResult.content.map((toolResultBlock) => {
            if (toolResultBlock.image) {
                return deserializeImageBlock(toolResultBlock);
            }
            if (toolResultBlock.json) {
                return deserializeJsonBlock(toolResultBlock);
            }
            return removeNullsFromBlock(toolResultBlock);
        }),
    },
});
const removeNullsFromBlock = (block) => Object.fromEntries(Object.entries(block).filter(([_, v]) => v !== null));

export { deserializeContent };
//# sourceMappingURL=conversationMessageDeserializers.mjs.map
