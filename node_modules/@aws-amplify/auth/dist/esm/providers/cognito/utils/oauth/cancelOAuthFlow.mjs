import { createOAuthError } from './createOAuthError.mjs';
import { handleFailure } from './handleFailure.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const listenForOAuthFlowCancellation = (store) => {
    async function handleCancelOAuthFlow(event) {
        const isBfcache = event.persisted;
        if (isBfcache && (await store.loadOAuthInFlight())) {
            const error = createOAuthError('User cancelled OAuth flow.');
            await handleFailure(error);
        }
        window.removeEventListener('pageshow', handleCancelOAuthFlow);
    }
    window.addEventListener('pageshow', handleCancelOAuthFlow);
};

export { listenForOAuthFlowCancellation };
//# sourceMappingURL=cancelOAuthFlow.mjs.map
