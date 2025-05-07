import type { Conversation } from '../../../ai/ConversationType';
import type { BaseClient, ClientInternalsGetter, ModelIntrospectionSchema, SchemaModel } from '../../bridge-types';
export declare const convertItemToConversation: (client: BaseClient, modelIntrospection: ModelIntrospectionSchema, conversationId: string, conversationCreatedAt: string, conversationUpdatedAt: string, conversationRouteName: string, conversationMessageModel: SchemaModel, getInternals: ClientInternalsGetter, conversationMetadata?: Record<string, any>, conversationName?: string) => Conversation;
