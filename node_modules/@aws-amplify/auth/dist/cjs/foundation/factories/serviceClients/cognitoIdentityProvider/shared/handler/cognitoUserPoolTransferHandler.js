'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoUserPoolTransferHandler = void 0;
const composers_1 = require("@aws-amplify/core/internals/aws-client-utils/composers");
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
/**
 * A Cognito Identity-specific middleware that disables caching for all requests.
 */
const disableCacheMiddlewareFactory = () => (next, _) => async function disableCacheMiddleware(request) {
    request.headers['cache-control'] = 'no-store';
    return next(request);
};
/**
 * A Cognito Identity-specific transfer handler that does NOT sign requests, and
 * disables caching.
 *
 * @internal
 */
exports.cognitoUserPoolTransferHandler = (0, composers_1.composeTransferHandler)(aws_client_utils_1.unauthenticatedHandler, [disableCacheMiddlewareFactory]);
//# sourceMappingURL=cognitoUserPoolTransferHandler.js.map
