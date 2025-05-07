'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWebAuthnCredential = void 0;
const core_1 = require("@aws-amplify/core");
const apis_1 = require("../../foundation/apis");
/**
 * Delete a registered credential for an authenticated user by credentialId
 * @param {DeleteWebAuthnCredentialInput} input The delete input parameters including the credentialId
 * @returns Promise<void>
 * @throws - {@link AuthError}:
 * - Thrown when user is unauthenticated
 * @throws - {@link DeleteWebAuthnCredentialException}
 * - Thrown due to a service error when deleting a WebAuthn credential
 */
async function deleteWebAuthnCredential(input) {
    return (0, apis_1.deleteWebAuthnCredential)(core_1.Amplify, input);
}
exports.deleteWebAuthnCredential = deleteWebAuthnCredential;
//# sourceMappingURL=deleteWebAuthnCredential.js.map
