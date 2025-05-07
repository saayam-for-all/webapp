import { KeyValueStorageInterface, StorageAccessLevel } from '@aws-amplify/core';
import { ContentDisposition, ResolvedS3Config, UploadDataChecksumAlgorithm } from '../../../../types/options';
import { StorageUploadDataPayload } from '../../../../../../types';
import { Part } from '../../../../utils/client/s3data';
interface LoadOrCreateMultipartUploadOptions {
    s3Config: ResolvedS3Config;
    data: StorageUploadDataPayload;
    bucket: string;
    size: number;
    accessLevel?: StorageAccessLevel;
    keyPrefix?: string;
    key: string;
    contentType?: string;
    contentDisposition?: string | ContentDisposition;
    contentEncoding?: string;
    metadata?: Record<string, string>;
    abortSignal?: AbortSignal;
    checksumAlgorithm?: UploadDataChecksumAlgorithm;
    optionsHash: string;
    resumableUploadsCache?: KeyValueStorageInterface;
    expectedBucketOwner?: string;
}
interface LoadOrCreateMultipartUploadResult {
    uploadId: string;
    cachedParts: Part[];
    finalCrc32?: string;
}
/**
 * Load the in-progress multipart upload from local storage or async storage(RN) if it exists, or create a new multipart
 * upload.
 *
 * @internal
 */
export declare const loadOrCreateMultipartUpload: ({ s3Config, data, size, contentType, bucket, accessLevel, keyPrefix, key, contentDisposition, contentEncoding, metadata, abortSignal, checksumAlgorithm, optionsHash, resumableUploadsCache, expectedBucketOwner, }: LoadOrCreateMultipartUploadOptions) => Promise<LoadOrCreateMultipartUploadResult>;
export {};
