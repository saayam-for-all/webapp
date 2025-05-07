import { assertCredentialIsPkcWithAuthenticatorAttestationResponse } from './types/index.mjs';
import { deserializeJsonToPkcCreationOptions, serializePkcWithAttestationToJson } from './serde.mjs';
import { assertPasskeyError, PasskeyErrorCode, handlePasskeyRegistrationError } from './errors.mjs';
import { getIsPasskeySupported } from './getIsPasskeySupported.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Registers a new passkey for user
 * @param input - PasskeyCreateOptionsJson
 * @returns serialized PasskeyCreateResult
 */
const registerPasskey = async (input) => {
    try {
        const isPasskeySupported = getIsPasskeySupported();
        assertPasskeyError(isPasskeySupported, PasskeyErrorCode.PasskeyNotSupported);
        const passkeyCreationOptions = deserializeJsonToPkcCreationOptions(input);
        const credential = await navigator.credentials.create({
            publicKey: passkeyCreationOptions,
        });
        assertCredentialIsPkcWithAuthenticatorAttestationResponse(credential);
        return serializePkcWithAttestationToJson(credential);
    }
    catch (err) {
        throw handlePasskeyRegistrationError(err);
    }
};

export { registerPasskey };
//# sourceMappingURL=registerPasskey.mjs.map
