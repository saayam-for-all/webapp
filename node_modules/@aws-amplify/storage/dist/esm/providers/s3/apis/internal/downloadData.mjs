import { Amplify } from '@aws-amplify/core';
import { StorageAction } from '@aws-amplify/core/internals/utils';
import { resolveS3ConfigAndInput } from '../../utils/resolveS3ConfigAndInput.mjs';
import '@smithy/md5-js';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../utils/client/runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../../utils/client/runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { createDownloadTask } from '../../utils/transferTask.mjs';
import { validateBucketOwnerID } from '../../utils/validateBucketOwnerID.mjs';
import { validateStorageOperationInput } from '../../utils/validateStorageOperationInput.mjs';
import '../../../../errors/types/validation.mjs';
import { STORAGE_INPUT_KEY } from '../../utils/constants.mjs';
import '../../utils/client/s3data/base.mjs';
import { getObject } from '../../utils/client/s3data/getObject.mjs';
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
import { getStorageUserAgentValue } from '../../utils/userAgent.mjs';
import { logger } from '../../../../utils/logger.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const downloadData = (input) => {
    const abortController = new AbortController();
    const downloadTask = createDownloadTask({
        job: downloadDataJob(input, abortController.signal),
        onCancel: (message) => {
            abortController.abort(message);
        },
    });
    return downloadTask;
};
const downloadDataJob = (downloadDataInput, abortSignal) => async () => {
    const { options: downloadDataOptions } = downloadDataInput;
    const { bucket, keyPrefix, s3Config, identityId } = await resolveS3ConfigAndInput(Amplify, downloadDataInput);
    const { inputType, objectKey } = validateStorageOperationInput(downloadDataInput, identityId);
    validateBucketOwnerID(downloadDataOptions?.expectedBucketOwner);
    const finalKey = inputType === STORAGE_INPUT_KEY ? keyPrefix + objectKey : objectKey;
    logger.debug(`download ${objectKey} from ${finalKey}.`);
    const { Body: body, LastModified: lastModified, ContentLength: size, ETag: eTag, Metadata: metadata, VersionId: versionId, ContentType: contentType, } = await getObject({
        ...s3Config,
        abortSignal,
        onDownloadProgress: downloadDataOptions?.onProgress,
        userAgentValue: getStorageUserAgentValue(StorageAction.DownloadData),
    }, {
        Bucket: bucket,
        Key: finalKey,
        ...(downloadDataOptions?.bytesRange && {
            Range: `bytes=${downloadDataOptions.bytesRange.start}-${downloadDataOptions.bytesRange.end}`,
        }),
        ExpectedBucketOwner: downloadDataOptions?.expectedBucketOwner,
    });
    const result = {
        body,
        lastModified,
        size,
        contentType,
        eTag,
        metadata,
        versionId,
    };
    return inputType === STORAGE_INPUT_KEY
        ? { key: objectKey, ...result }
        : { path: objectKey, ...result };
};

export { downloadData };
//# sourceMappingURL=downloadData.mjs.map
