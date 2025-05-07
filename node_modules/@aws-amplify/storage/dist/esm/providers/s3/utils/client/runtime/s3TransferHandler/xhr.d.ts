import { HttpRequest, HttpResponse, RetryOptions, SigningOptions, UserAgentOptions } from '@aws-amplify/core/internals/aws-client-utils';
/**
 * S3 transfer handler for browser and React Native based on XHR. On top of basic transfer handler, it also supports
 * x-amz-content-sha256 header, and request&response process tracking.
 *
 * @internal
 */
export declare const s3TransferHandler: (request: HttpRequest, options: object & UserAgentOptions & RetryOptions<HttpResponse> & SigningOptions & import("../xhrTransferHandler").XhrTransferHandlerOptions) => Promise<HttpResponse>;
