import { parseMetadata } from '@aws-amplify/core/internals/aws-client-utils';
import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';
import { AmplifyUrl, AmplifyUrlSearchParams } from '@aws-amplify/core/internals/utils';
import { s3TransferHandler } from '../runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { buildStorageServiceError } from '../utils/deserializeHelpers.mjs';
import { validateS3RequiredParameter, serializePathnameObjectKey, assignStringVariables } from '../utils/serializeHelpers.mjs';
import { validateObjectUrl } from '../../validateObjectUrl.mjs';
import { defaultConfig, parseXmlError } from './base.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const abortMultipartUploadSerializer = (input, endpoint) => {
    const url = new AmplifyUrl(endpoint.url.toString());
    validateS3RequiredParameter(!!input.Key, 'Key');
    url.pathname = serializePathnameObjectKey(url, input.Key);
    validateS3RequiredParameter(!!input.UploadId, 'UploadId');
    url.search = new AmplifyUrlSearchParams({
        uploadId: input.UploadId,
    }).toString();
    validateObjectUrl({
        bucketName: input.Bucket,
        key: input.Key,
        objectURL: url,
    });
    const headers = {
        ...assignStringVariables({
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
        const error = (await parseXmlError(response));
        throw buildStorageServiceError(error, response.statusCode);
    }
    else {
        return {
            $metadata: parseMetadata(response),
        };
    }
};
const abortMultipartUpload = composeServiceApi(s3TransferHandler, abortMultipartUploadSerializer, abortMultipartUploadDeserializer, { ...defaultConfig, responseType: 'text' });

export { abortMultipartUpload };
//# sourceMappingURL=abortMultipartUpload.mjs.map
