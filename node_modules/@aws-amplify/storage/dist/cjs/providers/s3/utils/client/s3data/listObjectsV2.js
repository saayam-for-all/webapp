'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.listObjectsV2 = void 0;
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const utils_1 = require("@aws-amplify/core/internals/utils");
const composers_1 = require("@aws-amplify/core/internals/aws-client-utils/composers");
const utils_2 = require("../utils");
const IntegrityError_1 = require("../../../../../errors/IntegrityError");
const base_1 = require("./base");
const listObjectsV2Serializer = (input, endpoint) => {
    const headers = (0, utils_2.assignStringVariables)({
        'x-amz-request-payer': input.RequestPayer,
        'x-amz-expected-bucket-owner': input.ExpectedBucketOwner,
    });
    const query = (0, utils_2.assignStringVariables)({
        'list-type': '2',
        'continuation-token': input.ContinuationToken,
        delimiter: input.Delimiter,
        'encoding-type': input.EncodingType,
        'fetch-owner': input.FetchOwner,
        'max-keys': input.MaxKeys,
        prefix: input.Prefix,
        'start-after': input.StartAfter,
    });
    const url = new utils_1.AmplifyUrl(endpoint.url.toString());
    url.search = new utils_1.AmplifyUrlSearchParams(query).toString();
    return {
        method: 'GET',
        headers,
        url,
    };
};
const listObjectsV2Deserializer = async (response) => {
    if (response.statusCode >= 300) {
        // error is always set when statusCode >= 300
        const error = (await (0, base_1.parseXmlError)(response));
        throw (0, utils_2.buildStorageServiceError)(error, response.statusCode);
    }
    else {
        const parsed = await (0, utils_2.parseXmlBody)(response);
        const contents = (0, utils_2.map)(parsed, {
            CommonPrefixes: [
                'CommonPrefixes',
                value => (0, utils_2.emptyArrayGuard)(value, deserializeCommonPrefixList),
            ],
            Contents: [
                'Contents',
                value => (0, utils_2.emptyArrayGuard)(value, deserializeObjectList),
            ],
            ContinuationToken: 'ContinuationToken',
            Delimiter: 'Delimiter',
            EncodingType: 'EncodingType',
            IsTruncated: ['IsTruncated', utils_2.deserializeBoolean],
            KeyCount: ['KeyCount', utils_2.deserializeNumber],
            MaxKeys: ['MaxKeys', utils_2.deserializeNumber],
            Name: 'Name',
            NextContinuationToken: 'NextContinuationToken',
            Prefix: 'Prefix',
            StartAfter: 'StartAfter',
        });
        const output = {
            $metadata: (0, aws_client_utils_1.parseMetadata)(response),
            ...contents,
        };
        validateCorroboratingElements(output);
        return output;
    }
};
const deserializeCommonPrefixList = (output) => output.map(deserializeCommonPrefix);
const deserializeCommonPrefix = (output) => (0, utils_2.map)(output, {
    Prefix: 'Prefix',
});
const deserializeObjectList = (output) => output.map(deserializeObject);
const deserializeObject = (output) => (0, utils_2.map)(output, {
    Key: 'Key',
    LastModified: ['LastModified', utils_2.deserializeTimestamp],
    ETag: 'ETag',
    ChecksumAlgorithm: [
        'ChecksumAlgorithm',
        value => (0, utils_2.emptyArrayGuard)(value, deserializeChecksumAlgorithmList),
    ],
    Size: ['Size', utils_2.deserializeNumber],
    StorageClass: 'StorageClass',
    Owner: ['Owner', deserializeOwner],
});
const deserializeChecksumAlgorithmList = (output) => output.map(entry => String(entry));
const deserializeOwner = (output) => (0, utils_2.map)(output, { DisplayName: 'DisplayName', ID: 'ID' });
const validateCorroboratingElements = (response) => {
    const { IsTruncated, KeyCount, Contents = [], CommonPrefixes = [], NextContinuationToken, } = response;
    const validTruncation = (IsTruncated && !!NextContinuationToken) ||
        (!IsTruncated && !NextContinuationToken);
    const validNumberOfKeysReturned = KeyCount === Contents.length + CommonPrefixes.length;
    if (!validTruncation || !validNumberOfKeysReturned) {
        throw new IntegrityError_1.IntegrityError();
    }
};
exports.listObjectsV2 = (0, composers_1.composeServiceApi)(utils_2.s3TransferHandler, listObjectsV2Serializer, listObjectsV2Deserializer, { ...base_1.defaultConfig, responseType: 'text' });
//# sourceMappingURL=listObjectsV2.js.map
