import { ConversationRoute } from '../../../../ai/ConversationType';
import { BaseClient, ClientInternalsGetter, GraphQLProviderConfig } from '../../../bridge-types';
export declare function generateConversationsProperty(client: BaseClient, apiGraphQLConfig: GraphQLProviderConfig['GraphQL'], getInternals: ClientInternalsGetter): Record<string, ConversationRoute>;
