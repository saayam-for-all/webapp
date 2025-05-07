'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const utils_2 = require("../../utils");
const s3data_1 = require("../../utils/client/s3data");
const userAgent_1 = require("../../utils/userAgent");
const utils_3 = require("../../../../utils");
const constants_1 = require("../../utils/constants");
const remove = async (amplify, input) => {
    const { s3Config, keyPrefix, bucket, identityId } = await (0, utils_2.resolveS3ConfigAndInput)(amplify, input);
    const { inputType, objectKey } = (0, utils_2.validateStorageOperationInput)(input, identityId);
    (0, utils_2.validateBucketOwnerID)(input.options?.expectedBucketOwner);
    let finalKey;
    if (inputType === constants_1.STORAGE_INPUT_KEY) {
        finalKey = `${keyPrefix}${objectKey}`;
        utils_3.logger.debug(`remove "${objectKey}" from "${finalKey}".`);
    }
    else {
        finalKey = objectKey;
        utils_3.logger.debug(`removing object in path "${finalKey}"`);
    }
    await (0, s3data_1.deleteObject)({
        ...s3Config,
        userAgentValue: (0, userAgent_1.getStorageUserAgentValue)(utils_1.StorageAction.Remove),
    }, {
        Bucket: bucket,
        Key: finalKey,
        ExpectedBucketOwner: input.options?.expectedBucketOwner,
    });
    return inputType === constants_1.STORAGE_INPUT_KEY
        ? {
            key: objectKey,
        }
        : {
            path: objectKey,
        };
};
exports.remove = remove;
//# sourceMappingURL=remove.js.map
