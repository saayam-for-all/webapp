'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWebAuthnCredentials = void 0;
const core_1 = require("@aws-amplify/core");
const apis_1 = require("../../foundation/apis");
/**
 * Lists registered credentials for an authenticated user
 *
 * @param {ListWebAuthnCredentialsInput} input The list input parameters including page size and next token.
 * @returns Promise<ListWebAuthnCredentialsOutput>
 * @throws - {@link AuthError}:
 * - Thrown when user is unauthenticated
 * @throws - {@link ListWebAuthnCredentialsException}
 * - Thrown due to a service error when listing WebAuthn credentials
 */
async function listWebAuthnCredentials(input) {
    return (0, apis_1.listWebAuthnCredentials)(core_1.Amplify, input);
}
exports.listWebAuthnCredentials = listWebAuthnCredentials;
//# sourceMappingURL=listWebAuthnCredentials.js.map
