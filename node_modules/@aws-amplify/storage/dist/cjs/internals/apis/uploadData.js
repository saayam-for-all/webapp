'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadData = void 0;
const uploadData_1 = require("../../providers/s3/apis/internal/uploadData");
/**
 * @internal
 */
const uploadData = (input) => {
    const { data, path, options } = input;
    return (0, uploadData_1.uploadData)({
        path,
        data,
        options: {
            useAccelerateEndpoint: options?.useAccelerateEndpoint,
            bucket: options?.bucket,
            onProgress: options?.onProgress,
            contentDisposition: options?.contentDisposition,
            contentEncoding: options?.contentEncoding,
            contentType: options?.contentType,
            metadata: options?.metadata,
            preventOverwrite: options?.preventOverwrite,
            expectedBucketOwner: options?.expectedBucketOwner,
            checksumAlgorithm: options?.checksumAlgorithm,
            // Advanced options
            locationCredentialsProvider: options?.locationCredentialsProvider,
            customEndpoint: options?.customEndpoint,
        },
        // Type casting is necessary because `uploadDataInternal` supports both Gen1 and Gen2 signatures, but here
        // given in input can only be Gen2 signature, the return can only ben Gen2 signature.
    });
};
exports.uploadData = uploadData;
//# sourceMappingURL=uploadData.js.map
