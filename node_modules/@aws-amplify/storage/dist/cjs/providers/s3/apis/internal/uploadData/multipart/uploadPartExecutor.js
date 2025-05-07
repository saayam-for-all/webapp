'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPartExecutor = void 0;
const s3data_1 = require("../../../../utils/client/s3data");
const utils_1 = require("../../../../../../utils");
const crc32_1 = require("../../../../utils/crc32");
const utils_2 = require("../../../../utils");
const uploadPartExecutor = async ({ dataChunkerGenerator, completedPartNumberSet, s3Config, abortSignal, bucket, finalKey, uploadId, onPartUploadCompletion, onProgress, isObjectLockEnabled, useCRC32Checksum, expectedBucketOwner, }) => {
    let transferredBytes = 0;
    for (const { data, partNumber, size } of dataChunkerGenerator) {
        if (abortSignal.aborted) {
            utils_1.logger.debug('upload executor aborted.');
            break;
        }
        if (completedPartNumberSet.has(partNumber)) {
            utils_1.logger.debug(`part ${partNumber} already uploaded.`);
            transferredBytes += size;
            onProgress?.({
                transferredBytes,
            });
        }
        else {
            // handle cancel error
            let checksumCRC32;
            if (useCRC32Checksum) {
                checksumCRC32 = await (0, crc32_1.calculateContentCRC32)(data);
            }
            const contentMD5 = 
            // check if checksum exists. ex: should not exist in react native
            !checksumCRC32 && isObjectLockEnabled
                ? await (0, utils_2.calculateContentMd5)(data)
                : undefined;
            const { ETag: eTag } = await (0, s3data_1.uploadPart)({
                ...s3Config,
                abortSignal,
                onUploadProgress: (event) => {
                    const { transferredBytes: currentPartTransferredBytes } = event;
                    onProgress?.({
                        transferredBytes: transferredBytes + currentPartTransferredBytes,
                    });
                },
            }, {
                Bucket: bucket,
                Key: finalKey,
                UploadId: uploadId,
                Body: data,
                PartNumber: partNumber,
                ChecksumCRC32: checksumCRC32?.checksum,
                ContentMD5: contentMD5,
                ExpectedBucketOwner: expectedBucketOwner,
            });
            transferredBytes += size;
            // eTag will always be set even the S3 model interface marks it as optional.
            onPartUploadCompletion(partNumber, eTag, checksumCRC32?.checksum);
        }
    }
};
exports.uploadPartExecutor = uploadPartExecutor;
//# sourceMappingURL=uploadPartExecutor.js.map
