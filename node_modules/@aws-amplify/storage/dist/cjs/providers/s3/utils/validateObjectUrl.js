'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectUrl = void 0;
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const IntegrityError_1 = require("../../../errors/IntegrityError");
function validateObjectUrl({ bucketName, key, objectURL, }) {
    if (!bucketName || !key || !objectURL) {
        throw new IntegrityError_1.IntegrityError();
    }
    const bucketWithDots = bucketName.includes('.');
    const encodedBucketName = (0, aws_client_utils_1.extendedEncodeURIComponent)(bucketName);
    const encodedKey = key.split('/').map(aws_client_utils_1.extendedEncodeURIComponent).join('/');
    const isPathStyleUrl = objectURL.pathname === `/${encodedBucketName}/${encodedKey}`;
    const isSubdomainUrl = objectURL.hostname.startsWith(`${encodedBucketName}.`) &&
        objectURL.pathname === `/${encodedKey}`;
    if (!(isPathStyleUrl || (!bucketWithDots && isSubdomainUrl))) {
        throw new IntegrityError_1.IntegrityError();
    }
}
exports.validateObjectUrl = validateObjectUrl;
//# sourceMappingURL=validateObjectUrl.js.map
