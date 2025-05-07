import { BaseClient, ClientInternalsGetter, GraphQLProviderConfig } from '../../../bridge-types';
import { CustomQueries } from '../../../client';
export declare function generateGenerationsProperty<T extends Record<any, any>>(client: BaseClient, apiGraphQLConfig: GraphQLProviderConfig['GraphQL'], getInternals: ClientInternalsGetter): CustomQueries<T>;
