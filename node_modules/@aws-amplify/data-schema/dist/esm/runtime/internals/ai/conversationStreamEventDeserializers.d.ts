import { ConversationStreamEvent } from "../../../ai/ConversationType";
import { ConversationStreamErrorEvent } from "../../../ai/types/ConversationStreamEvent";
export declare const convertItemToConversationStreamEvent: ({ id, conversationId, associatedUserMessageId, contentBlockIndex, contentBlockDoneAtIndex, contentBlockDeltaIndex, contentBlockText, contentBlockToolUse, stopReason, errors, }: any) => {
    next?: ConversationStreamEvent;
    error?: ConversationStreamErrorEvent;
};
