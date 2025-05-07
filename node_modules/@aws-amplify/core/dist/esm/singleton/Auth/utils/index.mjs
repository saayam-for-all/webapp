import { base64Decoder } from '../../../utils/convert/base64/base64Decoder.mjs';
import '../../../types/errors.mjs';
import '../../../errors/errorHelpers.mjs';
import { assert, AuthConfigurationErrorCode } from './errorHelpers.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function assertTokenProviderConfig(cognitoConfig) {
    let assertionValid = true; // assume valid until otherwise proveed
    if (!cognitoConfig) {
        assertionValid = false;
    }
    else {
        assertionValid =
            !!cognitoConfig.userPoolId && !!cognitoConfig.userPoolClientId;
    }
    assert(assertionValid, AuthConfigurationErrorCode.AuthUserPoolException);
}
function assertOAuthConfig(cognitoConfig) {
    const validOAuthConfig = !!cognitoConfig?.loginWith?.oauth?.domain &&
        !!cognitoConfig?.loginWith?.oauth?.redirectSignOut &&
        !!cognitoConfig?.loginWith?.oauth?.redirectSignIn &&
        !!cognitoConfig?.loginWith?.oauth?.responseType;
    assert(validOAuthConfig, AuthConfigurationErrorCode.OAuthNotConfigureException);
}
function assertIdentityPoolIdConfig(cognitoConfig) {
    const validConfig = !!cognitoConfig?.identityPoolId;
    assert(validConfig, AuthConfigurationErrorCode.InvalidIdentityPoolIdException);
}
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
        const jsonStr = decodeURIComponent(base64Decoder
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

export { assertIdentityPoolIdConfig, assertOAuthConfig, assertTokenProviderConfig, decodeJWT };
//# sourceMappingURL=index.mjs.map
