import { GraphQLAPI } from '../GraphQLAPI.mjs';
import { getInternals } from '../types/index.mjs';

/**
 * Invokes graphql operations against a graphql service, providing correct input and
 * output types if Amplify-generated graphql from a recent version of the CLI/codegen
 * are used *or* correct typing is provided via the type argument.
 *
 * Amplify-generated "branded" graphql queries will look similar to this:
 *
 * ```ts
 *                               //
 *                               // |-- branding
 *                               // v
 * export const getModel = `...` as GeneratedQuery<
 * 	GetModelQueryVariables,
 * 	GetModelQuery
 * >;
 * ```
 *
 * If this branding is not in your generated graphql, update to a newer version of
 * CLI/codegen and regenerate your graphql using `amplify codegen`.
 *
 * ## Using Amplify-generated graphql
 *
 * ```ts
 * import * as queries from './graphql/queries';
 *
 * //
 * //    |-- correctly typed graphql response containing a Widget
 * //    v
 * const queryResult = await graphql({
 * 	query: queries.getWidget,
 * 	variables: {
 * 		id: "abc", // <-- type hinted/enforced
 * 	},
 * });
 *
 * //
 * //    |-- a correctly typed Widget
 * //    v
 * const fetchedWidget = queryResult.data?.getWidget!;
 * ```
 *
 * ## Custom input + result types
 *
 * To provide input types (`variables`) and result types:
 *
 * ```ts
 * type GetById_NameOnly = {
 * 	variables: {
 * 		id: string
 * 	},
 * 	result: Promise<{
 * 		data: { getWidget: { name: string } }
 * 	}>
 * }
 *
 * //
 * //    |-- type is GetById_NameOnly["result"]
 * //    v
 * const result = graphql<GetById_NameOnly>({
 * 	query: "...",
 * 	variables: { id: "abc" }  // <-- type of GetById_NameOnly["variables"]
 * });
 * ```
 *
 * ## Custom result type only
 *
 * To specify result types only, use a type that is *not* in the `{variables, result}` shape:
 *
 * ```ts
 * type MyResultType = Promise<{
 * 	data: {
 * 		getWidget: { name: string }
 * 	}
 * }>
 *
 * //
 * //    |-- type is MyResultType
 * //    v
 * const result = graphql<MyResultType>({query: "..."});
 * ```
 *
 * @param options
 * @param additionalHeaders
 */
function graphql(options, additionalHeaders) {
    // inject client-level auth
    const internals = getInternals(this);
    /**
     * The custom `endpoint` specific to the client
     */
    const clientEndpoint = internals.endpoint;
    /**
     * The `authMode` specific to the client.
     */
    const clientAuthMode = internals.authMode;
    /**
     * The `apiKey` specific to the client.
     */
    const clientApiKey = internals.apiKey;
    /**
     * The most specific `authMode` wins. Setting an `endpoint` value without also
     * setting an `authMode` value is invalid. This helps to prevent customers apps
     * from unexpectedly sending auth details to endpoints the auth details do not
     * belong to.
     *
     * This is especially pronounced for `apiKey`. When both an `endpoint` *and*
     * `authMode: 'apiKey'` are provided, an explicit `apiKey` override is required
     * to prevent inadvertent sending of an API's `apiKey` to an endpoint is does
     * not belong to.
     */
    options.authMode = options.authMode || clientAuthMode;
    options.apiKey = options.apiKey ?? clientApiKey;
    options.authToken = options.authToken || internals.authToken;
    if (clientEndpoint && options.authMode === 'apiKey' && !options.apiKey) {
        throw new Error("graphql() requires an explicit `apiKey` for a custom `endpoint` when `authMode = 'apiKey'`.");
    }
    const headers = additionalHeaders || internals.headers;
    /**
     * The correctness of these typings depends on correct string branding or overrides.
     * Neither of these can actually be validated at runtime. Hence, we don't perform
     * any validation or type-guarding here.
     */
    const result = GraphQLAPI.graphql(
    // TODO: move V6Client back into this package?
    internals.amplify, {
        ...options,
        endpoint: clientEndpoint,
    }, headers);
    return result;
}
/**
 * Cancels an inflight request. Only applicable for graphql queries and mutations
 * @param {any} request - request to cancel
 * @returns - A boolean indicating if the request was cancelled
 */
function cancel(promise, message) {
    return GraphQLAPI.cancel(promise, message);
}
/**
 * Checks to see if an error thrown is from an api request cancellation
 * @param {any} error - Any error
 * @returns - A boolean indicating if the error was from an api request cancellation
 */
function isCancelError(error) {
    return GraphQLAPI.isCancelError(error);
}

export { cancel, graphql, isCancelError };
//# sourceMappingURL=v6.mjs.map
