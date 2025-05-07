import { AuthConfig } from '@aws-amplify/core';
import { CognitoAuthTokens, TokenRefresher } from '../tokenProvider/types';
export declare const refreshAuthTokens: (args_0: {
    tokens: CognitoAuthTokens;
    authConfig?: AuthConfig | undefined;
    username: string;
}) => Promise<CognitoAuthTokens>;
export declare const refreshAuthTokensWithoutDedupe: TokenRefresher;
