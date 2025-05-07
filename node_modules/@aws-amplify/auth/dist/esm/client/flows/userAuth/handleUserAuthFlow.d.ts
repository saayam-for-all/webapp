import { CognitoUserPoolConfig } from '@aws-amplify/core';
import { AuthTokenOrchestrator } from '../../../providers/cognito/tokenProvider/types';
import { AuthFactorType } from '../../../providers/cognito/types/models';
export interface HandleUserAuthFlowInput {
    username: string;
    config: CognitoUserPoolConfig;
    tokenOrchestrator: AuthTokenOrchestrator;
    clientMetadata?: Record<string, string>;
    preferredChallenge?: AuthFactorType;
    password?: string;
    session?: string;
}
/**
 * Handles user authentication flow with configurable challenge preferences.
 * Supports AuthFactorType challenges through the USER_AUTH flow.
 *
 * @param {HandleUserAuthFlowInput} params - Authentication flow parameters
 * @param {string} params.username - The username for authentication
 * @param {Record<string, string>} [params.clientMetadata] - Optional metadata to pass to authentication service
 * @param {CognitoUserPoolConfig} params.config - Cognito User Pool configuration
 * @param {AuthTokenOrchestrator} params.tokenOrchestrator - Manages authentication tokens and device tracking
 * @param {AuthFactorType} [params.preferredChallenge] - Optional preferred authentication method
 * @param {string} [params.password] - Required when preferredChallenge is 'PASSWORD' or 'PASSWORD_SRP'
 *
 * @returns {Promise<InitiateAuthCommandOutput>} The authentication response from Cognito
 */
export declare function handleUserAuthFlow({ username, clientMetadata, config, tokenOrchestrator, preferredChallenge, password, session, }: HandleUserAuthFlowInput): Promise<import("../../../foundation/factories/serviceClients/cognitoIdentityProvider/types").RespondToAuthChallengeCommandOutput>;
