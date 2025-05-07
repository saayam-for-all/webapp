'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasskey = void 0;
const errors_1 = require("./errors");
const getIsPasskeySupported_1 = require("./getIsPasskeySupported");
const serde_1 = require("./serde");
const types_1 = require("./types");
const getPasskey = async (input) => {
    try {
        const isPasskeySupported = (0, getIsPasskeySupported_1.getIsPasskeySupported)();
        (0, errors_1.assertPasskeyError)(isPasskeySupported, errors_1.PasskeyErrorCode.PasskeyNotSupported);
        const passkeyGetOptions = (0, serde_1.deserializeJsonToPkcGetOptions)(input);
        const credential = await navigator.credentials.get({
            publicKey: passkeyGetOptions,
        });
        (0, types_1.assertCredentialIsPkcWithAuthenticatorAssertionResponse)(credential);
        return (0, serde_1.serializePkcWithAssertionToJson)(credential);
    }
    catch (err) {
        throw (0, errors_1.handlePasskeyAuthenticationError)(err);
    }
};
exports.getPasskey = getPasskey;
//# sourceMappingURL=getPasskey.js.map
