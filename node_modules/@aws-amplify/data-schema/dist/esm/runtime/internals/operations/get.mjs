import { generateGraphQLDocument, buildGraphQLVariables, authModeParams, getCustomHeaders, flattenItems, initializeModel } from '../APIClient.mjs';
import { handleSingularGraphQlError } from './utils.mjs';
import { selfAwareAsync } from '../../utils/selfAwareAsync.mjs';
import { extendCancellability } from '../cancellation.mjs';
import { createUserAgentOverride } from '../ai/getCustomUserAgentDetails.mjs';

function getFactory(client, modelIntrospection, model, operation, getInternals, useContext = false, customUserAgentDetails) {
    const getWithContext = (contextSpec, arg, options) => {
        return _get(client, modelIntrospection, model, arg, options, operation, getInternals, contextSpec, customUserAgentDetails);
    };
    const get = (arg, options) => {
        return _get(client, modelIntrospection, model, arg, options, operation, getInternals, undefined, customUserAgentDetails);
    };
    return useContext ? getWithContext : get;
}
function _get(client, modelIntrospection, model, arg, options, operation, getInternals, context, customUserAgentDetails) {
    return selfAwareAsync(async (resultPromise) => {
        const { name } = model;
        const query = generateGraphQLDocument(modelIntrospection, model, operation, options);
        const variables = buildGraphQLVariables(model, operation, arg, modelIntrospection);
        const auth = authModeParams(client, getInternals, options);
        const headers = getCustomHeaders(client, getInternals, options?.headers);
        const userAgentOverride = createUserAgentOverride(customUserAgentDetails);
        try {
            const basePromise = context
                ? client.graphql(context, {
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
            if (data) {
                const [key] = Object.keys(data);
                const flattenedResult = flattenItems(modelIntrospection, name, data[key]);
                if (flattenedResult === null) {
                    return { data: null, extensions };
                }
                else if (options?.selectionSet) {
                    return { data: flattenedResult, extensions };
                }
                else {
                    // TODO: refactor to avoid destructuring here
                    const [initialized] = initializeModel(client, name, [flattenedResult], modelIntrospection, auth.authMode, auth.authToken, !!context);
                    return { data: initialized, extensions };
                }
            }
            else {
                return { data: null, extensions };
            }
        }
        catch (error) {
            /**
             * The `data` type returned by `error` here could be:
             * 1) `null`
             * 2) an empty object
             * 3) "populated" but with a `null` value `{ getPost: null }`
             * 4) an actual record `{ getPost: { id: '1', title: 'Hello, World!' } }`
             */
            const { data, errors } = error;
            /**
             * `data` is not `null`, and is not an empty object:
             */
            if (data && Object.keys(data).length !== 0 && errors) {
                const [key] = Object.keys(data);
                const flattenedResult = flattenItems(modelIntrospection, name, data[key]);
                /**
                 * `flattenedResult` could be `null` here (e.g. `data: { getPost: null }`)
                 * if `flattenedResult`, result is an actual record:
                 */
                if (flattenedResult) {
                    if (options?.selectionSet) {
                        return { data: flattenedResult, errors };
                    }
                    else {
                        // TODO: refactor to avoid destructuring here
                        const [initialized] = initializeModel(client, name, [flattenedResult], modelIntrospection, auth.authMode, auth.authToken, !!context);
                        return { data: initialized, errors };
                    }
                }
                else {
                    // was `data: { getPost: null }`)
                    return handleSingularGraphQlError(error);
                }
            }
            else {
                // `data` is `null`:
                return handleSingularGraphQlError(error);
            }
        }
    });
}

export { getFactory };
//# sourceMappingURL=get.mjs.map
