'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProperties = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const utils_2 = require("../../utils");
const s3data_1 = require("../../utils/client/s3data");
const userAgent_1 = require("../../utils/userAgent");
const utils_3 = require("../../../../utils");
const constants_1 = require("../../utils/constants");
const getProperties = async (amplify, input, action) => {
    const { s3Config, bucket, keyPrefix, identityId } = await (0, utils_2.resolveS3ConfigAndInput)(amplify, input);
    const { inputType, objectKey } = (0, utils_2.validateStorageOperationInput)(input, identityId);
    (0, utils_2.validateBucketOwnerID)(input.options?.expectedBucketOwner);
    const finalKey = inputType === constants_1.STORAGE_INPUT_KEY ? keyPrefix + objectKey : objectKey;
    utils_3.logger.debug(`get properties of ${objectKey} from ${finalKey}`);
    const response = await (0, s3data_1.headObject)({
        ...s3Config,
        userAgentValue: (0, userAgent_1.getStorageUserAgentValue)(action ?? utils_1.StorageAction.GetProperties),
    }, {
        Bucket: bucket,
        Key: finalKey,
        ExpectedBucketOwner: input.options?.expectedBucketOwner,
    });
    const result = {
        contentType: response.ContentType,
        size: response.ContentLength,
        eTag: response.ETag,
        lastModified: response.LastModified,
        metadata: response.Metadata,
        versionId: response.VersionId,
    };
    return inputType === constants_1.STORAGE_INPUT_KEY
        ? { key: objectKey, ...result }
        : { path: objectKey, ...result };
};
exports.getProperties = getProperties;
//# sourceMappingURL=getProperties.js.map
