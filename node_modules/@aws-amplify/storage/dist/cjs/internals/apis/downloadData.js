'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadData = void 0;
const downloadData_1 = require("../../providers/s3/apis/internal/downloadData");
/**
 * @internal
 */
const downloadData = (input) => (0, downloadData_1.downloadData)({
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
exports.downloadData = downloadData;
//# sourceMappingURL=downloadData.js.map
