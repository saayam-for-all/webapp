import { AmplifyClassV6, StorageAccessLevel } from '@aws-amplify/core';
import { StorageOperationInputWithKey, StorageOperationInputWithPath, StorageOperationInputWithPrefix } from '../../../types/inputs';
import { CopyInput, CopyWithPathInput } from '../types';
import { LocationCredentialsProvider, ResolvedS3Config, StorageBucket } from '../types/options';
interface S3ApiOptions {
    accessLevel?: StorageAccessLevel;
    targetIdentityId?: string;
    useAccelerateEndpoint?: boolean;
    locationCredentialsProvider?: LocationCredentialsProvider;
    customEndpoint?: string;
    bucket?: StorageBucket;
}
interface ResolvedS3ConfigAndInput {
    s3Config: ResolvedS3Config;
    bucket: string;
    keyPrefix: string;
    isObjectLockEnabled?: boolean;
    identityId?: string;
}
export type DeprecatedStorageInput = StorageOperationInputWithKey | StorageOperationInputWithPrefix | CopyInput;
export type CallbackPathStorageInput = StorageOperationInputWithPath | CopyWithPathInput;
type StorageInput = DeprecatedStorageInput | CallbackPathStorageInput;
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
export declare const resolveS3ConfigAndInput: (amplify: AmplifyClassV6, apiInput?: StorageInput & {
    options?: S3ApiOptions;
}) => Promise<ResolvedS3ConfigAndInput>;
export {};
