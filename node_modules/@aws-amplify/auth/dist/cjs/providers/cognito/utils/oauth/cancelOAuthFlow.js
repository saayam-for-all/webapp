'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenForOAuthFlowCancellation = void 0;
const createOAuthError_1 = require("./createOAuthError");
const handleFailure_1 = require("./handleFailure");
const listenForOAuthFlowCancellation = (store) => {
    async function handleCancelOAuthFlow(event) {
        const isBfcache = event.persisted;
        if (isBfcache && (await store.loadOAuthInFlight())) {
            const error = (0, createOAuthError_1.createOAuthError)('User cancelled OAuth flow.');
            await (0, handleFailure_1.handleFailure)(error);
        }
        window.removeEventListener('pageshow', handleCancelOAuthFlow);
    }
    window.addEventListener('pageshow', handleCancelOAuthFlow);
};
exports.listenForOAuthFlowCancellation = listenForOAuthFlowCancellation;
//# sourceMappingURL=cancelOAuthFlow.js.map
