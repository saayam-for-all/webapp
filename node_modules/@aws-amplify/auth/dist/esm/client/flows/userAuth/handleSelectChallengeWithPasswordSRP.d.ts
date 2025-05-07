import { CognitoUserPoolConfig } from '@aws-amplify/core';
import { AuthTokenOrchestrator } from '../../../providers/cognito/tokenProvider/types';
import { RespondToAuthChallengeCommandOutput } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
import { ClientMetadata } from '../../../providers/cognito/types';
/**
 * Handles the SELECT_CHALLENGE response specifically for Password SRP authentication.
 * This function combines the SELECT_CHALLENGE flow with Password SRP protocol.
 *
 * @param {string} username - The username for authentication
 * @param {string} password - The user's password
 * @param {ClientMetadata} [clientMetadata] - Optional metadata to be sent with auth requests
 * @param {CognitoUserPoolConfig} config - Cognito User Pool configuration
 * @param {string} session - The current authentication session token
 * @param {AuthTokenOrchestrator} tokenOrchestrator - Token orchestrator for managing auth tokens
 *
 * @returns {Promise<RespondToAuthChallengeCommandOutput>} The challenge response
 */
export declare function handleSelectChallengeWithPasswordSRP(username: string, password: string, clientMetadata: ClientMetadata | undefined, config: CognitoUserPoolConfig, session: string, tokenOrchestrator: AuthTokenOrchestrator): Promise<RespondToAuthChallengeCommandOutput>;
