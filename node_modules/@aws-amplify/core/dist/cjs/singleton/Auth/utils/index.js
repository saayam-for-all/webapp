'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJWT = exports.assertIdentityPoolIdConfig = exports.assertOAuthConfig = exports.assertTokenProviderConfig = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const convert_1 = require("../../../utils/convert");
const errorHelpers_1 = require("./errorHelpers");
function assertTokenProviderConfig(cognitoConfig) {
    let assertionValid = true; // assume valid until otherwise proveed
    if (!cognitoConfig) {
        assertionValid = false;
    }
    else {
        assertionValid =
            !!cognitoConfig.userPoolId && !!cognitoConfig.userPoolClientId;
    }
    (0, errorHelpers_1.assert)(assertionValid, errorHelpers_1.AuthConfigurationErrorCode.AuthUserPoolException);
}
exports.assertTokenProviderConfig = assertTokenProviderConfig;
function assertOAuthConfig(cognitoConfig) {
    const validOAuthConfig = !!cognitoConfig?.loginWith?.oauth?.domain &&
        !!cognitoConfig?.loginWith?.oauth?.redirectSignOut &&
        !!cognitoConfig?.loginWith?.oauth?.redirectSignIn &&
        !!cognitoConfig?.loginWith?.oauth?.responseType;
    (0, errorHelpers_1.assert)(validOAuthConfig, errorHelpers_1.AuthConfigurationErrorCode.OAuthNotConfigureException);
}
exports.assertOAuthConfig = assertOAuthConfig;
function assertIdentityPoolIdConfig(cognitoConfig) {
    const validConfig = !!cognitoConfig?.identityPoolId;
    (0, errorHelpers_1.assert)(validConfig, errorHelpers_1.AuthConfigurationErrorCode.InvalidIdentityPoolIdException);
}
exports.assertIdentityPoolIdConfig = assertIdentityPoolIdConfig;
/**
 * Decodes payload of JWT token
 *
 * @param {String} token A string representing a token to be decoded
 * @throws {@link Error} - Throws error when token is invalid or payload malformed.
 */
function decodeJWT(token) {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        throw new Error('Invalid token');
    }
    try {
        const base64WithUrlSafe = tokenParts[1];
        const base64 = base64WithUrlSafe.replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr = decodeURIComponent(convert_1.base64Decoder
            .convert(base64)
            .split('')
            .map(char => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join(''));
        const payload = JSON.parse(jsonStr);
        return {
            toString: () => token,
            payload,
        };
    }
    catch (err) {
        throw new Error('Invalid token payload');
    }
}
exports.decodeJWT = decodeJWT;
//# sourceMappingURL=index.js.map
