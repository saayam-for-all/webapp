'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.putObject = void 0;
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const utils_1 = require("@aws-amplify/core/internals/utils");
const composers_1 = require("@aws-amplify/core/internals/aws-client-utils/composers");
const utils_2 = require("../utils");
const validateObjectUrl_1 = require("../../validateObjectUrl");
const base_1 = require("./base");
const putObjectSerializer = async (input, endpoint) => {
    const headers = {
        ...(await (0, utils_2.serializeObjectConfigsToHeaders)({
            ...input,
            ContentType: input.ContentType ?? 'application/octet-stream',
        })),
        ...(0, utils_2.assignStringVariables)({
            'content-md5': input.ContentMD5,
            'x-amz-checksum-crc32': input.ChecksumCRC32,
            'x-amz-expected-bucket-owner': input.ExpectedBucketOwner,
            'If-None-Match': input.IfNoneMatch,
        }),
    };
    const url = new utils_1.AmplifyUrl(endpoint.url.toString());
    (0, utils_2.validateS3RequiredParameter)(!!input.Key, 'Key');
    url.pathname = (0, utils_2.serializePathnameObjectKey)(url, input.Key);
    (0, validateObjectUrl_1.validateObjectUrl)({
        bucketName: input.Bucket,
        key: input.Key,
        objectURL: url,
    });
    return {
        method: 'PUT',
        headers,
        url,
        body: input.Body,
    };
};
const putObjectDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        const error = (await (0, base_1.parseXmlError)(response));
        throw (0, utils_2.buildStorageServiceError)(error, response.statusCode);
    }
    else {
        return {
            ...(0, utils_2.map)(response.headers, {
                ETag: 'etag',
                VersionId: 'x-amz-version-id',
            }),
            $metadata: (0, aws_client_utils_1.parseMetadata)(response),
        };
    }
};
exports.putObject = (0, composers_1.composeServiceApi)(utils_2.s3TransferHandler, putObjectSerializer, putObjectDeserializer, { ...base_1.defaultConfig, responseType: 'text' });
//# sourceMappingURL=putObject.js.map
