import { Endpoint, HttpResponse } from '@aws-amplify/core/internals/aws-client-utils';
import type { CopyObjectCommandInput, CopyObjectCommandOutput } from './types';
export type CopyObjectInput = Pick<CopyObjectCommandInput, 'Bucket' | 'CopySource' | 'Key' | 'MetadataDirective' | 'CacheControl' | 'ContentType' | 'ContentDisposition' | 'ContentLanguage' | 'Expires' | 'ACL' | 'Tagging' | 'Metadata' | 'CopySourceIfUnmodifiedSince' | 'CopySourceIfMatch' | 'ExpectedSourceBucketOwner' | 'ExpectedBucketOwner'>;
export type CopyObjectOutput = CopyObjectCommandOutput;
export declare const validateCopyObjectHeaders: (input: CopyObjectInput, headers: Record<string, string>) => void;
export declare const copyObject: (config: {
    responseType?: "blob" | "text" | undefined;
    service?: string | undefined;
    endpointResolver?: (((options: import("@aws-amplify/core/internals/aws-client-utils").EndpointResolverOptions, input?: any) => Endpoint) & ((options: import("./base").S3EndpointResolverOptions, apiInput?: {
        Bucket?: string | undefined;
    } | undefined) => {
        url: URL;
    })) | undefined;
    retryDecider?: (((response?: HttpResponse | undefined, error?: unknown, middlewareContext?: import("@aws-amplify/core/internals/aws-client-utils").MiddlewareContext | undefined) => Promise<import("@aws-amplify/core/internals/aws-client-utils").RetryDeciderOutput>) & import("../utils/createRetryDecider").RetryDecider) | undefined;
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
}, input: CopyObjectInput) => Promise<CopyObjectCommandOutput>;
