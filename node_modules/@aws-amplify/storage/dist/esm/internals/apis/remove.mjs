import { Amplify } from '@aws-amplify/core';
import { remove as remove$1 } from '../../providers/s3/apis/internal/remove.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
const remove = (input) => remove$1(Amplify, {
    path: input.path,
    options: {
        useAccelerateEndpoint: input?.options?.useAccelerateEndpoint,
        bucket: input?.options?.bucket,
        expectedBucketOwner: input?.options?.expectedBucketOwner,
        locationCredentialsProvider: input?.options?.locationCredentialsProvider,
        customEndpoint: input?.options?.customEndpoint,
    },
    // Type casting is necessary because `removeInternal` supports both Gen1 and Gen2 signatures, but here
    // given in input can only be Gen2 signature, the return can only ben Gen2 signature.
});

export { remove };
//# sourceMappingURL=remove.mjs.map
