import '../../../../utils/client/s3data/base.mjs';
import '../../../../utils/client/s3data/getObject.mjs';
import '../../../../utils/client/s3data/listObjectsV2.mjs';
import '../../../../utils/client/s3data/putObject.mjs';
import '../../../../utils/client/s3data/createMultipartUpload.mjs';
import { uploadPart } from '../../../../utils/client/s3data/uploadPart.mjs';
import '../../../../utils/client/s3data/completeMultipartUpload.mjs';
import '../../../../utils/client/s3data/listParts.mjs';
import '../../../../utils/client/s3data/abortMultipartUpload.mjs';
import '../../../../utils/client/s3data/copyObject.mjs';
import '../../../../utils/client/s3data/headObject.mjs';
import '../../../../utils/client/s3data/deleteObject.mjs';
import '../../../../../../errors/types/validation.mjs';
import '@aws-amplify/core/internals/utils';
import { logger } from '../../../../../../utils/logger.mjs';
import { calculateContentCRC32 } from '../../../../utils/crc32.mjs';
import { calculateContentMd5 } from '../../../../utils/md5.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const uploadPartExecutor = async ({ dataChunkerGenerator, completedPartNumberSet, s3Config, abortSignal, bucket, finalKey, uploadId, onPartUploadCompletion, onProgress, isObjectLockEnabled, useCRC32Checksum, expectedBucketOwner, }) => {
    let transferredBytes = 0;
    for (const { data, partNumber, size } of dataChunkerGenerator) {
        if (abortSignal.aborted) {
            logger.debug('upload executor aborted.');
            break;
        }
        if (completedPartNumberSet.has(partNumber)) {
            logger.debug(`part ${partNumber} already uploaded.`);
            transferredBytes += size;
            onProgress?.({
                transferredBytes,
            });
        }
        else {
            // handle cancel error
            let checksumCRC32;
            if (useCRC32Checksum) {
                checksumCRC32 = await calculateContentCRC32(data);
            }
            const contentMD5 = 
            // check if checksum exists. ex: should not exist in react native
            !checksumCRC32 && isObjectLockEnabled
                ? await calculateContentMd5(data)
                : undefined;
            const { ETag: eTag } = await uploadPart({
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

export { uploadPartExecutor };
//# sourceMappingURL=uploadPartExecutor.mjs.map
