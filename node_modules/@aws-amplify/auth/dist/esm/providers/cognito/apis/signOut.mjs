import { ConsoleLogger, Amplify, clearCredentials, Hub, defaultStorage } from '@aws-amplify/core';
import { assertTokenProviderConfig, assertOAuthConfig, AMPLIFY_SYMBOL, AuthAction } from '@aws-amplify/core/internals/utils';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import '../utils/refreshAuthTokens.mjs';
import { AuthError } from '../../../errors/AuthError.mjs';
import '../tokenProvider/errorHelpers.mjs';
import { DefaultOAuthStore } from '../utils/signInWithRedirectStore.mjs';
import { tokenOrchestrator } from '../tokenProvider/tokenProvider.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { assertAuthTokensWithRefreshToken, assertAuthTokens } from '../utils/types.mjs';
import '@aws-crypto/sha256-js';
import { handleOAuthSignOut } from '../utils/oauth/handleOAuthSignOut.mjs';
import { OAUTH_SIGNOUT_EXCEPTION } from '../../../errors/constants.mjs';
import '../../../Errors.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../types/Auth.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import { createRevokeTokenClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createRevokeTokenClient.mjs';
import '../../../errors/types/validation.mjs';
import '../types/errors.mjs';
import { createGlobalSignOutClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createGlobalSignOutClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const logger = new ConsoleLogger('Auth');
/**
 * Signs a user out
 *
 * @param input - The SignOutInput object
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function signOut(input) {
    const cognitoConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(cognitoConfig);
    if (input?.global) {
        await globalSignOut(cognitoConfig);
    }
    else {
        await clientSignOut(cognitoConfig);
    }
    let hasOAuthConfig;
    try {
        assertOAuthConfig(cognitoConfig);
        hasOAuthConfig = true;
    }
    catch (err) {
        hasOAuthConfig = false;
    }
    if (hasOAuthConfig) {
        const oAuthStore = new DefaultOAuthStore(defaultStorage);
        oAuthStore.setAuthConfig(cognitoConfig);
        const { type } = (await handleOAuthSignOut(cognitoConfig, oAuthStore, tokenOrchestrator, input?.oauth?.redirectUrl)) ?? {};
        if (type === 'error') {
            throw new AuthError({
                name: OAUTH_SIGNOUT_EXCEPTION,
                message: `An error occurred when attempting to log out from OAuth provider.`,
            });
        }
    }
    else {
        // complete sign out
        tokenOrchestrator.clearTokens();
        await clearCredentials();
        Hub.dispatch('auth', { event: 'signedOut' }, 'Auth', AMPLIFY_SYMBOL);
    }
}
async function clientSignOut(cognitoConfig) {
    try {
        const { userPoolEndpoint, userPoolId, userPoolClientId } = cognitoConfig;
        const authTokens = await tokenOrchestrator.getTokenStore().loadTokens();
        assertAuthTokensWithRefreshToken(authTokens);
        if (isSessionRevocable(authTokens.accessToken)) {
            const revokeToken = createRevokeTokenClient({
                endpointResolver: createCognitoUserPoolEndpointResolver({
                    endpointOverride: userPoolEndpoint,
                }),
            });
            await revokeToken({
                region: getRegionFromUserPoolId(userPoolId),
                userAgentValue: getAuthUserAgentValue(AuthAction.SignOut),
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
        const authTokens = await tokenOrchestrator.getTokenStore().loadTokens();
        assertAuthTokens(authTokens);
        const globalSignOutClient = createGlobalSignOutClient({
            endpointResolver: createCognitoUserPoolEndpointResolver({
                endpointOverride: userPoolEndpoint,
            }),
        });
        await globalSignOutClient({
            region: getRegionFromUserPoolId(userPoolId),
            userAgentValue: getAuthUserAgentValue(AuthAction.SignOut),
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

export { signOut };
//# sourceMappingURL=signOut.mjs.map
