import { CognitoUserPoolConfig } from '@aws-amplify/core';
import { ClientMetadata } from '../../../providers/cognito/types';
import { RespondToAuthChallengeCommandOutput } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/types';
/**
 * Handles the SELECT_CHALLENGE response for authentication.
 * Initiates the selected authentication challenge based on user choice.
 *
 * @param {Object} params - The parameters for handling the selected challenge
 * @param {string} params.username - The username for authentication
 * @param {string} params.session - The current authentication session token
 * @param {string} params.selectedChallenge - The challenge type selected by the user
 * @param {CognitoUserPoolConfig} params.config - Cognito User Pool configuration
 * @param {ClientMetadata} [params.clientMetadata] - Optional metadata to be sent with auth requests
 *
 * @returns {Promise<RespondToAuthChallengeCommandOutput>} The challenge response
 */
export declare function initiateSelectedChallenge({ username, session, selectedChallenge, config, clientMetadata, }: {
    username: string;
    session: string;
    selectedChallenge: string;
    config: CognitoUserPoolConfig;
    clientMetadata?: ClientMetadata;
}): Promise<RespondToAuthChallengeCommandOutput>;
