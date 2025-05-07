'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalGraphQLAPI = exports.InternalGraphQLAPIClass = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const graphql_1 = require("graphql");
const rxjs_1 = require("rxjs");
const utils_1 = require("@aws-amplify/core/internals/utils");
const api_rest_1 = require("@aws-amplify/api-rest");
const internals_1 = require("@aws-amplify/api-rest/internals");
const AWSAppSyncRealTimeProvider_1 = require("../Providers/AWSAppSyncRealTimeProvider");
const utils_2 = require("../utils");
const repackageAuthError_1 = require("../utils/errors/repackageAuthError");
const constants_1 = require("../utils/errors/constants");
const errors_1 = require("../utils/errors");
const isGraphQLResponseWithErrors_1 = require("./utils/runtimeTypeGuards/isGraphQLResponseWithErrors");
const graphqlAuth_1 = require("./graphqlAuth");
const USER_AGENT_HEADER = 'x-amz-user-agent';
const isAmplifyInstance = (amplify) => {
    return typeof amplify !== 'function';
};
/**
 * Export Cloud Logic APIs
 */
class InternalGraphQLAPIClass {
    constructor() {
        /**
         * @private
         */
        this.appSyncRealTime = new Map();
        this._api = {
            post: internals_1.post,
            cancelREST: internals_1.cancel,
            isCancelErrorREST: api_rest_1.isCancelError,
            updateRequestToBeCancellable: internals_1.updateRequestToBeCancellable,
        };
    }
    getModuleName() {
        return 'InternalGraphQLAPI';
    }
    /**
     * to get the operation type
     * @param operation
     */
    getGraphqlOperationType(operation) {
        const doc = (0, graphql_1.parse)(operation);
        const definitions = doc.definitions;
        const [{ operation: operationType }] = definitions;
        return operationType;
    }
    /**
     * Executes a GraphQL operation
     *
     * @param options - GraphQL Options
     * @param [additionalHeaders] - headers to merge in after any `libraryConfigHeaders` set in the config
     * @returns An Observable if the query is a subscription query, else a promise of the graphql result.
     */
    graphql(amplify, { query: paramQuery, variables = {}, authMode, authToken, endpoint, apiKey, }, additionalHeaders, customUserAgentDetails) {
        const query = typeof paramQuery === 'string'
            ? (0, graphql_1.parse)(paramQuery)
            : (0, graphql_1.parse)((0, graphql_1.print)(paramQuery));
        const [operationDef = {}] = query.definitions.filter(def => def.kind === 'OperationDefinition');
        const { operation: operationType } = operationDef;
        const headers = additionalHeaders || {};
        switch (operationType) {
            case 'query':
            case 'mutation': {
                const abortController = new AbortController();
                let responsePromise;
                if (isAmplifyInstance(amplify)) {
                    responsePromise = this._graphql(amplify, { query, variables, authMode, apiKey, endpoint }, headers, abortController, customUserAgentDetails, authToken);
                }
                else {
                    // NOTE: this wrapper function must be await-able so the Amplify server context manager can
                    // destroy the context only after it completes
                    const wrapper = async (amplifyInstance) => {
                        const result = await this._graphql(amplifyInstance, { query, variables, authMode, apiKey, endpoint }, headers, abortController, customUserAgentDetails, authToken);
                        return result;
                    };
                    responsePromise = amplify(wrapper);
                }
                this._api.updateRequestToBeCancellable(responsePromise, abortController);
                return responsePromise;
            }
            case 'subscription':
                return this._graphqlSubscribe(amplify, { query, variables, authMode, apiKey, endpoint }, headers, customUserAgentDetails, authToken);
            default:
                throw new Error(`invalid operation type: ${operationType}`);
        }
    }
    async _graphql(amplify, { query, variables, authMode: authModeOverride, endpoint: endpointOverride, apiKey: apiKeyOverride, }, additionalHeaders = {}, abortController, customUserAgentDetails, authToken) {
        const { apiKey, region, endpoint: appSyncGraphqlEndpoint, customEndpoint, customEndpointRegion, defaultAuthMode, } = (0, utils_2.resolveConfig)(amplify);
        const initialAuthMode = authModeOverride || defaultAuthMode || 'iam';
        // identityPool is an alias for iam. TODO: remove 'iam' in v7
        const authMode = initialAuthMode === 'identityPool' ? 'iam' : initialAuthMode;
        /**
         * Retrieve library options from Amplify configuration.
         * `customHeaders` here are from the Amplify configuration options,
         * and are for non-AppSync endpoints only. These are *not* the same as
         * `additionalHeaders`, which are custom headers that are either 1)
         * included when configuring the API client or 2) passed along with
         * individual requests.
         */
        const { headers: customHeaders, withCredentials } = (0, utils_2.resolveLibraryOptions)(amplify);
        /**
         * Client or request-specific custom headers that may or may not be
         * returned by a function:
         */
        let additionalCustomHeaders;
        if (typeof additionalHeaders === 'function') {
            const requestOptions = {
                method: 'POST',
                url: new utils_1.AmplifyUrl(endpointOverride || customEndpoint || appSyncGraphqlEndpoint || '').toString(),
                queryString: (0, graphql_1.print)(query),
            };
            additionalCustomHeaders = await additionalHeaders(requestOptions);
        }
        else {
            additionalCustomHeaders = additionalHeaders;
        }
        // if an authorization header is set, have the explicit authToken take precedence
        if (authToken) {
            additionalCustomHeaders = {
                ...additionalCustomHeaders,
                Authorization: authToken,
            };
        }
        const authHeaders = await (0, graphqlAuth_1.headerBasedAuth)(amplify, authMode, apiKeyOverride ?? apiKey, additionalCustomHeaders);
        const headers = {
            ...(!customEndpoint && authHeaders),
            /**
             * Custom endpoint headers.
             * If there is both a custom endpoint and custom region present, we get the headers.
             * If there is a custom endpoint but no region, we return an empty object.
             * If neither are present, we return an empty object.
             */
            ...((customEndpoint && (customEndpointRegion ? authHeaders : {})) || {}),
            // Custom headers included in Amplify configuration options:
            ...(customHeaders &&
                (await customHeaders({
                    query: (0, graphql_1.print)(query),
                    variables,
                }))),
            // Custom headers from individual requests or API client configuration:
            ...additionalCustomHeaders,
            // User agent headers:
            ...(!customEndpoint && {
                [USER_AGENT_HEADER]: (0, utils_1.getAmplifyUserAgent)(customUserAgentDetails),
            }),
        };
        const body = {
            query: (0, graphql_1.print)(query),
            variables: variables || null,
        };
        let signingServiceInfo;
        /**
         * We do not send the signing service info to the REST API under the
         * following conditions (i.e. it will not sign the request):
         *   - there is a custom endpoint but no region
         *   - the auth mode is `none`, or `apiKey`
         *   - the auth mode is a type other than the types listed below
         */
        if ((customEndpoint && !customEndpointRegion) ||
            (authMode !== 'oidc' &&
                authMode !== 'userPool' &&
                authMode !== 'iam' &&
                authMode !== 'lambda')) {
            signingServiceInfo = undefined;
        }
        else {
            signingServiceInfo = {
                service: !customEndpointRegion ? 'appsync' : 'execute-api',
                region: !customEndpointRegion ? region : customEndpointRegion,
            };
        }
        const endpoint = endpointOverride || customEndpoint || appSyncGraphqlEndpoint;
        if (!endpoint) {
            throw (0, errors_1.createGraphQLResultWithError)(new errors_1.GraphQLApiError(constants_1.NO_ENDPOINT));
        }
        let response;
        try {
            // 	// // See the inline doc of the REST `post()` API for possible errors to be thrown.
            // 	// // As these errors are catastrophic they should be caught and handled by GraphQL
            // 	// // API consumers.
            const { body: responseBody } = await this._api.post(amplify, {
                url: new utils_1.AmplifyUrl(endpoint),
                options: {
                    headers,
                    body,
                    signingServiceInfo,
                    withCredentials,
                },
                abortController,
            });
            response = await responseBody.json();
        }
        catch (error) {
            if (this.isCancelError(error)) {
                throw error;
            }
            response = (0, errors_1.createGraphQLResultWithError)(error);
        }
        if ((0, isGraphQLResponseWithErrors_1.isGraphQLResponseWithErrors)(response)) {
            throw (0, repackageAuthError_1.repackageUnauthorizedError)(response);
        }
        return response;
    }
    /**
     * Checks to see if an error thrown is from an api request cancellation
     * @param {any} error - Any error
     * @return {boolean} - A boolean indicating if the error was from an api request cancellation
     */
    isCancelError(error) {
        return this._api.isCancelErrorREST(error);
    }
    /**
     * Cancels an inflight request. Only applicable for graphql queries and mutations
     * @param {any} request - request to cancel
     * @returns - A boolean indicating if the request was cancelled
     */
    cancel(request, message) {
        return this._api.cancelREST(request, message);
    }
    _graphqlSubscribe(amplify, { query, variables, authMode: authModeOverride, apiKey: apiKeyOverride, endpoint, }, additionalHeaders = {}, customUserAgentDetails, authToken) {
        const config = (0, utils_2.resolveConfig)(amplify);
        const initialAuthMode = authModeOverride || config?.defaultAuthMode || 'iam';
        // identityPool is an alias for iam. TODO: remove 'iam' in v7
        const authMode = initialAuthMode === 'identityPool' ? 'iam' : initialAuthMode;
        /**
         * Retrieve library options from Amplify configuration.
         * `libraryConfigHeaders` are from the Amplify configuration options,
         * and will not be overwritten by other custom headers. These are *not*
         * the same as `additionalHeaders`, which are custom headers that are
         * either 1)included when configuring the API client or 2) passed along
         * with individual requests.
         */
        const { headers: libraryConfigHeaders } = (0, utils_2.resolveLibraryOptions)(amplify);
        const appSyncGraphqlEndpoint = endpoint ?? config?.endpoint;
        // TODO: This could probably be an exception. But, lots of tests rely on
        // attempting to connect to nowhere. So, I'm treating as the opposite of
        // a Chesterton's fence for now. (A fence I shouldn't build, because I don't
        // know why somethings depends on its absence!)
        const memoKey = appSyncGraphqlEndpoint ?? 'none';
        const realtimeProvider = this.appSyncRealTime.get(memoKey) ?? new AWSAppSyncRealTimeProvider_1.AWSAppSyncRealTimeProvider();
        this.appSyncRealTime.set(memoKey, realtimeProvider);
        return realtimeProvider
            .subscribe({
            query: (0, graphql_1.print)(query),
            variables,
            appSyncGraphqlEndpoint,
            region: config?.region,
            authenticationType: authMode,
            apiKey: apiKeyOverride ?? config?.apiKey,
            additionalHeaders,
            authToken,
            libraryConfigHeaders,
        }, customUserAgentDetails)
            .pipe((0, rxjs_1.catchError)(e => {
            if (e.errors) {
                throw (0, repackageAuthError_1.repackageUnauthorizedError)(e);
            }
            throw e;
        }));
    }
}
exports.InternalGraphQLAPIClass = InternalGraphQLAPIClass;
exports.InternalGraphQLAPI = new InternalGraphQLAPIClass();
//# sourceMappingURL=InternalGraphQLAPI.js.map
