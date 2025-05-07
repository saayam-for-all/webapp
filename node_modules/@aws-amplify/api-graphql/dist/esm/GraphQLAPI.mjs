import { Category, ApiAction } from '@aws-amplify/core/internals/utils';
import { INTERNAL_USER_AGENT_OVERRIDE } from '@aws-amplify/data-schema/runtime';
import { InternalGraphQLAPIClass } from './internals/InternalGraphQLAPI.mjs';

function isGraphQLOptionsWithOverride(options) {
    return INTERNAL_USER_AGENT_OVERRIDE in options;
}
const graphqlOperation = (query, variables = {}, authToken) => ({
    query,
    variables,
    authToken,
});
/**
 * Export Cloud Logic APIs
 */
class GraphQLAPIClass extends InternalGraphQLAPIClass {
    getModuleName() {
        return 'GraphQLAPI';
    }
    /**
     * Executes a GraphQL operation
     *
     * @param options - GraphQL Options
     * @param [additionalHeaders] - headers to merge in after any `libraryConfigHeaders` set in the config
     * @returns An Observable if the query is a subscription query, else a promise of the graphql result.
     */
    graphql(amplify, options, additionalHeaders) {
        const userAgentDetails = {
            category: Category.API,
            action: ApiAction.GraphQl,
        };
        if (isGraphQLOptionsWithOverride(options)) {
            const { [INTERNAL_USER_AGENT_OVERRIDE]: internalUserAgentOverride, ...cleanOptions } = options;
            return super.graphql(amplify, cleanOptions, additionalHeaders, {
                ...userAgentDetails,
                ...internalUserAgentOverride,
            });
        }
        return super.graphql(amplify, options, additionalHeaders, {
            ...userAgentDetails,
        });
    }
    /**
     * Checks to see if an error thrown is from an api request cancellation
     * @param error - Any error
     * @returns A boolean indicating if the error was from an api request cancellation
     */
    isCancelError(error) {
        return super.isCancelError(error);
    }
    /**
     * Cancels an inflight request. Only applicable for graphql queries and mutations
     * @param {any} request - request to cancel
     * @returns A boolean indicating if the request was cancelled
     */
    cancel(request, message) {
        return super.cancel(request, message);
    }
}
const GraphQLAPI = new GraphQLAPIClass();

export { GraphQLAPI, GraphQLAPIClass, graphqlOperation };
//# sourceMappingURL=GraphQLAPI.mjs.map
