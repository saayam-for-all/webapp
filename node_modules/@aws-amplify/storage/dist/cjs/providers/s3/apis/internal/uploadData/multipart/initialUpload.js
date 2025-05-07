'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOrCreateMultipartUpload = void 0;
const s3data_1 = require("../../../../utils/client/s3data");
const utils_1 = require("../../../../../../utils");
const constructContentDisposition_1 = require("../../../../utils/constructContentDisposition");
const constants_1 = require("../../../../utils/constants");
const getCombinedCrc32_native_1 = require("../../../../utils/getCombinedCrc32.native");
const uploadCache_1 = require("./uploadCache");
/**
 * Load the in-progress multipart upload from local storage or async storage(RN) if it exists, or create a new multipart
 * upload.
 *
 * @internal
 */
const loadOrCreateMultipartUpload = async ({ s3Config, data, size, contentType, bucket, accessLevel, keyPrefix, key, contentDisposition, contentEncoding, metadata, abortSignal, checksumAlgorithm, optionsHash, resumableUploadsCache, expectedBucketOwner, }) => {
    const finalKey = keyPrefix !== undefined ? keyPrefix + key : key;
    let cachedUpload;
    if (!resumableUploadsCache) {
        utils_1.logger.debug('uploaded cache instance cannot be determined, skipping cache.');
        cachedUpload = undefined;
    }
    else {
        const uploadCacheKey = (0, uploadCache_1.getUploadsCacheKey)({
            size,
            contentType,
            file: data instanceof File ? data : undefined,
            bucket,
            accessLevel,
            key,
            optionsHash,
        });
        const cachedUploadParts = await (0, uploadCache_1.findCachedUploadParts)({
            s3Config,
            cacheKey: uploadCacheKey,
            bucket,
            finalKey,
            resumableUploadsCache,
        });
        cachedUpload = cachedUploadParts
            ? { ...cachedUploadParts, uploadCacheKey }
            : undefined;
    }
    if (cachedUpload) {
        return {
            uploadId: cachedUpload.uploadId,
            cachedParts: cachedUpload.parts,
            finalCrc32: cachedUpload.finalCrc32,
        };
    }
    else {
        const finalCrc32 = checksumAlgorithm === constants_1.CHECKSUM_ALGORITHM_CRC32
            ? await (0, getCombinedCrc32_native_1.getCombinedCrc32)(data, size)
            : undefined;
        const { UploadId } = await (0, s3data_1.createMultipartUpload)({
            ...s3Config,
            abortSignal,
        }, {
            Bucket: bucket,
            Key: finalKey,
            ContentType: contentType,
            ContentDisposition: (0, constructContentDisposition_1.constructContentDisposition)(contentDisposition),
            ContentEncoding: contentEncoding,
            Metadata: metadata,
            ChecksumAlgorithm: finalCrc32 ? 'CRC32' : undefined,
            ExpectedBucketOwner: expectedBucketOwner,
        });
        if (resumableUploadsCache) {
            const uploadCacheKey = (0, uploadCache_1.getUploadsCacheKey)({
                size,
                contentType,
                file: data instanceof File ? data : undefined,
                bucket,
                accessLevel,
                key,
                optionsHash,
            });
            await (0, uploadCache_1.cacheMultipartUpload)(resumableUploadsCache, uploadCacheKey, {
                uploadId: UploadId,
                bucket,
                key,
                finalCrc32,
                fileName: data instanceof File ? data.name : '',
            });
        }
        return {
            uploadId: UploadId,
            cachedParts: [],
            finalCrc32,
        };
    }
};
exports.loadOrCreateMultipartUpload = loadOrCreateMultipartUpload;
//# sourceMappingURL=initialUpload.js.map
