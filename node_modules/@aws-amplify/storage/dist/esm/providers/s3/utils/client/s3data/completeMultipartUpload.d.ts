import { Endpoint, HttpResponse, MiddlewareContext, RetryDeciderOutput } from '@aws-amplify/core/internals/aws-client-utils';
import type { CompleteMultipartUploadCommandInput, CompleteMultipartUploadCommandOutput } from './types';
export type CompleteMultipartUploadInput = Pick<CompleteMultipartUploadCommandInput, 'Bucket' | 'Key' | 'UploadId' | 'MultipartUpload' | 'ChecksumCRC32' | 'ExpectedBucketOwner' | 'IfNoneMatch'>;
export type CompleteMultipartUploadOutput = Pick<CompleteMultipartUploadCommandOutput, '$metadata' | 'Key' | 'ETag' | 'Location'>;
export declare const completeMultipartUpload: (config: {
    responseType?: "blob" | "text" | undefined;
    retryDecider?: (((response?: HttpResponse | undefined, error?: unknown, middlewareContext?: MiddlewareContext | undefined) => Promise<RetryDeciderOutput>) & ((response?: HttpResponse, error?: unknown, middlewareContext?: MiddlewareContext) => Promise<RetryDeciderOutput>)) | undefined;
    service?: string | undefined;
    endpointResolver?: (((options: import("@aws-amplify/core/internals/aws-client-utils").EndpointResolverOptions, input?: any) => Endpoint) & ((options: import("./base").S3EndpointResolverOptions, apiInput?: {
        Bucket?: string | undefined;
    } | undefined) => {
        url: URL;
    })) | undefined;
    computeDelay?: ((attempt: number) => number) | undefined;
    userAgentValue?: string | undefined;
    useAccelerateEndpoint?: boolean | undefined;
    uriEscapePath?: boolean | undefined;
} & {
    credentials: import("@aws-amplify/core/internals/aws-client-utils").Credentials | ((options?: import("@aws-amplify/core/internals/aws-client-utils").CredentialsProviderOptions | undefined) => Promise<import("@aws-amplify/core/internals/aws-client-utils").Credentials>);
    region: string;
    onDownloadProgress?: ((event: import("../../../../..").TransferProgressEvent) => void) | undefined;
    onUploadProgress?: ((event: import("../../../../..").TransferProgressEvent) => void) | undefined;
    abortSignal?: AbortSignal | undefined;
    customEndpoint?: string | undefined;
    forcePathStyle?: boolean | undefined;
    userAgentHeader?: string | undefined;
    maxAttempts?: number | undefined;
}, input: CompleteMultipartUploadInput) => Promise<CompleteMultipartUploadOutput>;
