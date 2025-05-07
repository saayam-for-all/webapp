import { AmplifyClassV6 } from '@aws-amplify/core';
import { CustomUserAgentDetails, GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { CustomHeaders } from '@aws-amplify/data-schema/runtime';
interface GqlRequestOptions {
    apiKey?: string;
    region?: string;
    appSyncGraphqlEndpoint: string;
    authenticationType: GraphQLAuthMode;
    query: string;
    variables: string[];
    authToken?: string;
}
export declare function appsyncRequest<T = any>(amplify: AmplifyClassV6, options: GqlRequestOptions, additionalHeaders: CustomHeaders | undefined, abortController: AbortController, customUserAgentDetails?: CustomUserAgentDetails): Promise<T>;
export {};
