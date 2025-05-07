'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = void 0;
const core_1 = require("@aws-amplify/core");
const remove_1 = require("../../providers/s3/apis/internal/remove");
/**
 * @internal
 */
const remove = (input) => (0, remove_1.remove)(core_1.Amplify, {
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
exports.remove = remove;
//# sourceMappingURL=remove.js.map
