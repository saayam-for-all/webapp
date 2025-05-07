'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.abortMultipartUpload = void 0;
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const composers_1 = require("@aws-amplify/core/internals/aws-client-utils/composers");
const utils_1 = require("@aws-amplify/core/internals/utils");
const utils_2 = require("../utils");
const validateObjectUrl_1 = require("../../validateObjectUrl");
const base_1 = require("./base");
const abortMultipartUploadSerializer = (input, endpoint) => {
    const url = new utils_1.AmplifyUrl(endpoint.url.toString());
    (0, utils_2.validateS3RequiredParameter)(!!input.Key, 'Key');
    url.pathname = (0, utils_2.serializePathnameObjectKey)(url, input.Key);
    (0, utils_2.validateS3RequiredParameter)(!!input.UploadId, 'UploadId');
    url.search = new utils_1.AmplifyUrlSearchParams({
        uploadId: input.UploadId,
    }).toString();
    (0, validateObjectUrl_1.validateObjectUrl)({
        bucketName: input.Bucket,
        key: input.Key,
        objectURL: url,
    });
    const headers = {
        ...(0, utils_2.assignStringVariables)({
            'x-amz-expected-bucket-owner': input.ExpectedBucketOwner,
        }),
    };
    return {
        method: 'DELETE',
        headers,
        url,
    };
};
const abortMultipartUploadDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        const error = (await (0, base_1.parseXmlError)(response));
        throw (0, utils_2.buildStorageServiceError)(error, response.statusCode);
    }
    else {
        return {
            $metadata: (0, aws_client_utils_1.parseMetadata)(response),
        };
    }
};
exports.abortMultipartUpload = (0, composers_1.composeServiceApi)(utils_2.s3TransferHandler, abortMultipartUploadSerializer, abortMultipartUploadDeserializer, { ...base_1.defaultConfig, responseType: 'text' });
//# sourceMappingURL=abortMultipartUpload.js.map
