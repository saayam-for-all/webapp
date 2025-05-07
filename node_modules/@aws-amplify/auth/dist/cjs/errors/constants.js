'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNEXPECTED_SIGN_IN_INTERRUPTION_EXCEPTION = exports.TOKEN_REFRESH_EXCEPTION = exports.OAUTH_SIGNOUT_EXCEPTION = exports.invalidOriginException = exports.INVALID_ORIGIN_EXCEPTION = exports.invalidPreferredRedirectUrlException = exports.invalidAppSchemeException = exports.invalidRedirectException = exports.INVALID_PREFERRED_REDIRECT_EXCEPTION = exports.INVALID_APP_SCHEME_EXCEPTION = exports.INVALID_REDIRECT_EXCEPTION = exports.AUTO_SIGN_IN_EXCEPTION = exports.DEVICE_METADATA_NOT_FOUND_EXCEPTION = exports.USER_ALREADY_AUTHENTICATED_EXCEPTION = exports.USER_UNAUTHENTICATED_EXCEPTION = void 0;
const AuthError_1 = require("./AuthError");
exports.USER_UNAUTHENTICATED_EXCEPTION = 'UserUnAuthenticatedException';
exports.USER_ALREADY_AUTHENTICATED_EXCEPTION = 'UserAlreadyAuthenticatedException';
exports.DEVICE_METADATA_NOT_FOUND_EXCEPTION = 'DeviceMetadataNotFoundException';
exports.AUTO_SIGN_IN_EXCEPTION = 'AutoSignInException';
exports.INVALID_REDIRECT_EXCEPTION = 'InvalidRedirectException';
exports.INVALID_APP_SCHEME_EXCEPTION = 'InvalidAppSchemeException';
exports.INVALID_PREFERRED_REDIRECT_EXCEPTION = 'InvalidPreferredRedirectUrlException';
exports.invalidRedirectException = new AuthError_1.AuthError({
    name: exports.INVALID_REDIRECT_EXCEPTION,
    message: 'signInRedirect or signOutRedirect had an invalid format or was not found.',
    recoverySuggestion: 'Please make sure the signIn/Out redirect in your oauth config is valid.',
});
exports.invalidAppSchemeException = new AuthError_1.AuthError({
    name: exports.INVALID_APP_SCHEME_EXCEPTION,
    message: 'A valid non-http app scheme was not found in the config.',
    recoverySuggestion: 'Please make sure a valid custom app scheme is present in the config.',
});
exports.invalidPreferredRedirectUrlException = new AuthError_1.AuthError({
    name: exports.INVALID_PREFERRED_REDIRECT_EXCEPTION,
    message: 'The given preferredRedirectUrl does not match any items in the redirectSignOutUrls array from the config.',
    recoverySuggestion: 'Please make sure a matching preferredRedirectUrl is provided.',
});
exports.INVALID_ORIGIN_EXCEPTION = 'InvalidOriginException';
exports.invalidOriginException = new AuthError_1.AuthError({
    name: exports.INVALID_ORIGIN_EXCEPTION,
    message: 'redirect is coming from a different origin. The oauth flow needs to be initiated from the same origin',
    recoverySuggestion: 'Please call signInWithRedirect from the same origin.',
});
exports.OAUTH_SIGNOUT_EXCEPTION = 'OAuthSignOutException';
exports.TOKEN_REFRESH_EXCEPTION = 'TokenRefreshException';
exports.UNEXPECTED_SIGN_IN_INTERRUPTION_EXCEPTION = 'UnexpectedSignInInterruptionException';
//# sourceMappingURL=constants.js.map
