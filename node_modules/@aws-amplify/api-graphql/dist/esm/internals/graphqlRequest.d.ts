import { AmplifyClassV6 } from '@aws-amplify/core';
import { post } from '@aws-amplify/api-rest/internals';
export declare function graphqlRequest(amplify: AmplifyClassV6, url: string, options: any, abortController: AbortController, _post?: typeof post): Promise<import("@aws-amplify/core/internals/utils").DocumentType>;
