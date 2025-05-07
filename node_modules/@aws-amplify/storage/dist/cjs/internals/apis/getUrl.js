'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrl = void 0;
const core_1 = require("@aws-amplify/core");
const getUrl_1 = require("../../providers/s3/apis/internal/getUrl");
/**
 * @internal
 */
const getUrl = (input) => (0, getUrl_1.getUrl)(core_1.Amplify, {
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
exports.getUrl = getUrl;
//# sourceMappingURL=getUrl.js.map
