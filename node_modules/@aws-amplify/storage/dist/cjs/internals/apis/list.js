'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const core_1 = require("@aws-amplify/core");
const list_1 = require("../../providers/s3/apis/internal/list");
/**
 * @internal
 */
function list(input) {
    return (0, list_1.list)(core_1.Amplify, {
        path: input.path,
        options: {
            bucket: input.options?.bucket,
            subpathStrategy: input.options?.subpathStrategy,
            useAccelerateEndpoint: input.options?.useAccelerateEndpoint,
            listAll: input.options?.listAll,
            expectedBucketOwner: input.options?.expectedBucketOwner,
            // Pagination options
            nextToken: input.options?.nextToken,
            pageSize: input.options?.pageSize,
            // Advanced options
            locationCredentialsProvider: input.options?.locationCredentialsProvider,
            customEndpoint: input?.options?.customEndpoint,
        },
        // Type casting is necessary because `listInternal` supports both Gen1 and Gen2 signatures, but here
        // given in input can only be Gen2 signature, the return can only ben Gen2 signature.
    });
}
exports.list = list;
//# sourceMappingURL=list.js.map
