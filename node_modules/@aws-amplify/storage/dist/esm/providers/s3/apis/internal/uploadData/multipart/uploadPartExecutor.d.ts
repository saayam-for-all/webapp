import { TransferProgressEvent } from '../../../../../../types';
import { ResolvedS3Config } from '../../../../types/options';
import { PartToUpload } from './getDataChunker';
interface UploadPartExecutorOptions {
    dataChunkerGenerator: Generator<PartToUpload, void, undefined>;
    completedPartNumberSet: Set<number>;
    s3Config: ResolvedS3Config;
    abortSignal: AbortSignal;
    bucket: string;
    finalKey: string;
    uploadId: string;
    isObjectLockEnabled?: boolean;
    useCRC32Checksum?: boolean;
    onPartUploadCompletion(partNumber: number, eTag: string, crc32: string | undefined): void;
    onProgress?(event: TransferProgressEvent): void;
    expectedBucketOwner?: string;
}
export declare const uploadPartExecutor: ({ dataChunkerGenerator, completedPartNumberSet, s3Config, abortSignal, bucket, finalKey, uploadId, onPartUploadCompletion, onProgress, isObjectLockEnabled, useCRC32Checksum, expectedBucketOwner, }: UploadPartExecutorOptions) => Promise<void>;
export {};
