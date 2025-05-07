import { parseMetadata } from '@aws-amplify/core/internals/aws-client-utils';
import { AmplifyUrl } from '@aws-amplify/core/internals/utils';
import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';
import { s3TransferHandler } from '../runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { buildStorageServiceError, map } from '../utils/deserializeHelpers.mjs';
import { serializeObjectConfigsToHeaders, assignStringVariables, validateS3RequiredParameter, serializePathnameObjectKey } from '../utils/serializeHelpers.mjs';
import { validateObjectUrl } from '../../validateObjectUrl.mjs';
import { defaultConfig, parseXmlError } from './base.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const putObjectSerializer = async (input, endpoint) => {
    const headers = {
        ...(await serializeObjectConfigsToHeaders({
            ...input,
            ContentType: input.ContentType ?? 'application/octet-stream',
        })),
        ...assignStringVariables({
            'content-md5': input.ContentMD5,
            'x-amz-checksum-crc32': input.ChecksumCRC32,
            'x-amz-expected-bucket-owner': input.ExpectedBucketOwner,
            'If-None-Match': input.IfNoneMatch,
        }),
    };
    const url = new AmplifyUrl(endpoint.url.toString());
    validateS3RequiredParameter(!!input.Key, 'Key');
    url.pathname = serializePathnameObjectKey(url, input.Key);
    validateObjectUrl({
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
        const error = (await parseXmlError(response));
        throw buildStorageServiceError(error, response.statusCode);
    }
    else {
        return {
            ...map(response.headers, {
                ETag: 'etag',
                VersionId: 'x-amz-version-id',
            }),
            $metadata: parseMetadata(response),
        };
    }
};
const putObject = composeServiceApi(s3TransferHandler, putObjectSerializer, putObjectDeserializer, { ...defaultConfig, responseType: 'text' });

export { putObject };
//# sourceMappingURL=putObject.mjs.map
