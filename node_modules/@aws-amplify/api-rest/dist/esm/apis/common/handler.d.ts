import { AmplifyClassV6 } from '@aws-amplify/core';
import { Headers, HttpRequest } from '@aws-amplify/core/internals/aws-client-utils';
import { DocumentType } from '@aws-amplify/core/internals/utils';
import { RestApiResponse, SigningServiceInfo } from '../../types';
type HandlerOptions = Omit<HttpRequest, 'body' | 'headers'> & {
    body?: DocumentType | FormData;
    headers?: Headers;
    withCredentials?: boolean;
};
/**
 * Make REST API call with best-effort IAM auth.
 * @param amplify Amplify instance to to resolve credentials and tokens. Should use different instance in client-side
 *   and SSR
 * @param options Options accepted from public API options when calling the handlers.
 * @param signingServiceInfo Internal-only options enable IAM auth as well as to to overwrite the IAM signing service
 *   and region. If specified, and NONE of API Key header or Auth header is present, IAM auth will be used.
 * @param iamAuthApplicable Callback function that is used to determine if IAM Auth should be used or not.
 *
 * @internal
 */
export declare const transferHandler: (amplify: AmplifyClassV6, options: HandlerOptions & {
    abortSignal: AbortSignal;
}, iamAuthApplicable: ({ headers }: HttpRequest, signingServiceInfo?: SigningServiceInfo) => boolean, signingServiceInfo?: SigningServiceInfo) => Promise<RestApiResponse>;
export {};
