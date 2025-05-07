'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLAPI = exports.GraphQLAPIClass = exports.graphqlOperation = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const runtime_1 = require("@aws-amplify/data-schema/runtime");
const InternalGraphQLAPI_1 = require("./internals/InternalGraphQLAPI");
function isGraphQLOptionsWithOverride(options) {
    return runtime_1.INTERNAL_USER_AGENT_OVERRIDE in options;
}
const graphqlOperation = (query, variables = {}, authToken) => ({
    query,
    variables,
    authToken,
});
exports.graphqlOperation = graphqlOperation;
/**
 * Export Cloud Logic APIs
 */
class GraphQLAPIClass extends InternalGraphQLAPI_1.InternalGraphQLAPIClass {
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
            category: utils_1.Category.API,
            action: utils_1.ApiAction.GraphQl,
        };
        if (isGraphQLOptionsWithOverride(options)) {
            const { [runtime_1.INTERNAL_USER_AGENT_OVERRIDE]: internalUserAgentOverride, ...cleanOptions } = options;
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
exports.GraphQLAPIClass = GraphQLAPIClass;
exports.GraphQLAPI = new GraphQLAPIClass();
//# sourceMappingURL=GraphQLAPI.js.map
