'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertCredentialIsPkcWithAuthenticatorAssertionResponse = exports.assertCredentialIsPkcWithAuthenticatorAttestationResponse = exports.assertValidCredentialCreationOptions = void 0;
const errors_1 = require("../errors");
/**
 * Passkey Create Types
 */
var shared_1 = require("./shared");
Object.defineProperty(exports, "assertValidCredentialCreationOptions", { enumerable: true, get: function () { return shared_1.assertValidCredentialCreationOptions; } });
function assertCredentialIsPkcWithAuthenticatorAttestationResponse(credential) {
    (0, errors_1.assertPasskeyError)(credential &&
        credential instanceof PublicKeyCredential &&
        credential.response instanceof AuthenticatorAttestationResponse, errors_1.PasskeyErrorCode.PasskeyRegistrationFailed);
}
exports.assertCredentialIsPkcWithAuthenticatorAttestationResponse = assertCredentialIsPkcWithAuthenticatorAttestationResponse;
function assertCredentialIsPkcWithAuthenticatorAssertionResponse(credential) {
    (0, errors_1.assertPasskeyError)(credential &&
        credential instanceof PublicKeyCredential &&
        credential.response instanceof AuthenticatorAssertionResponse, errors_1.PasskeyErrorCode.PasskeyRetrievalFailed);
}
exports.assertCredentialIsPkcWithAuthenticatorAssertionResponse = assertCredentialIsPkcWithAuthenticatorAssertionResponse;
//# sourceMappingURL=index.js.map
