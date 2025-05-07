import { assertPasskeyError, PasskeyErrorCode, handlePasskeyAuthenticationError } from './errors.mjs';
import { getIsPasskeySupported } from './getIsPasskeySupported.mjs';
import { deserializeJsonToPkcGetOptions, serializePkcWithAssertionToJson } from './serde.mjs';
import { assertCredentialIsPkcWithAuthenticatorAssertionResponse } from './types/index.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getPasskey = async (input) => {
    try {
        const isPasskeySupported = getIsPasskeySupported();
        assertPasskeyError(isPasskeySupported, PasskeyErrorCode.PasskeyNotSupported);
        const passkeyGetOptions = deserializeJsonToPkcGetOptions(input);
        const credential = await navigator.credentials.get({
            publicKey: passkeyGetOptions,
        });
        assertCredentialIsPkcWithAuthenticatorAssertionResponse(credential);
        return serializePkcWithAssertionToJson(credential);
    }
    catch (err) {
        throw handlePasskeyAuthenticationError(err);
    }
};

export { getPasskey };
//# sourceMappingURL=getPasskey.mjs.map
