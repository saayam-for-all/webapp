import { downloadData as downloadData$1 } from '../../providers/s3/apis/internal/downloadData.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
const downloadData = (input) => downloadData$1({
    path: input.path,
    options: {
        useAccelerateEndpoint: input?.options?.useAccelerateEndpoint,
        bucket: input?.options?.bucket,
        locationCredentialsProvider: input?.options?.locationCredentialsProvider,
        bytesRange: input?.options?.bytesRange,
        onProgress: input?.options?.onProgress,
        expectedBucketOwner: input?.options?.expectedBucketOwner,
        customEndpoint: input?.options?.customEndpoint,
    },
    // Type casting is necessary because `downloadDataInternal` supports both Gen1 and Gen2 signatures, but here
    // given in input can only be Gen2 signature, the return can only ben Gen2 signature.
});

export { downloadData };
//# sourceMappingURL=downloadData.mjs.map
