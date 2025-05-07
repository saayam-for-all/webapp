'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.createRetryDecider = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
/**
 * Factory of a {@link RetryDecider} function.
 *
 * @param errorParser function to parse HTTP response wth XML payload to JS
 * 	Error instance.
 * @returns A structure indicating if the response is retryable; And if it is a
 * 	CredentialsExpiredError
 */
const createRetryDecider = (errorParser) => async (response, error, middlewareContext) => {
    const defaultRetryDecider = (0, aws_client_utils_1.getRetryDecider)(errorParser);
    const defaultRetryDecision = await defaultRetryDecider(response, error);
    if (!response) {
        return { retryable: defaultRetryDecision.retryable };
    }
    const parsedError = await errorParser(response);
    const errorCode = parsedError?.name;
    const errorMessage = parsedError?.message;
    const isCredentialsExpired = isCredentialsExpiredError(errorCode, errorMessage);
    return {
        retryable: defaultRetryDecision.retryable ||
            // If we know the previous retry attempt sets isCredentialsExpired in the
            // middleware context, we don't want to retry anymore.
            !!(isCredentialsExpired && !middlewareContext?.isCredentialsExpired),
        isCredentialsExpiredError: isCredentialsExpired,
    };
};
exports.createRetryDecider = createRetryDecider;
// Ref: https://github.com/aws/aws-sdk-js/blob/54829e341181b41573c419bd870dd0e0f8f10632/lib/event_listeners.js#L522-L541
const INVALID_TOKEN_ERROR_CODES = [
    'RequestExpired',
    'ExpiredTokenException',
    'ExpiredToken',
];
/**
 * Given an error code, returns true if it is related to invalid credentials.
 *
 * @param errorCode String representation of some error.
 * @returns True if given error indicates the credentials used to authorize request
 * are invalid.
 */
const isCredentialsExpiredError = (errorCode, errorMessage) => {
    const isExpiredTokenError = !!errorCode && INVALID_TOKEN_ERROR_CODES.includes(errorCode);
    // Ref: https://github.com/aws/aws-sdk-js/blob/54829e341181b41573c419bd870dd0e0f8f10632/lib/event_listeners.js#L536-L539
    const isExpiredSignatureError = !!errorCode &&
        !!errorMessage &&
        errorCode.includes('Signature') &&
        errorMessage.includes('expired');
    return isExpiredTokenError || isExpiredSignatureError;
};
//# sourceMappingURL=createRetryDecider.js.map
