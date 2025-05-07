import { StorageAction } from '@aws-amplify/core/internals/utils';
import { StorageValidationErrorCode } from '../../../../errors/types/validation.mjs';
import '../../utils/client/s3data/base.mjs';
import { getPresignedGetObjectUrl } from '../../utils/client/s3data/getObject.mjs';
import '../../utils/client/s3data/listObjectsV2.mjs';
import '../../utils/client/s3data/putObject.mjs';
import '../../utils/client/s3data/createMultipartUpload.mjs';
import '../../utils/client/s3data/uploadPart.mjs';
import '../../utils/client/s3data/completeMultipartUpload.mjs';
import '../../utils/client/s3data/listParts.mjs';
import '../../utils/client/s3data/abortMultipartUpload.mjs';
import '../../utils/client/s3data/copyObject.mjs';
import '../../utils/client/s3data/headObject.mjs';
import '../../utils/client/s3data/deleteObject.mjs';
import '@smithy/md5-js';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../utils/client/runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../../utils/client/runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { resolveS3ConfigAndInput } from '../../utils/resolveS3ConfigAndInput.mjs';
import { assertValidationError } from '../../../../errors/utils/assertValidationError.mjs';
import '../../../../utils/logger.mjs';
import { validateBucketOwnerID } from '../../utils/validateBucketOwnerID.mjs';
import { validateStorageOperationInput } from '../../utils/validateStorageOperationInput.mjs';
import { DEFAULT_PRESIGN_EXPIRATION, STORAGE_INPUT_KEY, MAX_URL_EXPIRATION } from '../../utils/constants.mjs';
import { constructContentDisposition } from '../../utils/constructContentDisposition.mjs';
import { getProperties } from './getProperties.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getUrl = async (amplify, input) => {
    const { options: getUrlOptions } = input;
    const { s3Config, keyPrefix, bucket, identityId } = await resolveS3ConfigAndInput(amplify, input);
    const { inputType, objectKey } = validateStorageOperationInput(input, identityId);
    validateBucketOwnerID(getUrlOptions?.expectedBucketOwner);
    const finalKey = inputType === STORAGE_INPUT_KEY ? keyPrefix + objectKey : objectKey;
    if (getUrlOptions?.validateObjectExistence) {
        await getProperties(amplify, input, StorageAction.GetUrl);
    }
    let urlExpirationInSec = getUrlOptions?.expiresIn ?? DEFAULT_PRESIGN_EXPIRATION;
    const resolvedCredential = typeof s3Config.credentials === 'function'
        ? await s3Config.credentials()
        : s3Config.credentials;
    const awsCredExpiration = resolvedCredential.expiration;
    if (awsCredExpiration) {
        const awsCredExpirationInSec = Math.floor((awsCredExpiration.getTime() - Date.now()) / 1000);
        urlExpirationInSec = Math.min(awsCredExpirationInSec, urlExpirationInSec);
    }
    const maxUrlExpirationInSec = MAX_URL_EXPIRATION / 1000;
    assertValidationError(urlExpirationInSec <= maxUrlExpirationInSec, StorageValidationErrorCode.UrlExpirationMaxLimitExceed);
    // expiresAt is the minimum of credential expiration and url expiration
    return {
        url: await getPresignedGetObjectUrl({
            ...s3Config,
            credentials: resolvedCredential,
            expiration: urlExpirationInSec,
        }, {
            Bucket: bucket,
            Key: finalKey,
            ...(getUrlOptions?.contentDisposition && {
                ResponseContentDisposition: constructContentDisposition(getUrlOptions.contentDisposition),
            }),
            ...(getUrlOptions?.contentType && {
                ResponseContentType: getUrlOptions.contentType,
            }),
            ExpectedBucketOwner: getUrlOptions?.expectedBucketOwner,
        }),
        expiresAt: new Date(Date.now() + urlExpirationInSec * 1000),
    };
};

export { getUrl };
//# sourceMappingURL=getUrl.mjs.map
