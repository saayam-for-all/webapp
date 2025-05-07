import { Amplify } from '@aws-amplify/core';
import { getProperties as getProperties$1 } from '../../providers/s3/apis/internal/getProperties.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
const getProperties = (input) => getProperties$1(Amplify, {
    path: input.path,
    options: {
        useAccelerateEndpoint: input?.options?.useAccelerateEndpoint,
        bucket: input?.options?.bucket,
        locationCredentialsProvider: input?.options?.locationCredentialsProvider,
        expectedBucketOwner: input?.options?.expectedBucketOwner,
        customEndpoint: input?.options?.customEndpoint,
    },
    // Type casting is necessary because `getPropertiesInternal` supports both Gen1 and Gen2 signatures, but here
    // given in input can only be Gen2 signature, the return can only ben Gen2 signature.
});

export { getProperties };
//# sourceMappingURL=getProperties.mjs.map
