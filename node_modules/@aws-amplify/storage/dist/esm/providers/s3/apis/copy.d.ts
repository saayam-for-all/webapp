import { CopyInput, CopyOutput, CopyWithPathInput, CopyWithPathOutput } from '../types';
/**
 * Copy an object from a source to a destination object within the same bucket.
 *
 * @param input - The `CopyWithPathInput` object.
 * @returns Output containing the destination object path.
 * @throws service: `S3Exception` - Thrown when checking for existence of the object
 * @throws validation: `StorageValidationErrorCode` - Thrown when
 * source or destination path is not defined.
 */
export declare function copy(input: CopyWithPathInput): Promise<CopyWithPathOutput>;
/**
 * @deprecated The `key` and `accessLevel` parameters are deprecated and may be removed in the next major version.
 * Please use {@link https://docs.amplify.aws/react/build-a-backend/storage/copy | path} instead.
 *
 * Copy an object from a source to a destination object within the same bucket. Can optionally copy files across
 * different accessLevel or identityId (if source object's accessLevel is 'protected').
 *
 * @param input - The `CopyInput` object.
 * @returns Output containing the destination object key.
 * @throws service: `S3Exception` - Thrown when checking for existence of the object
 * @throws validation: `StorageValidationErrorCode` - Thrown when
 * source or destination key is not defined.
 */
export declare function copy(input: CopyInput): Promise<CopyOutput>;
