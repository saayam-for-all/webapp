'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.repackageUnauthorizedError = void 0;
/**
 * Checks to see if the given response or subscription message contains an
 * Unauthorized error. If it does, it changes the error message to include instructions
 * for the app developer.
 */
function repackageUnauthorizedError(content) {
    if (content.errors && Array.isArray(content.errors)) {
        content.errors.forEach(e => {
            if (isUnauthorizedError(e)) {
                e.message = 'Unauthorized';
                e.recoverySuggestion =
                    `If you're calling an Amplify-generated API, make sure ` +
                        `to set the "authMode" in generateClient({ authMode: '...' }) to the backend authorization ` +
                        `rule's auth provider ('apiKey', 'userPool', 'iam', 'oidc', 'lambda')`;
            }
        });
    }
    return content;
}
exports.repackageUnauthorizedError = repackageUnauthorizedError;
function isUnauthorizedError(error) {
    // Error pattern corresponding to appsync calls
    if (error?.originalError?.name?.startsWith('UnauthorizedException')) {
        return true;
    }
    // Error pattern corresponding to appsync subscriptions
    if (error.message?.startsWith('Connection failed:') &&
        error.message?.includes('Permission denied')) {
        return true;
    }
    return false;
}
//# sourceMappingURL=repackageAuthError.js.map
