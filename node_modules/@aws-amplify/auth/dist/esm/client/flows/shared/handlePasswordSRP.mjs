import { AuthAction } from '@aws-amplify/core/internals/utils';
import { getUserContextData } from '../../../providers/cognito/utils/userContextData.mjs';
import { getAuthenticationHelper } from '../../../providers/cognito/utils/srp/getAuthenticationHelper.mjs';
import '../../../providers/cognito/utils/srp/constants.mjs';
import '@aws-crypto/sha256-js';
import { createInitiateAuthClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createInitiateAuthClient.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../../../providers/cognito/types/errors.mjs';
import { createCognitoUserPoolEndpointResolver } from '../../../providers/cognito/factories/createCognitoUserPoolEndpointResolver.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import { handlePasswordVerifierChallenge } from '../../../providers/cognito/utils/handlePasswordVerifierChallenge.mjs';
import { retryOnResourceNotFoundException } from '../../../providers/cognito/utils/retryOnResourceNotFoundException.mjs';
import { setActiveSignInUsername } from '../../../providers/cognito/utils/setActiveSignInUsername.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
async function handlePasswordSRP({ username, password, clientMetadata, config, tokenOrchestrator, authFlow, preferredChallenge, }) {
    const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
    const userPoolName = userPoolId?.split('_')[1] || '';
    const authenticationHelper = await getAuthenticationHelper(userPoolName);
    const authParameters = {
        USERNAME: username,
        SRP_A: authenticationHelper.A.toString(16),
    };
    if (authFlow === 'USER_AUTH' && preferredChallenge) {
        authParameters.PREFERRED_CHALLENGE = preferredChallenge;
    }
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const jsonReq = {
        AuthFlow: authFlow,
        AuthParameters: authParameters,
        ClientMetadata: clientMetadata,
        ClientId: userPoolClientId,
        UserContextData,
    };
    const initiateAuth = createInitiateAuthClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const resp = await initiateAuth({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.SignIn),
    }, jsonReq);
    const { ChallengeParameters: challengeParameters, Session: session } = resp;
    const activeUsername = challengeParameters?.USERNAME ?? username;
    setActiveSignInUsername(activeUsername);
    if (resp.ChallengeName === 'PASSWORD_VERIFIER') {
        return retryOnResourceNotFoundException(handlePasswordVerifierChallenge, [
            password,
            challengeParameters,
            clientMetadata,
            session,
            authenticationHelper,
            config,
            tokenOrchestrator,
        ], activeUsername, tokenOrchestrator);
    }
    return resp;
}

export { handlePasswordSRP };
//# sourceMappingURL=handlePasswordSRP.mjs.map
