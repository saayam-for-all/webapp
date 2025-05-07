import { ModelTypes } from '../../../client';
import { BaseClient, ClientInternalsGetter, GraphQLProviderConfig } from '../../../bridge-types';
export declare function generateModelsProperty<T extends Record<any, any> = never>(client: BaseClient, apiGraphQLConfig: GraphQLProviderConfig['GraphQL'], getInternals: ClientInternalsGetter): ModelTypes<T> | ModelTypes<never>;
