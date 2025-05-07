'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrl = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const validation_1 = require("../../../../errors/types/validation");
const s3data_1 = require("../../utils/client/s3data");
const utils_2 = require("../../utils");
const assertValidationError_1 = require("../../../../errors/utils/assertValidationError");
const constants_1 = require("../../utils/constants");
const constructContentDisposition_1 = require("../../utils/constructContentDisposition");
const getProperties_1 = require("./getProperties");
const getUrl = async (amplify, input) => {
    const { options: getUrlOptions } = input;
    const { s3Config, keyPrefix, bucket, identityId } = await (0, utils_2.resolveS3ConfigAndInput)(amplify, input);
    const { inputType, objectKey } = (0, utils_2.validateStorageOperationInput)(input, identityId);
    (0, utils_2.validateBucketOwnerID)(getUrlOptions?.expectedBucketOwner);
    const finalKey = inputType === constants_1.STORAGE_INPUT_KEY ? keyPrefix + objectKey : objectKey;
    if (getUrlOptions?.validateObjectExistence) {
        await (0, getProperties_1.getProperties)(amplify, input, utils_1.StorageAction.GetUrl);
    }
    let urlExpirationInSec = getUrlOptions?.expiresIn ?? constants_1.DEFAULT_PRESIGN_EXPIRATION;
    const resolvedCredential = typeof s3Config.credentials === 'function'
        ? await s3Config.credentials()
        : s3Config.credentials;
    const awsCredExpiration = resolvedCredential.expiration;
    if (awsCredExpiration) {
        const awsCredExpirationInSec = Math.floor((awsCredExpiration.getTime() - Date.now()) / 1000);
        urlExpirationInSec = Math.min(awsCredExpirationInSec, urlExpirationInSec);
    }
    const maxUrlExpirationInSec = constants_1.MAX_URL_EXPIRATION / 1000;
    (0, assertValidationError_1.assertValidationError)(urlExpirationInSec <= maxUrlExpirationInSec, validation_1.StorageValidationErrorCode.UrlExpirationMaxLimitExceed);
    // expiresAt is the minimum of credential expiration and url expiration
    return {
        url: await (0, s3data_1.getPresignedGetObjectUrl)({
            ...s3Config,
            credentials: resolvedCredential,
            expiration: urlExpirationInSec,
        }, {
            Bucket: bucket,
            Key: finalKey,
            ...(getUrlOptions?.contentDisposition && {
                ResponseContentDisposition: (0, constructContentDisposition_1.constructContentDisposition)(getUrlOptions.contentDisposition),
            }),
            ...(getUrlOptions?.contentType && {
                ResponseContentType: getUrlOptions.contentType,
            }),
            ExpectedBucketOwner: getUrlOptions?.expectedBucketOwner,
        }),
        expiresAt: new Date(Date.now() + urlExpirationInSec * 1000),
    };
};
exports.getUrl = getUrl;
//# sourceMappingURL=getUrl.js.map
