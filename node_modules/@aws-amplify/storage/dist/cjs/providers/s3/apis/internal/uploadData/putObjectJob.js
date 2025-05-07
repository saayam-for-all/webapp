'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.putObjectJob = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const utils_2 = require("../../../utils");
const s3data_1 = require("../../../utils/client/s3data");
const userAgent_1 = require("../../../utils/userAgent");
const constants_1 = require("../../../utils/constants");
const crc32_1 = require("../../../utils/crc32");
const constructContentDisposition_1 = require("../../../utils/constructContentDisposition");
/**
 * Get a function the returns a promise to call putObject API to S3.
 *
 * @internal
 */
const putObjectJob = (uploadDataInput, abortSignal, totalLength) => async () => {
    const { options: uploadDataOptions, data } = uploadDataInput;
    const { bucket, keyPrefix, s3Config, isObjectLockEnabled, identityId } = await (0, utils_2.resolveS3ConfigAndInput)(core_1.Amplify, uploadDataInput);
    const { inputType, objectKey } = (0, utils_2.validateStorageOperationInput)(uploadDataInput, identityId);
    (0, utils_2.validateBucketOwnerID)(uploadDataOptions?.expectedBucketOwner);
    const finalKey = inputType === constants_1.STORAGE_INPUT_KEY ? keyPrefix + objectKey : objectKey;
    const { contentDisposition, contentEncoding, contentType = 'application/octet-stream', preventOverwrite, metadata, checksumAlgorithm, onProgress, expectedBucketOwner, } = uploadDataOptions ?? {};
    const checksumCRC32 = checksumAlgorithm === constants_1.CHECKSUM_ALGORITHM_CRC32
        ? await (0, crc32_1.calculateContentCRC32)(data)
        : undefined;
    const contentMD5 = 
    // check if checksum exists. ex: should not exist in react native
    !checksumCRC32 && isObjectLockEnabled
        ? await (0, utils_2.calculateContentMd5)(data)
        : undefined;
    const { ETag: eTag, VersionId: versionId } = await (0, s3data_1.putObject)({
        ...s3Config,
        abortSignal,
        onUploadProgress: onProgress,
        userAgentValue: (0, userAgent_1.getStorageUserAgentValue)(utils_1.StorageAction.UploadData),
    }, {
        Bucket: bucket,
        Key: finalKey,
        Body: data,
        ContentType: contentType,
        ContentDisposition: (0, constructContentDisposition_1.constructContentDisposition)(contentDisposition),
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
    return inputType === constants_1.STORAGE_INPUT_KEY
        ? { key: objectKey, ...result }
        : { path: objectKey, ...result };
};
exports.putObjectJob = putObjectJob;
//# sourceMappingURL=putObjectJob.js.map
