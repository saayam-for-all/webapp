import type { Conversation, ConversationMessage, ConversationStreamEvent } from '../../ai/ConversationType';
import type { ClientSchemaProperty } from '../Core';
export interface ClientConversation extends Pick<ClientSchemaProperty, '__entityType'> {
    __entityType: 'customConversation';
    type: Conversation;
    messageType: ConversationMessage;
    streamEventType: ConversationStreamEvent;
}
