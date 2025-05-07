'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const utils_2 = require("../../../utils");
const tokenProvider_1 = require("../tokenProvider");
const parsers_1 = require("../../../foundation/parsers");
const types_1 = require("../utils/types");
const oauth_1 = require("../utils/oauth");
const signInWithRedirectStore_1 = require("../utils/signInWithRedirectStore");
const AuthError_1 = require("../../../errors/AuthError");
const constants_1 = require("../../../errors/constants");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
const logger = new core_1.ConsoleLogger('Auth');
/**
 * Signs a user out
 *
 * @param input - The SignOutInput object
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function signOut(input) {
    const cognitoConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(cognitoConfig);
    if (input?.global) {
        await globalSignOut(cognitoConfig);
    }
    else {
        await clientSignOut(cognitoConfig);
    }
    let hasOAuthConfig;
    try {
        (0, utils_1.assertOAuthConfig)(cognitoConfig);
        hasOAuthConfig = true;
    }
    catch (err) {
        hasOAuthConfig = false;
    }
    if (hasOAuthConfig) {
        const oAuthStore = new signInWithRedirectStore_1.DefaultOAuthStore(core_1.defaultStorage);
        oAuthStore.setAuthConfig(cognitoConfig);
        const { type } = (await (0, oauth_1.handleOAuthSignOut)(cognitoConfig, oAuthStore, tokenProvider_1.tokenOrchestrator, input?.oauth?.redirectUrl)) ?? {};
        if (type === 'error') {
            throw new AuthError_1.AuthError({
                name: constants_1.OAUTH_SIGNOUT_EXCEPTION,
                message: `An error occurred when attempting to log out from OAuth provider.`,
            });
        }
    }
    else {
        // complete sign out
        tokenProvider_1.tokenOrchestrator.clearTokens();
        await (0, core_1.clearCredentials)();
        core_1.Hub.dispatch('auth', { event: 'signedOut' }, 'Auth', utils_1.AMPLIFY_SYMBOL);
    }
}
exports.signOut = signOut;
async function clientSignOut(cognitoConfig) {
    try {
        const { userPoolEndpoint, userPoolId, userPoolClientId } = cognitoConfig;
        const authTokens = await tokenProvider_1.tokenOrchestrator.getTokenStore().loadTokens();
        (0, types_1.assertAuthTokensWithRefreshToken)(authTokens);
        if (isSessionRevocable(authTokens.accessToken)) {
            const revokeToken = (0, cognitoIdentityProvider_1.createRevokeTokenClient)({
                endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
                    endpointOverride: userPoolEndpoint,
                }),
            });
            await revokeToken({
                region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
                userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.SignOut),
            }, {
                ClientId: userPoolClientId,
                Token: authTokens.refreshToken,
            });
        }
    }
    catch (err) {
        // this shouldn't throw
        logger.debug('Client signOut error caught but will proceed with token removal');
    }
}
async function globalSignOut(cognitoConfig) {
    try {
        const { userPoolEndpoint, userPoolId } = cognitoConfig;
        const authTokens = await tokenProvider_1.tokenOrchestrator.getTokenStore().loadTokens();
        (0, types_1.assertAuthTokens)(authTokens);
        const globalSignOutClient = (0, cognitoIdentityProvider_1.createGlobalSignOutClient)({
            endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
                endpointOverride: userPoolEndpoint,
            }),
        });
        await globalSignOutClient({
            region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
            userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.SignOut),
        }, {
            AccessToken: authTokens.accessToken.toString(),
        });
    }
    catch (err) {
        // it should not throw
        logger.debug('Global signOut error caught but will proceed with token removal');
    }
}
const isSessionRevocable = (token) => !!token?.payload?.origin_jti;
//# sourceMappingURL=signOut.js.map
