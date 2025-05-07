import { Amplify } from '@aws-amplify/core';
import { assertTokenProviderConfig } from '@aws-amplify/core/internals/utils';
import { AuthValidationErrorCode } from '../../../errors/types/validation.mjs';
import { assertServiceError } from '../../../errors/utils/assertServiceError.mjs';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { handleUserPasswordAuthFlow, getActiveSignInUsername, getSignInResult, getSignInResultFromError } from '../utils/signInHelpers.mjs';
import { setActiveSignInState, resetActiveSignInState } from '../../../client/utils/store/signInStore.mjs';
import { cacheCognitoTokens } from '../tokenProvider/cacheTokens.mjs';
import '../utils/refreshAuthTokens.mjs';
import '../tokenProvider/errorHelpers.mjs';
import '../utils/types.mjs';
import { tokenOrchestrator } from '../tokenProvider/tokenProvider.mjs';
import { dispatchSignedInHubEvent } from '../utils/dispatchSignedInHubEvent.mjs';
import { retryOnResourceNotFoundException } from '../utils/retryOnResourceNotFoundException.mjs';
import { getNewDeviceMetadata } from '../utils/getNewDeviceMetadata.mjs';
import { resetAutoSignIn } from './autoSignIn.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Signs a user in using USER_PASSWORD_AUTH AuthFlowType
 *
 * @param input - The SignInWithUserPasswordInput object
 * @returns SignInWithUserPasswordOutput
 * @throws service: {@link InitiateAuthException } - Cognito service error thrown during the sign-in process.
 * @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password
 *  are not defined.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function signInWithUserPassword(input) {
    const { username, password, options } = input;
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    const signInDetails = {
        loginId: username,
        authFlowType: 'USER_PASSWORD_AUTH',
    };
    assertTokenProviderConfig(authConfig);
    const metadata = options?.clientMetadata;
    assertValidationError(!!username, AuthValidationErrorCode.EmptySignInUsername);
    assertValidationError(!!password, AuthValidationErrorCode.EmptySignInPassword);
    try {
        const { ChallengeName: retiredChallengeName, ChallengeParameters: retriedChallengeParameters, AuthenticationResult, Session, } = await retryOnResourceNotFoundException(handleUserPasswordAuthFlow, [username, password, metadata, authConfig, tokenOrchestrator], username, tokenOrchestrator);
        const activeUsername = getActiveSignInUsername(username);
        // sets up local state used during the sign-in process
        setActiveSignInState({
            signInSession: Session,
            username: activeUsername,
            challengeName: retiredChallengeName,
            signInDetails,
        });
        if (AuthenticationResult) {
            await cacheCognitoTokens({
                ...AuthenticationResult,
                username: activeUsername,
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
            resetAutoSignIn();
            return {
                isSignedIn: true,
                nextStep: { signInStep: 'DONE' },
            };
        }
        return getSignInResult({
            challengeName: retiredChallengeName,
            challengeParameters: retriedChallengeParameters,
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

export { signInWithUserPassword };
//# sourceMappingURL=signInWithUserPassword.mjs.map
