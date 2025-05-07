import { RemoveInput, RemoveOutput, RemoveWithPathInput, RemoveWithPathOutput } from '../types';
/**
 * Remove a file from your S3 bucket.
 * @param input - The `RemoveWithPathInput` object.
 * @return Output containing the removed object path.
 * @throws service: `S3Exception` - S3 service errors thrown while while removing the object.
 * @throws validation: `StorageValidationErrorCode` - Validation errors thrown
 * when there is no path or path is empty or path has a leading slash.
 */
export declare function remove(input: RemoveWithPathInput): Promise<RemoveWithPathOutput>;
/**
 * @deprecated The `key` and `accessLevel` parameters are deprecated and may be removed in the next major version.
 * Please use {@link https://docs.amplify.aws/react/build-a-backend/storage/remove | path} instead.
 *
 * Remove a file from your S3 bucket.
 * @param input - The `RemoveInput` object.
 * @return Output containing the removed object key
 * @throws service: `S3Exception` - S3 service errors thrown while while removing the object
 * @throws validation: `StorageValidationErrorCode` - Validation errors thrown
 * when there is no key or its empty.
 */
export declare function remove(input: RemoveInput): Promise<RemoveOutput>;
