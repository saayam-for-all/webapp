import { assertPasskeyError, PasskeyErrorCode } from '../errors.mjs';
export { assertValidCredentialCreationOptions } from './shared.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function assertCredentialIsPkcWithAuthenticatorAttestationResponse(credential) {
    assertPasskeyError(credential &&
        credential instanceof PublicKeyCredential &&
        credential.response instanceof AuthenticatorAttestationResponse, PasskeyErrorCode.PasskeyRegistrationFailed);
}
function assertCredentialIsPkcWithAuthenticatorAssertionResponse(credential) {
    assertPasskeyError(credential &&
        credential instanceof PublicKeyCredential &&
        credential.response instanceof AuthenticatorAssertionResponse, PasskeyErrorCode.PasskeyRetrievalFailed);
}

export { assertCredentialIsPkcWithAuthenticatorAssertionResponse, assertCredentialIsPkcWithAuthenticatorAttestationResponse };
//# sourceMappingURL=index.mjs.map
