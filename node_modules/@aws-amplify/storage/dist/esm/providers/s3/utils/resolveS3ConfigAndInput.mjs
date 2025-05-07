import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { StorageValidationErrorCode } from '../../../errors/types/validation.mjs';
import { resolvePrefix } from '../../../utils/resolvePrefix.mjs';
import { StorageError } from '../../../errors/StorageError.mjs';
import { INVALID_STORAGE_INPUT } from '../../../errors/constants.mjs';
import { DEFAULT_ACCESS_LEVEL, LOCAL_TESTING_S3_ENDPOINT } from './constants.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * resolve the common input options for S3 API handlers from Amplify configuration and library options.
 *
 * @param {AmplifyClassV6} amplify The Amplify instance.
 * @param {S3ApiOptions} apiOptions The input options for S3 provider.
 * @returns {Promise<ResolvedS3ConfigAndInput>} The resolved common input options for S3 API handlers.
 * @throws A `StorageError` with `error.name` from `StorageValidationErrorCode` indicating invalid
 *   configurations or Amplify library options.
 *
 * @internal
 */
const resolveS3ConfigAndInput = async (amplify, apiInput) => {
    const { options: apiOptions } = apiInput ?? {};
    /**
     * IdentityId is always cached in memory so we can safely make calls here. It
     * should be stable even for unauthenticated users, regardless of credentials.
     */
    const { identityId } = await amplify.Auth.fetchAuthSession();
    /**
     * A credentials provider function instead of a static credentials object is
     * used because the long-running tasks like multipart upload may span over the
     * credentials expiry. Auth.fetchAuthSession() automatically refreshes the
     * credentials if they are expired.
     *
     * The optional forceRefresh option is set when the S3 service returns expired
     * tokens error in the previous API call attempt.
     */
    const credentialsProvider = async (options) => {
        if (isLocationCredentialsProvider(apiOptions)) {
            assertStorageInput(apiInput);
        }
        // TODO: forceRefresh option of fetchAuthSession would refresh both tokens and
        // AWS credentials. So we do not support forceRefreshing from the Auth until
        // we support refreshing only the credentials.
        const { credentials } = isLocationCredentialsProvider(apiOptions)
            ? await apiOptions.locationCredentialsProvider(options)
            : await amplify.Auth.fetchAuthSession();
        assertValidationError(!!credentials, StorageValidationErrorCode.NoCredentials);
        return credentials;
    };
    const { bucket: defaultBucket, region: defaultRegion, dangerouslyConnectToHttpEndpointForTesting, buckets, } = amplify.getConfig()?.Storage?.S3 ?? {};
    const { bucket = defaultBucket, region = defaultRegion } = (apiOptions?.bucket && resolveBucketConfig(apiOptions, buckets)) || {};
    assertValidationError(!!bucket, StorageValidationErrorCode.NoBucket);
    assertValidationError(!!region, StorageValidationErrorCode.NoRegion);
    const { defaultAccessLevel, prefixResolver = resolvePrefix, isObjectLockEnabled, } = amplify.libraryOptions?.Storage?.S3 ?? {};
    const accessLevel = apiOptions?.accessLevel ?? defaultAccessLevel ?? DEFAULT_ACCESS_LEVEL;
    const targetIdentityId = accessLevel === 'protected'
        ? (apiOptions?.targetIdentityId ?? identityId)
        : identityId;
    const keyPrefix = await prefixResolver({ accessLevel, targetIdentityId });
    return {
        s3Config: {
            credentials: credentialsProvider,
            region,
            useAccelerateEndpoint: apiOptions?.useAccelerateEndpoint,
            ...(apiOptions?.customEndpoint
                ? { customEndpoint: apiOptions.customEndpoint }
                : {}),
            ...(dangerouslyConnectToHttpEndpointForTesting
                ? {
                    customEndpoint: LOCAL_TESTING_S3_ENDPOINT,
                    forcePathStyle: true,
                }
                : {}),
        },
        bucket,
        keyPrefix,
        identityId,
        isObjectLockEnabled,
    };
};
const isLocationCredentialsProvider = (options) => {
    return !!options?.locationCredentialsProvider;
};
const isInputWithCallbackPath = (input) => {
    return ((input?.path &&
        typeof input.path === 'function') ||
        (input?.destination?.path &&
            typeof input.destination?.path === 'function') ||
        (input?.source?.path &&
            typeof input.source?.path === 'function'));
};
const isDeprecatedInput = (input) => {
    return (isInputWithKey(input) ||
        isInputWithPrefix(input) ||
        isInputWithCopySourceOrDestination(input));
};
const assertStorageInput = (input) => {
    if (isDeprecatedInput(input) || isInputWithCallbackPath(input)) {
        throw new StorageError({
            name: INVALID_STORAGE_INPUT,
            message: 'The input needs to have a path as a string value.',
            recoverySuggestion: 'Please provide a valid path as a string value for the input.',
        });
    }
};
const isInputWithKey = (input) => {
    return !!(typeof input.key === 'string');
};
const isInputWithPrefix = (input) => {
    return !!(typeof input.prefix === 'string');
};
const isInputWithCopySourceOrDestination = (input) => {
    return !!(typeof input.source?.key === 'string' ||
        typeof input.destination?.key === 'string');
};
const resolveBucketConfig = (apiOptions, buckets) => {
    if (typeof apiOptions.bucket === 'string') {
        const bucketConfig = buckets?.[apiOptions.bucket];
        assertValidationError(!!bucketConfig, StorageValidationErrorCode.InvalidStorageBucket);
        return { bucket: bucketConfig.bucketName, region: bucketConfig.region };
    }
    if (typeof apiOptions.bucket === 'object') {
        return {
            bucket: apiOptions.bucket.bucketName,
            region: apiOptions.bucket.region,
        };
    }
};

export { resolveS3ConfigAndInput };
//# sourceMappingURL=resolveS3ConfigAndInput.mjs.map
