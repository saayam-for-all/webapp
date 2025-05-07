import { composeTransferHandler } from '@aws-amplify/core/internals/aws-client-utils/composers';
import { unauthenticatedHandler } from '@aws-amplify/core/internals/aws-client-utils';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
const cognitoUserPoolTransferHandler = composeTransferHandler(unauthenticatedHandler, [disableCacheMiddlewareFactory]);

export { cognitoUserPoolTransferHandler };
//# sourceMappingURL=cognitoUserPoolTransferHandler.mjs.map
