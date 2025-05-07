import { StorageAction } from '@aws-amplify/core/internals/utils';
import '@smithy/md5-js';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../utils/client/runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../../utils/client/runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { resolveS3ConfigAndInput } from '../../utils/resolveS3ConfigAndInput.mjs';
import { assertValidationError } from '../../../../errors/utils/assertValidationError.mjs';
import { StorageValidationErrorCode } from '../../../../errors/types/validation.mjs';
import { logger } from '../../../../utils/logger.mjs';
import { validateBucketOwnerID } from '../../utils/validateBucketOwnerID.mjs';
import { validateStorageOperationInput } from '../../utils/validateStorageOperationInput.mjs';
import { isInputWithPath } from '../../utils/isInputWithPath.mjs';
import '../../utils/client/s3data/base.mjs';
import '../../utils/client/s3data/getObject.mjs';
import '../../utils/client/s3data/listObjectsV2.mjs';
import '../../utils/client/s3data/putObject.mjs';
import '../../utils/client/s3data/createMultipartUpload.mjs';
import '../../utils/client/s3data/uploadPart.mjs';
import '../../utils/client/s3data/completeMultipartUpload.mjs';
import '../../utils/client/s3data/listParts.mjs';
import '../../utils/client/s3data/abortMultipartUpload.mjs';
import { copyObject } from '../../utils/client/s3data/copyObject.mjs';
import '../../utils/client/s3data/headObject.mjs';
import '../../utils/client/s3data/deleteObject.mjs';
import { getStorageUserAgentValue } from '../../utils/userAgent.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const isCopyInputWithPath = (input) => isInputWithPath(input.source);
const storageBucketAssertion = (sourceBucket, destBucket) => {
    /**  For multi-bucket, both source and destination bucket needs to be passed in
     *   or both can be undefined and we fallback to singleton's default value
     */
    assertValidationError(
    // Both src & dest bucket option is present is acceptable
    (sourceBucket !== undefined && destBucket !== undefined) ||
        // or both are undefined is also acceptable
        (!destBucket && !sourceBucket), StorageValidationErrorCode.InvalidCopyOperationStorageBucket);
};
const copy = async (amplify, input) => {
    return isCopyInputWithPath(input)
        ? copyWithPath(amplify, input)
        : copyWithKey(amplify, input);
};
const copyWithPath = async (amplify, input) => {
    const { source, destination } = input;
    storageBucketAssertion(source.bucket, destination.bucket);
    const { bucket: sourceBucket } = await resolveS3ConfigAndInput(amplify, {
        path: input.source.path,
        options: {
            locationCredentialsProvider: input.options?.locationCredentialsProvider,
            ...input.source,
        },
    });
    // The bucket, region, credentials of s3 client are resolved from destination.
    // Whereas the source bucket and path are a input parameter of S3 copy operation.
    const { s3Config, bucket: destBucket, identityId, } = await resolveS3ConfigAndInput(amplify, {
        path: input.destination.path,
        options: {
            locationCredentialsProvider: input.options?.locationCredentialsProvider,
            customEndpoint: input.options?.customEndpoint,
            ...input.destination,
        },
    }); // resolveS3ConfigAndInput does not make extra API calls or storage access if called repeatedly.
    assertValidationError(!!source.path, StorageValidationErrorCode.NoSourcePath);
    assertValidationError(!!destination.path, StorageValidationErrorCode.NoDestinationPath);
    const { objectKey: sourcePath } = validateStorageOperationInput(source, identityId);
    const { objectKey: destinationPath } = validateStorageOperationInput(destination, identityId);
    validateBucketOwnerID(source.expectedBucketOwner);
    validateBucketOwnerID(destination.expectedBucketOwner);
    const finalCopySource = `${sourceBucket}/${sourcePath}`;
    const finalCopyDestination = destinationPath;
    logger.debug(`copying "${finalCopySource}" to "${finalCopyDestination}".`);
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
    assertValidationError(!!source.key, StorageValidationErrorCode.NoSourceKey);
    assertValidationError(!!destination.key, StorageValidationErrorCode.NoDestinationKey);
    validateBucketOwnerID(source.expectedBucketOwner);
    validateBucketOwnerID(destination.expectedBucketOwner);
    const { bucket: sourceBucket, keyPrefix: sourceKeyPrefix } = await resolveS3ConfigAndInput(amplify, {
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
    const { s3Config, bucket: destBucket, keyPrefix: destinationKeyPrefix, } = await resolveS3ConfigAndInput(amplify, {
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
    logger.debug(`copying "${finalCopySource}" to "${finalCopyDestination}".`);
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
const serviceCopy = async ({ source, destination, bucket, s3Config, notModifiedSince, eTag, expectedSourceBucketOwner, expectedBucketOwner, }) => {
    await copyObject({
        ...s3Config,
        userAgentValue: getStorageUserAgentValue(StorageAction.Copy),
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

export { copy, copyWithKey };
//# sourceMappingURL=copy.mjs.map
