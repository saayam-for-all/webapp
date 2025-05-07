import { AWSAppSyncRealTimeProvider, GraphQLOperation, GraphQLOptions, GraphQLQuery, GraphQLResult, GraphQLSubscription, OperationTypeNode } from '@aws-amplify/api-graphql';
import { CustomUserAgentDetails } from '@aws-amplify/core/internals/utils';
import { Observable } from 'rxjs';
import { CustomHeaders } from '@aws-amplify/data-schema/runtime';
/**
 * NOTE!
 *
 * This is used only by DataStore.
 *
 * This can probably be pruned and/or removed. Just leaving it as much of the same
 * state as possible for V6 to reduce number of potentially impactful changes to DataStore.
 */
/**
 * @deprecated
 * Use RestApi or GraphQLAPI to reduce your application bundle size
 * Export Cloud Logic APIs
 */
export declare class InternalAPIClass {
    private _graphqlApi;
    Cache: import("@aws-amplify/core/dist/esm/Cache/StorageCache").StorageCache;
    /**
     * Initialize API
     */
    constructor();
    getModuleName(): string;
    /**
     * to get the operation type
     * @param operation
     */
    getGraphqlOperationType(operation: GraphQLOperation): OperationTypeNode;
    /**
     * Executes a GraphQL operation
     *
     * @param options - GraphQL Options
     * @param [additionalHeaders] - headers to merge in after any `libraryConfigHeaders` set in the config
     * @returns An Observable if queryType is 'subscription', else a promise of the graphql result from the query.
     */
    graphql<T>(options: GraphQLOptions, additionalHeaders?: CustomHeaders, customUserAgentDetails?: CustomUserAgentDetails): T extends GraphQLQuery<T> ? Promise<GraphQLResult<T>> : T extends GraphQLSubscription<T> ? Observable<{
        provider: AWSAppSyncRealTimeProvider;
        value: GraphQLResult<T>;
    }> : Promise<GraphQLResult<any>> | Observable<object>;
}
export declare const InternalAPI: InternalAPIClass;
