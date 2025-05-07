import type { ConversationMessageContent } from '../../../ai/types/ConversationMessageContent';
import type { ToolConfiguration } from '../../../ai/types/ToolConfiguration';
import type { ToolResultJsonContent } from '../../../ai/types/ToolResultContent';
export declare const serializeAiContext: (aiContext: string | Record<string, any>) => string;
export declare const serializeContent: (content: ConversationMessageContent[]) => (import("../../../ai/types/ConversationMessageContent").ConversationMessageTextContent | import("../../../ai/types/ConversationMessageContent").ConversationMessageToolUseContent | {
    image: {
        source: {
            bytes: string;
        };
        format: "gif" | "jpeg" | "png" | "webp";
    };
} | {
    document: {
        source: {
            bytes: string;
        };
        format: "pdf" | "csv" | "doc" | "docx" | "xls" | "xlsx" | "html" | "txt" | "md";
        name: string;
    };
} | {
    toolResult: {
        content: ({
            image: {
                source: {
                    bytes: string;
                };
                format: "gif" | "jpeg" | "png" | "webp";
            };
        } | import("../../../ai/types/ToolResultContent").ToolResultTextContent | ToolResultJsonContent | {
            json: string;
        })[];
        toolUseId: string;
    };
})[];
export declare const serializeToolConfiguration: ({ tools }: ToolConfiguration) => {
    tools: {
        toolSpec: {
            name: string;
            description: string | undefined;
            inputSchema: {
                json: string;
            };
        };
    }[];
};
