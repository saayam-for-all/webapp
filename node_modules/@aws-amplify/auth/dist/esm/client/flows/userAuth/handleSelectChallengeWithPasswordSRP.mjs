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
import { getAuthenticationHelper } from '../../../providers/cognito/utils/srp/getAuthenticationHelper.mjs';
import '../../../providers/cognito/utils/srp/constants.mjs';
import '@aws-crypto/sha256-js';
import { getUserContextData } from '../../../providers/cognito/utils/userContextData.mjs';
import { setActiveSignInUsername } from '../../../providers/cognito/utils/setActiveSignInUsername.mjs';
import { retryOnResourceNotFoundException } from '../../../providers/cognito/utils/retryOnResourceNotFoundException.mjs';
import { handlePasswordVerifierChallenge } from '../../../providers/cognito/utils/handlePasswordVerifierChallenge.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
async function handleSelectChallengeWithPasswordSRP(username, password, clientMetadata, config, session, tokenOrchestrator) {
    const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
    const userPoolName = userPoolId.split('_')[1] || '';
    const authenticationHelper = await getAuthenticationHelper(userPoolName);
    const authParameters = {
        ANSWER: 'PASSWORD_SRP',
        USERNAME: username,
        SRP_A: authenticationHelper.A.toString(16),
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
    if (response.ChallengeName === 'PASSWORD_VERIFIER') {
        return retryOnResourceNotFoundException(handlePasswordVerifierChallenge, [
            password,
            response.ChallengeParameters,
            clientMetadata,
            response.Session,
            authenticationHelper,
            config,
            tokenOrchestrator,
        ], activeUsername, tokenOrchestrator);
    }
    return response;
}

export { handleSelectChallengeWithPasswordSRP };
//# sourceMappingURL=handleSelectChallengeWithPasswordSRP.mjs.map
