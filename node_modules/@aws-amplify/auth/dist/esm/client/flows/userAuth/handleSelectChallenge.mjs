import { AuthAction } from '@aws-amplify/core/internals/utils';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../../../providers/cognito/types/errors.mjs';
import { createRespondToAuthChallengeClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createRespondToAuthChallengeClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../../../providers/cognito/factories/createCognitoUserPoolEndpointResolver.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
async function initiateSelectedChallenge({ username, session, selectedChallenge, config, clientMetadata, }) {
    const respondToAuthChallenge = createRespondToAuthChallengeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: config.userPoolEndpoint,
        }),
    });
    return respondToAuthChallenge({
        region: getRegionFromUserPoolId(config.userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignIn),
    }, {
        ChallengeName: 'SELECT_CHALLENGE',
        ChallengeResponses: {
            USERNAME: username,
            ANSWER: selectedChallenge,
        },
        ClientId: config.userPoolClientId,
        Session: session,
        ClientMetadata: clientMetadata,
    });
}

export { initiateSelectedChallenge };
//# sourceMappingURL=handleSelectChallenge.mjs.map
