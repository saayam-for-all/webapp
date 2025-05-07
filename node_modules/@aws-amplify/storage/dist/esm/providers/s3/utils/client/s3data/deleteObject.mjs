import { parseMetadata } from '@aws-amplify/core/internals/aws-client-utils';
import { AmplifyUrl } from '@aws-amplify/core/internals/utils';
import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';
import { s3TransferHandler } from '../runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { buildStorageServiceError, map, deserializeBoolean } from '../utils/deserializeHelpers.mjs';
import { validateS3RequiredParameter, serializePathnameObjectKey, assignStringVariables } from '../utils/serializeHelpers.mjs';
import { validateObjectUrl } from '../../validateObjectUrl.mjs';
import { defaultConfig, parseXmlError } from './base.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const deleteObjectSerializer = (input, endpoint) => {
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
        method: 'DELETE',
        headers,
        url,
    };
};
const deleteObjectDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        // error is always set when statusCode >= 300
        const error = (await parseXmlError(response));
        throw buildStorageServiceError(error, response.statusCode);
    }
    else {
        const content = map(response.headers, {
            DeleteMarker: ['x-amz-delete-marker', deserializeBoolean],
            VersionId: 'x-amz-version-id',
            RequestCharged: 'x-amz-request-charged',
        });
        return {
            ...content,
            $metadata: parseMetadata(response),
        };
    }
};
const deleteObject = composeServiceApi(s3TransferHandler, deleteObjectSerializer, deleteObjectDeserializer, { ...defaultConfig, responseType: 'text' });

export { deleteObject };
//# sourceMappingURL=deleteObject.mjs.map
