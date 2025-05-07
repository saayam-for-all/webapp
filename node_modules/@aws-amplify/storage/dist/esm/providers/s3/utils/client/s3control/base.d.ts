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
     * Fully qualified custom endpoint for S3. If this is set, this endpoint will be used regardless of region.
     *
     * A fully qualified custom endpoint for S3. If set, this endpoint will override
     * the default S3 control endpoint and be used regardless of the specified region configuration.
     *
     * Refer to AWS documentation for more details on available endpoints:
     * https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region
     *
     * @example
     * ```ts
     * // Examples of S3 custom endpoints
     * const endpoint1 = "s3-control.us-east-2.amazonaws.com";
     * const endpoint2 = "s3-control.dualstack.us-east-2.amazonaws.com";
     * const endpoint3 = "s3-control-fips.dualstack.us-east-2.amazonaws.com";
     * ```
     */
    customEndpoint?: string;
};
/**
 * Error parser for the XML payload of S3 control plane error response. The
 * error's `Code` and `Message` locates at the nested `Error` element instead of
 * the XML root element.
 *
 * @example
 * ```
 * 	<?xml version="1.0" encoding="UTF-8"?>
 * 	<ErrorResponse>
 * 	  <Error>
 * 		  <Code>AccessDenied</Code>
 * 		  <Message>Access Denied</Message>
 * 		</Error>
 * 		<RequestId>656c76696e6727732072657175657374</RequestId>
 * 		<HostId>Uuag1LuByRx9e6j5Onimru9pO4ZVKnJ2Qz7/C1NPcfTWAtRPfTaOFg==</HostId>
 * 	</ErrorResponse>
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
    endpointResolver: (options: S3EndpointResolverOptions, apiInput: {
        AccountId: string;
    }) => {
        url: URL;
    };
    retryDecider: import("../utils/createRetryDecider").RetryDecider;
    computeDelay: (attempt: number) => number;
    userAgentValue: string;
    uriEscapePath: boolean;
};
