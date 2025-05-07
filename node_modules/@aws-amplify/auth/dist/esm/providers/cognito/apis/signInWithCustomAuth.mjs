import { Amplify } from '@aws-amplify/core';
import { assertTokenProviderConfig } from '@aws-amplify/core/internals/utils';
import { AuthValidationErrorCode } from '../../../errors/types/validation.mjs';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { assertServiceError } from '../../../errors/utils/assertServiceError.mjs';
import { handleCustomAuthFlowWithoutSRP, getActiveSignInUsername, getSignInResult, getSignInResultFromError } from '../utils/signInHelpers.mjs';
import { setActiveSignInState, resetActiveSignInState } from '../../../client/utils/store/signInStore.mjs';
import { cacheCognitoTokens } from '../tokenProvider/cacheTokens.mjs';
import '../utils/refreshAuthTokens.mjs';
import '../tokenProvider/errorHelpers.mjs';
import '../utils/types.mjs';
import { tokenOrchestrator } from '../tokenProvider/tokenProvider.mjs';
import { dispatchSignedInHubEvent } from '../utils/dispatchSignedInHubEvent.mjs';
import { retryOnResourceNotFoundException } from '../utils/retryOnResourceNotFoundException.mjs';
import { getNewDeviceMetadata } from '../utils/getNewDeviceMetadata.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Signs a user in using a custom authentication flow without password
 *
 * @param input -  The SignInWithCustomAuthInput object
 * @returns AuthSignInResult
 * @throws service: {@link InitiateAuthException } - Cognito service errors thrown during the sign-in process.
 * @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password
 *  are not defined.
 * @throws SignInWithCustomAuthOutput - Thrown when the token provider config is invalid.
 */
async function signInWithCustomAuth(input) {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { username, password, options } = input;
    const signInDetails = {
        loginId: username,
        authFlowType: 'CUSTOM_WITHOUT_SRP',
    };
    const metadata = options?.clientMetadata;
    assertValidationError(!!username, AuthValidationErrorCode.EmptySignInUsername);
    assertValidationError(!password, AuthValidationErrorCode.CustomAuthSignInPassword);
    try {
        const { ChallengeName: retriedChallengeName, ChallengeParameters: retiredChallengeParameters, AuthenticationResult, Session, } = await retryOnResourceNotFoundException(handleCustomAuthFlowWithoutSRP, [username, metadata, authConfig, tokenOrchestrator], username, tokenOrchestrator);
        const activeUsername = getActiveSignInUsername(username);
        // sets up local state used during the sign-in process
        setActiveSignInState({
            signInSession: Session,
            username: activeUsername,
            challengeName: retriedChallengeName,
            signInDetails,
        });
        if (AuthenticationResult) {
            await cacheCognitoTokens({
                username: activeUsername,
                ...AuthenticationResult,
                NewDeviceMetadata: await getNewDeviceMetadata({
                    userPoolId: authConfig.userPoolId,
                    userPoolEndpoint: authConfig.userPoolEndpoint,
                    newDeviceMetadata: AuthenticationResult.NewDeviceMetadata,
                    accessToken: AuthenticationResult.AccessToken,
                }),
                signInDetails,
            });
            resetActiveSignInState();
            await dispatchSignedInHubEvent();
            return {
                isSignedIn: true,
                nextStep: { signInStep: 'DONE' },
            };
        }
        return getSignInResult({
            challengeName: retriedChallengeName,
            challengeParameters: retiredChallengeParameters,
        });
    }
    catch (error) {
        resetActiveSignInState();
        assertServiceError(error);
        const result = getSignInResultFromError(error.name);
        if (result)
            return result;
        throw error;
    }
}

export { signInWithCustomAuth };
//# sourceMappingURL=signInWithCustomAuth.mjs.map
