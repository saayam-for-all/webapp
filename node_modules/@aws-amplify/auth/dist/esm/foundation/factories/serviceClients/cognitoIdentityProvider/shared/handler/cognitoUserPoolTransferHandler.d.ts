import { HttpRequest } from '@aws-amplify/core/internals/aws-client-utils';
import { HttpResponse } from '@aws-amplify/core/src/clients/types';
/**
 * A Cognito Identity-specific transfer handler that does NOT sign requests, and
 * disables caching.
 *
 * @internal
 */
export declare const cognitoUserPoolTransferHandler: (request: HttpRequest, options: Record<string, unknown> & import("@aws-amplify/core/internals/aws-client-utils").UserAgentOptions & import("@aws-amplify/core/internals/aws-client-utils").RetryOptions<import("@aws-amplify/core/internals/aws-client-utils").HttpResponse> & import("@aws-amplify/core/internals/aws-client-utils").HttpTransferOptions) => Promise<HttpResponse>;
