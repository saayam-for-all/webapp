import { Amplify } from '@aws-amplify/core';
import { assertTokenProviderConfig } from '@aws-amplify/core/internals/utils';
import { AuthValidationErrorCode } from '../../../errors/types/validation.mjs';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { assertServiceError } from '../../../errors/utils/assertServiceError.mjs';
import { getActiveSignInUsername, getSignInResult, getSignInResultFromError } from '../utils/signInHelpers.mjs';
import { autoSignInStore } from '../../../client/utils/store/autoSignInStore.mjs';
import { setActiveSignInState, resetActiveSignInState } from '../../../client/utils/store/signInStore.mjs';
import { cacheCognitoTokens } from '../tokenProvider/cacheTokens.mjs';
import { dispatchSignedInHubEvent } from '../utils/dispatchSignedInHubEvent.mjs';
import '../utils/refreshAuthTokens.mjs';
import '../tokenProvider/errorHelpers.mjs';
import '../utils/types.mjs';
import { tokenOrchestrator } from '../tokenProvider/tokenProvider.mjs';
import { handleUserAuthFlow } from '../../../client/flows/userAuth/handleUserAuthFlow.mjs';
import { getNewDeviceMetadata } from '../utils/getNewDeviceMetadata.mjs';
import { resetAutoSignIn } from './autoSignIn.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Signs a user in through a registered email or phone number without a password by by receiving and entering an OTP.
 *
 * @param input - The SignInWithUserAuthInput object
 * @returns SignInWithUserAuthOutput
 * @throws service: {@link InitiateAuthException }, {@link RespondToAuthChallengeException } - Cognito service errors
 * thrown during the sign-in process.
 * @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password -- needs to change
 *  are not defined.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function signInWithUserAuth(input) {
    const { username, password, options } = input;
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    const signInDetails = {
        loginId: username,
        authFlowType: 'USER_AUTH',
    };
    assertTokenProviderConfig(authConfig);
    const clientMetaData = options?.clientMetadata;
    const preferredChallenge = options?.preferredChallenge;
    assertValidationError(!!username, AuthValidationErrorCode.EmptySignInUsername);
    try {
        const handleUserAuthFlowInput = {
            username,
            config: authConfig,
            tokenOrchestrator,
            clientMetadata: clientMetaData,
            preferredChallenge,
            password,
        };
        const autoSignInStoreState = autoSignInStore.getState();
        if (autoSignInStoreState.active &&
            autoSignInStoreState.username === username) {
            handleUserAuthFlowInput.session = autoSignInStoreState.session;
        }
        const response = await handleUserAuthFlow(handleUserAuthFlowInput);
        const activeUsername = getActiveSignInUsername(username);
        setActiveSignInState({
            signInSession: response.Session,
            username: activeUsername,
            challengeName: response.ChallengeName,
            signInDetails,
        });
        if (response.AuthenticationResult) {
            await cacheCognitoTokens({
                username: activeUsername,
                ...response.AuthenticationResult,
                NewDeviceMetadata: await getNewDeviceMetadata({
                    userPoolId: authConfig.userPoolId,
                    userPoolEndpoint: authConfig.userPoolEndpoint,
                    newDeviceMetadata: response.AuthenticationResult.NewDeviceMetadata,
                    accessToken: response.AuthenticationResult.AccessToken,
                }),
                signInDetails,
            });
            resetActiveSignInState();
            await dispatchSignedInHubEvent();
            resetAutoSignIn();
            return {
                isSignedIn: true,
                nextStep: { signInStep: 'DONE' },
            };
        }
        return getSignInResult({
            challengeName: response.ChallengeName,
            challengeParameters: response.ChallengeParameters,
            availableChallenges: 'AvailableChallenges' in response
                ? response.AvailableChallenges
                : undefined,
        });
    }
    catch (error) {
        resetActiveSignInState();
        resetAutoSignIn();
        assertServiceError(error);
        const result = getSignInResultFromError(error.name);
        if (result)
            return result;
        throw error;
    }
}

export { signInWithUserAuth };
//# sourceMappingURL=signInWithUserAuth.mjs.map
