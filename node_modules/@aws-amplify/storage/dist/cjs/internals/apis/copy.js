'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = void 0;
const core_1 = require("@aws-amplify/core");
const copy_1 = require("../../providers/s3/apis/internal/copy");
/**
 * @internal
 */
const copy = (input) => (0, copy_1.copy)(core_1.Amplify, {
    source: {
        path: input.source.path,
        bucket: input.source.bucket,
        eTag: input.source.eTag,
        notModifiedSince: input.source.notModifiedSince,
        expectedBucketOwner: input.source.expectedBucketOwner,
    },
    destination: {
        path: input.destination.path,
        bucket: input.destination.bucket,
        expectedBucketOwner: input.destination.expectedBucketOwner,
    },
    options: {
        // Advanced options
        locationCredentialsProvider: input.options?.locationCredentialsProvider,
        customEndpoint: input?.options?.customEndpoint,
    },
    // Type casting is necessary because `copyInternal` supports both Gen1 and Gen2 signatures, but here
    // given in input can only be Gen2 signature, the return can only ben Gen2 signature.
});
exports.copy = copy;
//# sourceMappingURL=copy.js.map
