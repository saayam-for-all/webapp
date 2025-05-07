'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerBasedAuth = void 0;
const errors_1 = require("../utils/errors");
const constants_1 = require("../utils/errors/constants");
async function headerBasedAuth(amplify, authMode, apiKey, additionalHeaders = {}) {
    let headers = {};
    switch (authMode) {
        case 'apiKey':
            if (!apiKey) {
                throw new errors_1.GraphQLApiError(constants_1.NO_API_KEY);
            }
            headers = {
                'X-Api-Key': apiKey,
            };
            break;
        case 'iam': {
            const session = await amplify.Auth.fetchAuthSession();
            if (session.credentials === undefined) {
                throw new errors_1.GraphQLApiError(constants_1.NO_VALID_CREDENTIALS);
            }
            break;
        }
        case 'oidc':
        case 'userPool': {
            let token;
            try {
                token = (await amplify.Auth.fetchAuthSession()).tokens?.accessToken.toString();
            }
            catch (e) {
                // fetchAuthSession failed
                throw new errors_1.GraphQLApiError({
                    ...constants_1.NO_SIGNED_IN_USER,
                    underlyingError: e,
                });
            }
            // `fetchAuthSession()` succeeded but didn't return `tokens`.
            // This may happen when unauthenticated access is enabled and there is
            // no user signed in.
            if (!token) {
                throw new errors_1.GraphQLApiError(constants_1.NO_VALID_AUTH_TOKEN);
            }
            headers = {
                Authorization: token,
            };
            break;
        }
        case 'lambda':
            if (typeof additionalHeaders === 'object' &&
                !additionalHeaders.Authorization) {
                throw new errors_1.GraphQLApiError(constants_1.NO_AUTH_TOKEN_HEADER);
            }
            headers = {
                Authorization: additionalHeaders.Authorization,
            };
            break;
    }
    return headers;
}
exports.headerBasedAuth = headerBasedAuth;
//# sourceMappingURL=graphqlAuth.js.map
