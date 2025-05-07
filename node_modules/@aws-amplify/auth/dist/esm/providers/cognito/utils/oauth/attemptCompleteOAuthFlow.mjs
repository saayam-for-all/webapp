import { assertTokenProviderConfig, assertOAuthConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { getAuthUserAgentValue } from '../../../../utils/getAuthUserAgentValue.mjs';
import { oAuthStore } from './oAuthStore.mjs';
import { completeOAuthFlow } from './completeOAuthFlow.mjs';
import { getRedirectUrl } from './getRedirectUrl.mjs';
import { handleFailure } from './handleFailure.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const attemptCompleteOAuthFlow = async (authConfig) => {
    try {
        assertTokenProviderConfig(authConfig);
        assertOAuthConfig(authConfig);
        oAuthStore.setAuthConfig(authConfig);
    }
    catch (_) {
        // no-op
        // This should not happen as Amplify singleton checks the oauth config key
        // unless the oauth config object doesn't contain required properties
        return;
    }
    // No inflight OAuth
    if (!(await oAuthStore.loadOAuthInFlight())) {
        return;
    }
    try {
        const currentUrl = window.location.href;
        const { loginWith, userPoolClientId } = authConfig;
        const { domain, redirectSignIn, responseType } = loginWith.oauth;
        const redirectUri = getRedirectUrl(redirectSignIn);
        await completeOAuthFlow({
            currentUrl,
            clientId: userPoolClientId,
            domain,
            redirectUri,
            responseType,
            userAgentValue: getAuthUserAgentValue(AuthAction.SignInWithRedirect),
        });
    }
    catch (err) {
        await handleFailure(err);
    }
};

export { attemptCompleteOAuthFlow };
//# sourceMappingURL=attemptCompleteOAuthFlow.mjs.map
