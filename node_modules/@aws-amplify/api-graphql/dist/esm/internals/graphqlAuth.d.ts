import { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { AmplifyClassV6 } from '@aws-amplify/core';
export declare function headerBasedAuth(amplify: AmplifyClassV6, authMode: GraphQLAuthMode, apiKey: string | undefined, additionalHeaders?: Record<string, string>): Promise<{}>;
