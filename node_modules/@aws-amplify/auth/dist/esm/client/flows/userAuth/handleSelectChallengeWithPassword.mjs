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
import { getUserContextData } from '../../../providers/cognito/utils/userContextData.mjs';
import { setActiveSignInUsername } from '../../../providers/cognito/utils/setActiveSignInUsername.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
async function handleSelectChallengeWithPassword(username, password, clientMetadata, config, session) {
    const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
    const authParameters = {
        ANSWER: 'PASSWORD',
        USERNAME: username,
        PASSWORD: password,
    };
    const userContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const respondToAuthChallenge = createRespondToAuthChallengeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const response = await respondToAuthChallenge({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignIn),
    }, {
        ChallengeName: 'SELECT_CHALLENGE',
        ChallengeResponses: authParameters,
        ClientId: userPoolClientId,
        ClientMetadata: clientMetadata,
        Session: session,
        UserContextData: userContextData,
    });
    const activeUsername = response.ChallengeParameters?.USERNAME ?? username;
    setActiveSignInUsername(activeUsername);
    return response;
}

export { handleSelectChallengeWithPassword };
//# sourceMappingURL=handleSelectChallengeWithPassword.mjs.map
