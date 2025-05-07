import { CognitoUserPoolConfig } from '@aws-amplify/core';
import { AuthTokenOrchestrator } from '../../../providers/cognito/tokenProvider/types';
import { AuthFlowType, ClientMetadata } from '../../../providers/cognito/types';
import { RespondToAuthChallengeCommandOutput } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
import { AuthFactorType } from '../../../providers/cognito/types/models';
interface HandlePasswordSRPInput {
    username: string;
    password: string;
    clientMetadata: ClientMetadata | undefined;
    config: CognitoUserPoolConfig;
    tokenOrchestrator: AuthTokenOrchestrator;
    authFlow: AuthFlowType;
    preferredChallenge?: AuthFactorType;
}
/**
 * Handles the Password SRP (Secure Remote Password) authentication flow.
 * This function can be used with both USER_SRP_AUTH and USER_AUTH flows.
 *
 * @param {Object} params - The parameters for the Password SRP authentication
 * @param {string} params.username - The username for authentication
 * @param {string} params.password - The user's password
 * @param {ClientMetadata} [params.clientMetadata] - Optional metadata to be sent with auth requests
 * @param {CognitoUserPoolConfig} params.config - Cognito User Pool configuration
 * @param {AuthTokenOrchestrator} params.tokenOrchestrator - Token orchestrator for managing auth tokens
 * @param {AuthFlowType} params.authFlow - The type of authentication flow ('USER_SRP_AUTH' or 'USER_AUTH')
 * @param {AuthFactorType} [params.preferredChallenge] - Optional preferred challenge type when using USER_AUTH flow
 *
 * @returns {Promise<RespondToAuthChallengeCommandOutput>} The authentication response
 */
export declare function handlePasswordSRP({ username, password, clientMetadata, config, tokenOrchestrator, authFlow, preferredChallenge, }: HandlePasswordSRPInput): Promise<RespondToAuthChallengeCommandOutput>;
export {};
