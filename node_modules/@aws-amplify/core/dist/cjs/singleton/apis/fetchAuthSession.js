'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAuthSession = void 0;
const Amplify_1 = require("../Amplify");
const fetchAuthSession_1 = require("./internal/fetchAuthSession");
/**
 * Fetch the auth session including the tokens and credentials if they are available. By default it
 * does not refresh the auth tokens or credentials if they are loaded in storage already. You can force a refresh
 * with `{ forceRefresh: true }` input.
 *
 * @param options - Options configuring the fetch behavior.
 * @throws {@link AuthError} - Throws error when session information cannot be refreshed.
 * @returns Promise<AuthSession>
 */
const fetchAuthSession = (options) => {
    return (0, fetchAuthSession_1.fetchAuthSession)(Amplify_1.Amplify, options);
};
exports.fetchAuthSession = fetchAuthSession;
//# sourceMappingURL=fetchAuthSession.js.map
