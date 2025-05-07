import { Endpoint, HttpResponse } from '@aws-amplify/core/internals/aws-client-utils';
import type { HeadObjectCommandInput, HeadObjectCommandOutput } from './types';
export type HeadObjectInput = Pick<HeadObjectCommandInput, 'Bucket' | 'Key' | 'ExpectedBucketOwner'>;
export type HeadObjectOutput = Pick<HeadObjectCommandOutput, 'ContentLength' | 'ContentType' | 'ETag' | 'LastModified' | 'Metadata' | 'VersionId' | '$metadata'>;
export declare const headObject: (config: {
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
}, input: HeadObjectInput) => Promise<HeadObjectOutput>;
