import { EndpointResolverOptions } from '@aws-amplify/core/internals/aws-client-utils';
/**
 * The service name used to sign requests if the API requires authentication.
 */
export declare const SERVICE_NAME = "s3";
/**
 * Options for endpoint resolver.
 *
 * @internal
 */
export type S3EndpointResolverOptions = EndpointResolverOptions & {
    /**
     * Whether to use the S3 Transfer Acceleration endpoint.
     */
    useAccelerateEndpoint?: boolean;
    /**
     * A fully qualified custom endpoint for S3. If set, this endpoint will override
     * the default S3 endpoint and be used regardless of the specified region or
     * `useAccelerateEndpoint` configuration.
     *
     * Refer to AWS documentation for more details on available endpoints:
     * https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region
     *
     * @example
     * ```ts
     * // Examples of S3 custom endpoints
     * const endpoint1 = "s3.us-east-2.amazonaws.com";
     * const endpoint2 = "s3.dualstack.us-east-2.amazonaws.com";
     * const endpoint3 = "s3-fips.dualstack.us-east-2.amazonaws.com";
     * ```
     */
    customEndpoint?: string;
    /**
     * Whether to force path style URLs for S3 objects (e.g., https://s3.amazonaws.com/<bucketName>/<key> instead of
     * https://<bucketName>.s3.amazonaws.com/<key>
     * @default false
     */
    forcePathStyle?: boolean;
};
/**
 * Determines whether a given string is DNS compliant per the rules outlined by
 * S3. Length, capitaization, and leading dot restrictions are enforced by the
 * DOMAIN_PATTERN regular expression.
 * @internal
 *
 * @see https://github.com/aws/aws-sdk-js-v3/blob/f2da6182298d4d6b02e84fb723492c07c27469a8/packages/middleware-bucket-endpoint/src/bucketHostnameUtils.ts#L39-L48
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html
 */
export declare const isDnsCompatibleBucketName: (bucketName: string) => boolean;
/**
 * Error parser for the XML payload of S3 data plane error response. The error's
 * `Code` and `Message` locates directly at the XML root element.
 *
 * @example
 * ```
 * <?xml version="1.0" encoding="UTF-8"?>
 * 	<Error>
 * 		<Code>NoSuchKey</Code>
 * 		<Message>The resource you requested does not exist</Message>
 * 		<Resource>/mybucket/myfoto.jpg</Resource>
 * 		<RequestId>4442587FB7D0A2F9</RequestId>
 * 	</Error>
 * 	```
 *
 * @internal
 */
export declare const parseXmlError: import("@aws-amplify/core/internals/aws-client-utils").ErrorParser;
/**
 * @internal
 */
export declare const retryDecider: import("../utils/createRetryDecider").RetryDecider;
/**
 * @internal
 */
export declare const defaultConfig: {
    service: string;
    endpointResolver: (options: S3EndpointResolverOptions, apiInput?: {
        Bucket?: string;
    }) => {
        url: URL;
    };
    retryDecider: import("../utils/createRetryDecider").RetryDecider;
    computeDelay: (attempt: number) => number;
    userAgentValue: string;
    useAccelerateEndpoint: boolean;
    uriEscapePath: boolean;
};
