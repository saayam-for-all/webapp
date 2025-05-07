'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPasskey = void 0;
const types_1 = require("./types");
const serde_1 = require("./serde");
const errors_1 = require("./errors");
const getIsPasskeySupported_1 = require("./getIsPasskeySupported");
/**
 * Registers a new passkey for user
 * @param input - PasskeyCreateOptionsJson
 * @returns serialized PasskeyCreateResult
 */
const registerPasskey = async (input) => {
    try {
        const isPasskeySupported = (0, getIsPasskeySupported_1.getIsPasskeySupported)();
        (0, errors_1.assertPasskeyError)(isPasskeySupported, errors_1.PasskeyErrorCode.PasskeyNotSupported);
        const passkeyCreationOptions = (0, serde_1.deserializeJsonToPkcCreationOptions)(input);
        const credential = await navigator.credentials.create({
            publicKey: passkeyCreationOptions,
        });
        (0, types_1.assertCredentialIsPkcWithAuthenticatorAttestationResponse)(credential);
        return (0, serde_1.serializePkcWithAttestationToJson)(credential);
    }
    catch (err) {
        throw (0, errors_1.handlePasskeyRegistrationError)(err);
    }
};
exports.registerPasskey = registerPasskey;
//# sourceMappingURL=registerPasskey.js.map
