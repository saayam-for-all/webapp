import { parseMetadata } from '@aws-amplify/core/internals/aws-client-utils';
import { AmplifyUrl } from '@aws-amplify/core/internals/utils';
import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';
import { parseXmlBody } from '../utils/parsePayload.mjs';
import { s3TransferHandler } from '../runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { buildStorageServiceError } from '../utils/deserializeHelpers.mjs';
import { serializeObjectConfigsToHeaders, assignStringVariables, validateS3RequiredParameter, serializePathnameObjectKey } from '../utils/serializeHelpers.mjs';
import { bothNilOrEqual } from '../utils/integrityHelpers.mjs';
import { IntegrityError } from '../../../../../errors/IntegrityError.mjs';
import { validateObjectUrl } from '../../validateObjectUrl.mjs';
import { defaultConfig, parseXmlError } from './base.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const copyObjectSerializer = async (input, endpoint) => {
    const headers = {
        ...(await serializeObjectConfigsToHeaders(input)),
        ...assignStringVariables({
            'x-amz-copy-source': input.CopySource,
            'x-amz-metadata-directive': input.MetadataDirective,
            'x-amz-copy-source-if-match': input.CopySourceIfMatch,
            'x-amz-copy-source-if-unmodified-since': input.CopySourceIfUnmodifiedSince?.toUTCString(),
            'x-amz-source-expected-bucket-owner': input.ExpectedSourceBucketOwner,
            'x-amz-expected-bucket-owner': input.ExpectedBucketOwner,
        }),
    };
    validateCopyObjectHeaders(input, headers);
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
    };
};
const validateCopyObjectHeaders = (input, headers) => {
    const validations = [
        headers['x-amz-copy-source'] === input.CopySource,
        bothNilOrEqual(input.MetadataDirective, headers['x-amz-metadata-directive']),
        bothNilOrEqual(input.CopySourceIfMatch, headers['x-amz-copy-source-if-match']),
        bothNilOrEqual(input.CopySourceIfUnmodifiedSince?.toUTCString(), headers['x-amz-copy-source-if-unmodified-since']),
    ];
    if (validations.some(validation => !validation)) {
        throw new IntegrityError();
    }
};
const copyObjectDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        const error = (await parseXmlError(response));
        throw buildStorageServiceError(error, response.statusCode);
    }
    else {
        await parseXmlBody(response);
        return {
            $metadata: parseMetadata(response),
        };
    }
};
const copyObject = composeServiceApi(s3TransferHandler, copyObjectSerializer, copyObjectDeserializer, { ...defaultConfig, responseType: 'text' });

export { copyObject, validateCopyObjectHeaders };
//# sourceMappingURL=copyObject.mjs.map
