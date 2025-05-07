import { GraphQLApiError } from '../utils/errors/GraphQLApiError.mjs';
import '../utils/errors/validation.mjs';
import 'graphql';
import { NO_AUTH_TOKEN_HEADER, NO_SIGNED_IN_USER, NO_VALID_AUTH_TOKEN, NO_VALID_CREDENTIALS, NO_API_KEY } from '../utils/errors/constants.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
async function headerBasedAuth(amplify, authMode, apiKey, additionalHeaders = {}) {
    let headers = {};
    switch (authMode) {
        case 'apiKey':
            if (!apiKey) {
                throw new GraphQLApiError(NO_API_KEY);
            }
            headers = {
                'X-Api-Key': apiKey,
            };
            break;
        case 'iam': {
            const session = await amplify.Auth.fetchAuthSession();
            if (session.credentials === undefined) {
                throw new GraphQLApiError(NO_VALID_CREDENTIALS);
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
                throw new GraphQLApiError({
                    ...NO_SIGNED_IN_USER,
                    underlyingError: e,
                });
            }
            // `fetchAuthSession()` succeeded but didn't return `tokens`.
            // This may happen when unauthenticated access is enabled and there is
            // no user signed in.
            if (!token) {
                throw new GraphQLApiError(NO_VALID_AUTH_TOKEN);
            }
            headers = {
                Authorization: token,
            };
            break;
        }
        case 'lambda':
            if (typeof additionalHeaders === 'object' &&
                !additionalHeaders.Authorization) {
                throw new GraphQLApiError(NO_AUTH_TOKEN_HEADER);
            }
            headers = {
                Authorization: additionalHeaders.Authorization,
            };
            break;
    }
    return headers;
}

export { headerBasedAuth };
//# sourceMappingURL=graphqlAuth.mjs.map
