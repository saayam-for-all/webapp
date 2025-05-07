import { KeyValueStorageInterface } from '@aws-amplify/core';
import { UploadDataInput } from '../../../../types';
import { UploadDataInput as UploadDataWithPathInputWithAdvancedOptions } from '../../../../../../internals/types/inputs';
import { ItemWithKey, ItemWithPath } from '../../../../types/outputs';
import { StorageOperationOptionsInput } from '../../../../../../types/inputs';
type WithResumableCacheConfig<Input extends StorageOperationOptionsInput<any>> = Input & {
    options?: Input['options'] & {
        /**
         * The cache instance to store the in-progress multipart uploads so they can be resumed
         * after page refresh. By default the library caches the uploaded file name,
         * last modified, final checksum, size, bucket, key, and corresponded in-progress
         * multipart upload ID from S3. If the library detects the same input corresponds to a
         * previously in-progress upload from within 1 hour ago, it will continue
         * the upload from where it left.
         *
         * By default, this option is not set. The upload caching is disabled.
         */
        resumableUploadsCache?: KeyValueStorageInterface;
    };
};
/**
 * The input interface for UploadData API with the options needed for multi-part upload.
 * It supports both legacy Gen 1 input with key and Gen2 input with path. It also support additional
 * advanced options for StorageBrowser.
 *
 * @internal
 */
export type MultipartUploadDataInput = WithResumableCacheConfig<UploadDataInput | UploadDataWithPathInputWithAdvancedOptions>;
/**
 * Create closure hiding the multipart upload implementation details and expose the upload job and control functions(
 * onPause, onResume, onCancel).
 *
 * @internal
 */
export declare const getMultipartUploadHandlers: (uploadDataInput: MultipartUploadDataInput, size: number) => {
    multipartUploadJob: () => Promise<ItemWithKey | ItemWithPath>;
    onPause: () => void;
    onResume: () => void;
    onCancel: (message?: string) => void;
};
export {};
