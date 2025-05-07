import { ErrorParser, HttpResponse, MiddlewareContext, RetryDeciderOutput } from '@aws-amplify/core/internals/aws-client-utils';
/**
 * Function to decide if the S3 request should be retried. For S3 APIs, we support forceRefresh option
 * for {@link LocationCredentialsProvider | LocationCredentialsProvider } option. It's set when S3 returns
 * credentials expired error. In the retry decider, we detect this response and set flag to signify a retry
 * attempt. The retry attempt would invoke the LocationCredentialsProvider with forceRefresh option set.
 *
 * @param response Optional response of the request.
 * @param error Optional error thrown from previous attempts.
 * @param middlewareContext Optional context object to store data between retries.
 * @returns True if the request should be retried.
 */
export type RetryDecider = (response?: HttpResponse, error?: unknown, middlewareContext?: MiddlewareContext) => Promise<RetryDeciderOutput>;
/**
 * Factory of a {@link RetryDecider} function.
 *
 * @param errorParser function to parse HTTP response wth XML payload to JS
 * 	Error instance.
 * @returns A structure indicating if the response is retryable; And if it is a
 * 	CredentialsExpiredError
 */
export declare const createRetryDecider: (errorParser: ErrorParser) => RetryDecider;
