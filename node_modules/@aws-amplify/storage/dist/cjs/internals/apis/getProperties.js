'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProperties = void 0;
const core_1 = require("@aws-amplify/core");
const getProperties_1 = require("../../providers/s3/apis/internal/getProperties");
/**
 * @internal
 */
const getProperties = (input) => (0, getProperties_1.getProperties)(core_1.Amplify, {
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
exports.getProperties = getProperties;
//# sourceMappingURL=getProperties.js.map
