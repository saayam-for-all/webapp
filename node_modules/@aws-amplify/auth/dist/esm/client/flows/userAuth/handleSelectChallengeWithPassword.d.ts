import { CognitoUserPoolConfig } from '@aws-amplify/core';
import { ClientMetadata } from '../../../providers/cognito/types';
import { RespondToAuthChallengeCommandOutput } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
/**
 * Handles the SELECT_CHALLENGE response specifically for Password authentication.
 * This function combines the SELECT_CHALLENGE flow with standard password authentication.
 *
 * @param {string} username - The username for authentication
 * @param {string} password - The user's password
 * @param {ClientMetadata} [clientMetadata] - Optional metadata to be sent with auth requests
 * @param {CognitoUserPoolConfig} config - Cognito User Pool configuration
 * @param {string} session - The current authentication session token
 *
 * @returns {Promise<RespondToAuthChallengeCommandOutput>} The challenge response
 */
export declare function handleSelectChallengeWithPassword(username: string, password: string, clientMetadata: ClientMetadata | undefined, config: CognitoUserPoolConfig, session: string): Promise<RespondToAuthChallengeCommandOutput>;
