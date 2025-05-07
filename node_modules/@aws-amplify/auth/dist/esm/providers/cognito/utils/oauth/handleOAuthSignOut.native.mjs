import { completeOAuthSignOut } from './completeOAuthSignOut.mjs';
import { oAuthSignOutRedirect } from './oAuthSignOutRedirect.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const handleOAuthSignOut = async (cognitoConfig, store, 
// No-op here as it's only used in the non-native implementation
tokenOrchestrator, redirectUrl) => {
    const { isOAuthSignIn, preferPrivateSession } = await store.loadOAuthSignIn();
    if (isOAuthSignIn) {
        const result = await oAuthSignOutRedirect(cognitoConfig, preferPrivateSession, redirectUrl);
        // If this was a private session, clear data and tokens regardless of what happened with logout
        // endpoint. Otherwise, only do so if the logout endpoint was succesfully visited.
        const shouldCompleteSignOut = preferPrivateSession || result?.type === 'success';
        if (shouldCompleteSignOut) {
            await completeOAuthSignOut(store);
        }
        return result;
    }
    return completeOAuthSignOut(store);
};

export { handleOAuthSignOut };
//# sourceMappingURL=handleOAuthSignOut.native.mjs.map
