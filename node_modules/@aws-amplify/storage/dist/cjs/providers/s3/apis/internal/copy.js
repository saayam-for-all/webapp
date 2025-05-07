'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyWithKey = exports.copy = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const utils_2 = require("../../utils");
const validation_1 = require("../../../../errors/types/validation");
const assertValidationError_1 = require("../../../../errors/utils/assertValidationError");
const s3data_1 = require("../../utils/client/s3data");
const userAgent_1 = require("../../utils/userAgent");
const utils_3 = require("../../../../utils");
const isCopyInputWithPath = (input) => (0, utils_2.isInputWithPath)(input.source);
const storageBucketAssertion = (sourceBucket, destBucket) => {
    /**  For multi-bucket, both source and destination bucket needs to be passed in
     *   or both can be undefined and we fallback to singleton's default value
     */
    (0, assertValidationError_1.assertValidationError)(
    // Both src & dest bucket option is present is acceptable
    (sourceBucket !== undefined && destBucket !== undefined) ||
        // or both are undefined is also acceptable
        (!destBucket && !sourceBucket), validation_1.StorageValidationErrorCode.InvalidCopyOperationStorageBucket);
};
const copy = async (amplify, input) => {
    return isCopyInputWithPath(input)
        ? copyWithPath(amplify, input)
        : (0, exports.copyWithKey)(amplify, input);
};
exports.copy = copy;
const copyWithPath = async (amplify, input) => {
    const { source, destination } = input;
    storageBucketAssertion(source.bucket, destination.bucket);
    const { bucket: sourceBucket } = await (0, utils_2.resolveS3ConfigAndInput)(amplify, {
        path: input.source.path,
        options: {
            locationCredentialsProvider: input.options?.locationCredentialsProvider,
            ...input.source,
        },
    });
    // The bucket, region, credentials of s3 client are resolved from destination.
    // Whereas the source bucket and path are a input parameter of S3 copy operation.
    const { s3Config, bucket: destBucket, identityId, } = await (0, utils_2.resolveS3ConfigAndInput)(amplify, {
        path: input.destination.path,
        options: {
            locationCredentialsProvider: input.options?.locationCredentialsProvider,
            customEndpoint: input.options?.customEndpoint,
            ...input.destination,
        },
    }); // resolveS3ConfigAndInput does not make extra API calls or storage access if called repeatedly.
    (0, assertValidationError_1.assertValidationError)(!!source.path, validation_1.StorageValidationErrorCode.NoSourcePath);
    (0, assertValidationError_1.assertValidationError)(!!destination.path, validation_1.StorageValidationErrorCode.NoDestinationPath);
    const { objectKey: sourcePath } = (0, utils_2.validateStorageOperationInput)(source, identityId);
    const { objectKey: destinationPath } = (0, utils_2.validateStorageOperationInput)(destination, identityId);
    (0, utils_2.validateBucketOwnerID)(source.expectedBucketOwner);
    (0, utils_2.validateBucketOwnerID)(destination.expectedBucketOwner);
    const finalCopySource = `${sourceBucket}/${sourcePath}`;
    const finalCopyDestination = destinationPath;
    utils_3.logger.debug(`copying "${finalCopySource}" to "${finalCopyDestination}".`);
    await serviceCopy({
        source: finalCopySource,
        destination: finalCopyDestination,
        bucket: destBucket,
        s3Config,
        notModifiedSince: input.source.notModifiedSince,
        eTag: input.source.eTag,
        expectedSourceBucketOwner: input.source?.expectedBucketOwner,
        expectedBucketOwner: input.destination?.expectedBucketOwner,
    });
    return { path: finalCopyDestination };
};
/** @deprecated Use {@link copyWithPath} instead. */
const copyWithKey = async (amplify, input) => {
    const { source, destination } = input;
    storageBucketAssertion(source.bucket, destination.bucket);
    (0, assertValidationError_1.assertValidationError)(!!source.key, validation_1.StorageValidationErrorCode.NoSourceKey);
    (0, assertValidationError_1.assertValidationError)(!!destination.key, validation_1.StorageValidationErrorCode.NoDestinationKey);
    (0, utils_2.validateBucketOwnerID)(source.expectedBucketOwner);
    (0, utils_2.validateBucketOwnerID)(destination.expectedBucketOwner);
    const { bucket: sourceBucket, keyPrefix: sourceKeyPrefix } = await (0, utils_2.resolveS3ConfigAndInput)(amplify, {
        ...input,
        options: {
            // @ts-expect-error: 'options' does not exist on type 'CopyInput'. In case of JS users set the location
            // credentials provider option, resolveS3ConfigAndInput will throw validation error.
            locationCredentialsProvider: input.options?.locationCredentialsProvider,
            ...input.source,
        },
    });
    // The bucket, region, credentials of s3 client are resolved from destination.
    // Whereas the source bucket and path are a input parameter of S3 copy operation.
    const { s3Config, bucket: destBucket, keyPrefix: destinationKeyPrefix, } = await (0, utils_2.resolveS3ConfigAndInput)(amplify, {
        ...input,
        options: {
            // @ts-expect-error: 'options' does not exist on type 'CopyInput'. In case of JS users set the location
            // credentials provider option, resolveS3ConfigAndInput will throw validation error.
            locationCredentialsProvider: input.options?.locationCredentialsProvider,
            ...input.destination,
        },
    }); // resolveS3ConfigAndInput does not make extra API calls or storage access if called repeatedly.
    // TODO(ashwinkumar6) V6-logger: warn `You may copy files from another user if the source level is "protected", currently it's ${srcLevel}`
    const finalCopySource = `${sourceBucket}/${sourceKeyPrefix}${source.key}`;
    const finalCopyDestination = `${destinationKeyPrefix}${destination.key}`;
    utils_3.logger.debug(`copying "${finalCopySource}" to "${finalCopyDestination}".`);
    await serviceCopy({
        source: finalCopySource,
        destination: finalCopyDestination,
        bucket: destBucket,
        s3Config,
        notModifiedSince: input.source.notModifiedSince,
        eTag: input.source.eTag,
        expectedSourceBucketOwner: input.source?.expectedBucketOwner,
        expectedBucketOwner: input.destination?.expectedBucketOwner,
    });
    return {
        key: destination.key,
    };
};
exports.copyWithKey = copyWithKey;
const serviceCopy = async ({ source, destination, bucket, s3Config, notModifiedSince, eTag, expectedSourceBucketOwner, expectedBucketOwner, }) => {
    await (0, s3data_1.copyObject)({
        ...s3Config,
        userAgentValue: (0, userAgent_1.getStorageUserAgentValue)(utils_1.StorageAction.Copy),
    }, {
        Bucket: bucket,
        CopySource: source,
        Key: destination,
        MetadataDirective: 'COPY',
        CopySourceIfMatch: eTag,
        CopySourceIfUnmodifiedSince: notModifiedSince,
        ExpectedSourceBucketOwner: expectedSourceBucketOwner,
        ExpectedBucketOwner: expectedBucketOwner,
    });
};
//# sourceMappingURL=copy.js.map
