'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeToolConfiguration = exports.serializeContent = exports.serializeAiContext = void 0;
const util_base64_1 = require("@smithy/util-base64");
const serializeAiContext = (aiContext) => JSON.stringify(aiContext);
exports.serializeAiContext = serializeAiContext;
const serializeContent = (content) => content.map((block) => {
    if (block.image) {
        return serializeImageBlock(block);
    }
    if (block.document) {
        return serializeDocumentBlock(block);
    }
    if (block.toolResult) {
        return serializeToolResultBlock(block);
    }
    return block;
});
exports.serializeContent = serializeContent;
const serializeToolConfiguration = ({ tools }) => ({
    tools: Object.entries(tools).map(([name, tool]) => ({
        toolSpec: {
            name,
            description: tool.description,
            inputSchema: {
                json: JSON.stringify(tool.inputSchema.json),
            },
        },
    })),
});
exports.serializeToolConfiguration = serializeToolConfiguration;
const serializeImageBlock = ({ image }) => ({
    image: {
        ...image,
        source: {
            ...image.source,
            bytes: (0, util_base64_1.toBase64)(image.source.bytes),
        },
    },
});
const serializeDocumentBlock = ({ document, }) => ({
    document: {
        ...document,
        source: {
            ...document.source,
            bytes: (0, util_base64_1.toBase64)(document.source.bytes),
        },
    },
});
const serializeJsonBlock = ({ json }) => ({
    json: JSON.stringify(json),
});
const serializeToolResultBlock = ({ toolResult, }) => ({
    toolResult: {
        ...toolResult,
        content: toolResult.content.map((toolResultBlock) => {
            if (toolResultBlock.image) {
                return serializeImageBlock(toolResultBlock);
            }
            if (toolResultBlock.json) {
                return serializeJsonBlock(toolResultBlock);
            }
            return toolResultBlock;
        }),
    },
});
//# sourceMappingURL=conversationMessageSerializers.js.map
