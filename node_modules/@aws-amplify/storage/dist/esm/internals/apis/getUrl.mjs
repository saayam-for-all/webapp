import { Amplify } from '@aws-amplify/core';
import { getUrl as getUrl$1 } from '../../providers/s3/apis/internal/getUrl.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
const getUrl = (input) => getUrl$1(Amplify, {
    path: input.path,
    options: {
        useAccelerateEndpoint: input?.options?.useAccelerateEndpoint,
        bucket: input?.options?.bucket,
        validateObjectExistence: input?.options?.validateObjectExistence,
        expiresIn: input?.options?.expiresIn,
        contentDisposition: input?.options?.contentDisposition,
        contentType: input?.options?.contentType,
        expectedBucketOwner: input?.options?.expectedBucketOwner,
        // Advanced options
        locationCredentialsProvider: input?.options?.locationCredentialsProvider,
        customEndpoint: input?.options?.customEndpoint,
    },
    // Type casting is necessary because `getPropertiesInternal` supports both Gen1 and Gen2 signatures, but here
    // given in input can only be Gen2 signature, the return can only ben Gen2 signature.
});

export { getUrl };
//# sourceMappingURL=getUrl.mjs.map
