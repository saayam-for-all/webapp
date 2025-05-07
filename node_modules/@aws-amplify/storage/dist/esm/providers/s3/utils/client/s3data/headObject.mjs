import { parseMetadata } from '@aws-amplify/core/internals/aws-client-utils';
import { AmplifyUrl } from '@aws-amplify/core/internals/utils';
import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';
import { s3TransferHandler } from '../runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { buildStorageServiceError, map, deserializeNumber, deserializeTimestamp, deserializeMetadata } from '../utils/deserializeHelpers.mjs';
import { validateS3RequiredParameter, serializePathnameObjectKey, assignStringVariables } from '../utils/serializeHelpers.mjs';
import { validateObjectUrl } from '../../validateObjectUrl.mjs';
import { defaultConfig, parseXmlError } from './base.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const headObjectSerializer = async (input, endpoint) => {
    const url = new AmplifyUrl(endpoint.url.toString());
    validateS3RequiredParameter(!!input.Key, 'Key');
    url.pathname = serializePathnameObjectKey(url, input.Key);
    validateObjectUrl({
        bucketName: input.Bucket,
        key: input.Key,
        objectURL: url,
    });
    const headers = assignStringVariables({
        'x-amz-expected-bucket-owner': input.ExpectedBucketOwner,
    });
    return {
        method: 'HEAD',
        headers,
        url,
    };
};
const headObjectDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        // error is always set when statusCode >= 300
        const error = (await parseXmlError(response));
        throw buildStorageServiceError(error, response.statusCode);
    }
    else {
        const contents = {
            ...map(response.headers, {
                ContentLength: ['content-length', deserializeNumber],
                ContentType: 'content-type',
                ETag: 'etag',
                LastModified: ['last-modified', deserializeTimestamp],
                VersionId: 'x-amz-version-id',
            }),
            Metadata: deserializeMetadata(response.headers),
        };
        return {
            $metadata: parseMetadata(response),
            ...contents,
        };
    }
};
const headObject = composeServiceApi(s3TransferHandler, headObjectSerializer, headObjectDeserializer, { ...defaultConfig, responseType: 'text' });

export { headObject };
//# sourceMappingURL=headObject.mjs.map
