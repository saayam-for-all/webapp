'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyObject = exports.validateCopyObjectHeaders = void 0;
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const utils_1 = require("@aws-amplify/core/internals/utils");
const composers_1 = require("@aws-amplify/core/internals/aws-client-utils/composers");
const utils_2 = require("../utils");
const IntegrityError_1 = require("../../../../../errors/IntegrityError");
const validateObjectUrl_1 = require("../../validateObjectUrl");
const base_1 = require("./base");
const copyObjectSerializer = async (input, endpoint) => {
    const headers = {
        ...(await (0, utils_2.serializeObjectConfigsToHeaders)(input)),
        ...(0, utils_2.assignStringVariables)({
            'x-amz-copy-source': input.CopySource,
            'x-amz-metadata-directive': input.MetadataDirective,
            'x-amz-copy-source-if-match': input.CopySourceIfMatch,
            'x-amz-copy-source-if-unmodified-since': input.CopySourceIfUnmodifiedSince?.toUTCString(),
            'x-amz-source-expected-bucket-owner': input.ExpectedSourceBucketOwner,
            'x-amz-expected-bucket-owner': input.ExpectedBucketOwner,
        }),
    };
    (0, exports.validateCopyObjectHeaders)(input, headers);
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
    };
};
const validateCopyObjectHeaders = (input, headers) => {
    const validations = [
        headers['x-amz-copy-source'] === input.CopySource,
        (0, utils_2.bothNilOrEqual)(input.MetadataDirective, headers['x-amz-metadata-directive']),
        (0, utils_2.bothNilOrEqual)(input.CopySourceIfMatch, headers['x-amz-copy-source-if-match']),
        (0, utils_2.bothNilOrEqual)(input.CopySourceIfUnmodifiedSince?.toUTCString(), headers['x-amz-copy-source-if-unmodified-since']),
    ];
    if (validations.some(validation => !validation)) {
        throw new IntegrityError_1.IntegrityError();
    }
};
exports.validateCopyObjectHeaders = validateCopyObjectHeaders;
const copyObjectDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        const error = (await (0, base_1.parseXmlError)(response));
        throw (0, utils_2.buildStorageServiceError)(error, response.statusCode);
    }
    else {
        await (0, utils_2.parseXmlBody)(response);
        return {
            $metadata: (0, aws_client_utils_1.parseMetadata)(response),
        };
    }
};
exports.copyObject = (0, composers_1.composeServiceApi)(utils_2.s3TransferHandler, copyObjectSerializer, copyObjectDeserializer, { ...base_1.defaultConfig, responseType: 'text' });
//# sourceMappingURL=copyObject.js.map
