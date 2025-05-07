import { generateGraphQLDocument, buildGraphQLVariables, authModeParams, getCustomHeaders, flattenItems, initializeModel } from '../APIClient.mjs';
import { handleListGraphQlError } from './utils.mjs';
import { selfAwareAsync } from '../../utils/selfAwareAsync.mjs';
import { extendCancellability } from '../cancellation.mjs';
import { createUserAgentOverride } from '../ai/getCustomUserAgentDetails.mjs';

function listFactory(client, modelIntrospection, model, getInternals, context = false, customUserAgentDetails) {
    const listWithContext = (contextSpec, args) => {
        return _list(client, modelIntrospection, model, getInternals, args, contextSpec, customUserAgentDetails);
    };
    const list = (args) => {
        return _list(client, modelIntrospection, model, getInternals, args, undefined, customUserAgentDetails);
    };
    return context ? listWithContext : list;
}
function _list(client, modelIntrospection, model, getInternals, args, contextSpec, customUserAgentDetails) {
    return selfAwareAsync(async (resultPromise) => {
        const { name } = model;
        const query = generateGraphQLDocument(modelIntrospection, model, 'LIST', args);
        const variables = buildGraphQLVariables(model, 'LIST', args, modelIntrospection);
        const auth = authModeParams(client, getInternals, args);
        const headers = getCustomHeaders(client, getInternals, args?.headers);
        const userAgentOverride = createUserAgentOverride(customUserAgentDetails);
        try {
            const basePromise = contextSpec
                ? client.graphql(contextSpec, {
                    ...auth,
                    query,
                    variables,
                }, headers)
                : client.graphql({
                    ...auth,
                    query,
                    variables,
                    ...userAgentOverride,
                }, headers);
            const extendedPromise = extendCancellability(basePromise, resultPromise);
            const { data, extensions } = await extendedPromise;
            // flatten response
            if (data !== undefined) {
                const [key] = Object.keys(data);
                if (data[key].items) {
                    const flattenedResult = data[key].items.map((value) => flattenItems(modelIntrospection, name, value));
                    // don't init if custom selection set
                    if (args?.selectionSet) {
                        return {
                            data: flattenedResult,
                            nextToken: data[key].nextToken,
                            extensions,
                        };
                    }
                    else {
                        const initialized = initializeModel(client, name, flattenedResult, modelIntrospection, auth.authMode, auth.authToken, !!contextSpec);
                        return {
                            data: initialized,
                            nextToken: data[key].nextToken,
                            extensions,
                        };
                    }
                }
                return {
                    data: data[key],
                    nextToken: data[key].nextToken,
                    extensions,
                };
            }
        }
        catch (error) {
            /**
             * The `data` type returned by `error` here could be:
             * 1) `null`
             * 2) an empty object
             * 3) "populated" but with a `null` value `data: { listPosts: null }`
             * 4) actual records `data: { listPosts: items: [{ id: '1', ...etc }] }`
             */
            const { data, errors } = error;
            // `data` is not `null`, and is not an empty object:
            if (data !== undefined &&
                data !== null &&
                Object.keys(data).length !== 0 &&
                errors) {
                const [key] = Object.keys(data);
                if (data[key]?.items) {
                    const flattenedResult = data[key].items.map((value) => flattenItems(modelIntrospection, name, value));
                    /**
                     * Check exists since `flattenedResult` could be `null`.
                     * if `flattenedResult` exists, result is an actual record.
                     */
                    if (flattenedResult) {
                        // don't init if custom selection set
                        if (args?.selectionSet) {
                            return {
                                data: flattenedResult,
                                nextToken: data[key]?.nextToken,
                                errors,
                            };
                        }
                        else {
                            const initialized = initializeModel(client, name, flattenedResult, modelIntrospection, auth.authMode, auth.authToken, !!contextSpec);
                            // data is full record w/out selection set:
                            return {
                                data: initialized,
                                nextToken: data[key]?.nextToken,
                                errors,
                            };
                        }
                    }
                    return {
                        data: data[key],
                        nextToken: data[key]?.nextToken,
                        errors,
                    };
                }
                else {
                    // response is of type `data: { getPost: null }`)
                    return handleListGraphQlError(error);
                }
            }
            else {
                // `data` is `null` or an empty object:
                return handleListGraphQlError(error);
            }
        }
    });
}

export { listFactory };
//# sourceMappingURL=list.mjs.map
