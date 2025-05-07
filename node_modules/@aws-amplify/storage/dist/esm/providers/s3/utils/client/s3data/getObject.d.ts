import { Endpoint, HttpResponse, PresignUrlOptions, UserAgentOptions } from '@aws-amplify/core/internals/aws-client-utils';
import { S3EndpointResolverOptions } from './base';
import type { GetObjectCommandInput, GetObjectCommandOutput } from './types';
export type GetObjectInput = Pick<GetObjectCommandInput, 'Bucket' | 'Key' | 'Range' | 'ResponseContentDisposition' | 'ResponseContentType' | 'ExpectedBucketOwner'>;
export type GetObjectOutput = GetObjectCommandOutput;
export declare const getObject: (config: {
    responseType?: "blob" | "text" | undefined;
    service?: string | undefined;
    endpointResolver?: (((options: import("@aws-amplify/core/internals/aws-client-utils").EndpointResolverOptions, input?: any) => Endpoint) & ((options: S3EndpointResolverOptions, apiInput?: {
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
}, input: GetObjectInput) => Promise<GetObjectCommandOutput>;
type S3GetObjectPresignedUrlConfig = Omit<UserAgentOptions & PresignUrlOptions & S3EndpointResolverOptions, 'signingService' | 'signingRegion'> & {
    signingService?: string;
    signingRegion?: string;
};
/**
 * Get a presigned URL for the `getObject` API.
 *
 * @internal
 */
export declare const getPresignedGetObjectUrl: (config: S3GetObjectPresignedUrlConfig, input: GetObjectInput) => Promise<URL>;
export {};
