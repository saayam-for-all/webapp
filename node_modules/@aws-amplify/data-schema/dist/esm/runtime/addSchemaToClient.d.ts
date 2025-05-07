import { ClientExtensions } from './client';
import { BaseClient, ClientInternalsGetter, GraphQLProviderConfig } from './bridge-types';
export declare function addSchemaToClient<T extends Record<any, any> = never>(client: BaseClient, apiGraphqlConfig: GraphQLProviderConfig['GraphQL'], getInternals: ClientInternalsGetter): BaseClient & ClientExtensions<T>;
