import { AuthTokens } from '@aws-amplify/core';
import { CognitoIdentityPoolConfig } from '@aws-amplify/core/internals/utils';
import { IdentityIdStore } from './types';
/**
 * Provides a Cognito identityId
 *
 * @param tokens - The AuthTokens received after SignIn
 * @returns string
 * @throws configuration exceptions: `InvalidIdentityPoolIdException`
 *  - Auth errors that may arise from misconfiguration.
 * @throws service exceptions: {@link GetIdException }
 */
export declare function cognitoIdentityIdProvider({ tokens, authConfig, identityIdStore, }: {
    tokens?: AuthTokens;
    authConfig: CognitoIdentityPoolConfig;
    identityIdStore: IdentityIdStore;
}): Promise<string>;
