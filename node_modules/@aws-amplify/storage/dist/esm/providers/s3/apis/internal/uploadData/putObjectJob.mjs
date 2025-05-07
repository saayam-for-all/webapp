import { Amplify } from '@aws-amplify/core';
import { StorageAction } from '@aws-amplify/core/internals/utils';
import { calculateContentMd5 } from '../../../utils/md5.mjs';
import { resolveS3ConfigAndInput } from '../../../utils/resolveS3ConfigAndInput.mjs';
import '../../../../../errors/types/validation.mjs';
import '../../../../../utils/logger.mjs';
import { validateBucketOwnerID } from '../../../utils/validateBucketOwnerID.mjs';
import { validateStorageOperationInput } from '../../../utils/validateStorageOperationInput.mjs';
import { CHECKSUM_ALGORITHM_CRC32, STORAGE_INPUT_KEY } from '../../../utils/constants.mjs';
import '../../../utils/client/s3data/base.mjs';
import '../../../utils/client/s3data/getObject.mjs';
import '../../../utils/client/s3data/listObjectsV2.mjs';
import { putObject } from '../../../utils/client/s3data/putObject.mjs';
import '../../../utils/client/s3data/createMultipartUpload.mjs';
import '../../../utils/client/s3data/uploadPart.mjs';
import '../../../utils/client/s3data/completeMultipartUpload.mjs';
import '../../../utils/client/s3data/listParts.mjs';
import '../../../utils/client/s3data/abortMultipartUpload.mjs';
import '../../../utils/client/s3data/copyObject.mjs';
import '../../../utils/client/s3data/headObject.mjs';
import '../../../utils/client/s3data/deleteObject.mjs';
import { getStorageUserAgentValue } from '../../../utils/userAgent.mjs';
import { calculateContentCRC32 } from '../../../utils/crc32.mjs';
import { constructContentDisposition } from '../../../utils/constructContentDisposition.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Get a function the returns a promise to call putObject API to S3.
 *
 * @internal
 */
const putObjectJob = (uploadDataInput, abortSignal, totalLength) => async () => {
    const { options: uploadDataOptions, data } = uploadDataInput;
    const { bucket, keyPrefix, s3Config, isObjectLockEnabled, identityId } = await resolveS3ConfigAndInput(Amplify, uploadDataInput);
    const { inputType, objectKey } = validateStorageOperationInput(uploadDataInput, identityId);
    validateBucketOwnerID(uploadDataOptions?.expectedBucketOwner);
    const finalKey = inputType === STORAGE_INPUT_KEY ? keyPrefix + objectKey : objectKey;
    const { contentDisposition, contentEncoding, contentType = 'application/octet-stream', preventOverwrite, metadata, checksumAlgorithm, onProgress, expectedBucketOwner, } = uploadDataOptions ?? {};
    const checksumCRC32 = checksumAlgorithm === CHECKSUM_ALGORITHM_CRC32
        ? await calculateContentCRC32(data)
        : undefined;
    const contentMD5 = 
    // check if checksum exists. ex: should not exist in react native
    !checksumCRC32 && isObjectLockEnabled
        ? await calculateContentMd5(data)
        : undefined;
    const { ETag: eTag, VersionId: versionId } = await putObject({
        ...s3Config,
        abortSignal,
        onUploadProgress: onProgress,
        userAgentValue: getStorageUserAgentValue(StorageAction.UploadData),
    }, {
        Bucket: bucket,
        Key: finalKey,
        Body: data,
        ContentType: contentType,
        ContentDisposition: constructContentDisposition(contentDisposition),
        ContentEncoding: contentEncoding,
        Metadata: metadata,
        ContentMD5: contentMD5,
        ChecksumCRC32: checksumCRC32?.checksum,
        ExpectedBucketOwner: expectedBucketOwner,
        IfNoneMatch: preventOverwrite ? '*' : undefined,
    });
    const result = {
        eTag,
        versionId,
        contentType,
        metadata,
        size: totalLength,
    };
    return inputType === STORAGE_INPUT_KEY
        ? { key: objectKey, ...result }
        : { path: objectKey, ...result };
};

export { putObjectJob };
//# sourceMappingURL=putObjectJob.mjs.map
