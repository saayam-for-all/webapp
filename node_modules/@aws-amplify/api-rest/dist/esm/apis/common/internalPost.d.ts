import { AmplifyClassV6 } from '@aws-amplify/core';
import { InternalPostInput, RestApiResponse } from '../../types';
/**
 * @internal
 *
 * REST POST handler to send GraphQL request to given endpoint. By default, it will use IAM to authorize
 * the request. In some auth modes, the IAM auth has to be disabled. Here's how to set up the request auth correctly:
 * * If auth mode is 'iam', you MUST NOT set 'authorization' header and 'x-api-key' header, since it would disable IAM
 *   auth. You MUST also set 'input.options.signingServiceInfo' option.
 *   * The including 'input.options.signingServiceInfo.service' and 'input.options.signingServiceInfo.region' are
 *     optional. If omitted, the signing service and region will be inferred from url.
 * * If auth mode is 'none', you MUST NOT set 'options.signingServiceInfo' option.
 * * If auth mode is 'apiKey', you MUST set 'x-api-key' custom header.
 * * If auth mode is 'oidc' or 'lambda' or 'userPool', you MUST set 'authorization' header.
 *
 * To make the internal post cancellable, you must also call `updateRequestToBeCancellable()` with the promise from
 * internal post call and the abort controller supplied to the internal post call.
 *
 * @param amplify the AmplifyClassV6 instance - it may be the singleton used on Web, or an instance created within
 * a context created by `runWithAmplifyServerContext`
 * @param postInput an object of {@link InternalPostInput}
 * @param postInput.url The URL that the POST request sends to
 * @param postInput.options Options of the POST request
 * @param postInput.abortController The abort controller used to cancel the POST request
 * @returns a {@link RestApiResponse}
 *
 * @throws an {@link AmplifyError} with `Network Error` as the `message` when the external resource is unreachable due to one
 * of the following reasons:
 *   1. no network connection
 *   2. CORS error
 * @throws a {@link CanceledError} when the ongoing POST request get cancelled
 */
export declare const post: (amplify: AmplifyClassV6, { url, options, abortController }: InternalPostInput) => Promise<RestApiResponse>;
/**
 * Cancels a request given the promise returned by `post`.
 * If the request is already completed, this function does nothing.
 * It MUST be used after `updateRequestToBeCancellable` is called.
 */
export declare const cancel: (promise: Promise<RestApiResponse>, message?: string) => boolean;
/**
 * MUST be used to make a promise including internal `post` API call cancellable.
 */
export declare const updateRequestToBeCancellable: (promise: Promise<any>, controller: AbortController) => void;
