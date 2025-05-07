'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadData = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const resolveS3ConfigAndInput_1 = require("../../utils/resolveS3ConfigAndInput");
const utils_2 = require("../../utils");
const s3data_1 = require("../../utils/client/s3data");
const userAgent_1 = require("../../utils/userAgent");
const utils_3 = require("../../../../utils");
const constants_1 = require("../../utils/constants");
const downloadData = (input) => {
    const abortController = new AbortController();
    const downloadTask = (0, utils_2.createDownloadTask)({
        job: downloadDataJob(input, abortController.signal),
        onCancel: (message) => {
            abortController.abort(message);
        },
    });
    return downloadTask;
};
exports.downloadData = downloadData;
const downloadDataJob = (downloadDataInput, abortSignal) => async () => {
    const { options: downloadDataOptions } = downloadDataInput;
    const { bucket, keyPrefix, s3Config, identityId } = await (0, resolveS3ConfigAndInput_1.resolveS3ConfigAndInput)(core_1.Amplify, downloadDataInput);
    const { inputType, objectKey } = (0, utils_2.validateStorageOperationInput)(downloadDataInput, identityId);
    (0, utils_2.validateBucketOwnerID)(downloadDataOptions?.expectedBucketOwner);
    const finalKey = inputType === constants_1.STORAGE_INPUT_KEY ? keyPrefix + objectKey : objectKey;
    utils_3.logger.debug(`download ${objectKey} from ${finalKey}.`);
    const { Body: body, LastModified: lastModified, ContentLength: size, ETag: eTag, Metadata: metadata, VersionId: versionId, ContentType: contentType, } = await (0, s3data_1.getObject)({
        ...s3Config,
        abortSignal,
        onDownloadProgress: downloadDataOptions?.onProgress,
        userAgentValue: (0, userAgent_1.getStorageUserAgentValue)(utils_1.StorageAction.DownloadData),
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
    return inputType === constants_1.STORAGE_INPUT_KEY
        ? { key: objectKey, ...result }
        : { path: objectKey, ...result };
};
//# sourceMappingURL=downloadData.js.map
