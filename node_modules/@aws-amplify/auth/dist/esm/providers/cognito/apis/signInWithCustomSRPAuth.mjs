import { Amplify } from '@aws-amplify/core';
import { assertTokenProviderConfig } from '@aws-amplify/core/internals/utils';
import { AuthValidationErrorCode } from '../../../errors/types/validation.mjs';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { assertServiceError } from '../../../errors/utils/assertServiceError.mjs';
import { handleCustomSRPAuthFlow, getActiveSignInUsername, getSignInResult, getSignInResultFromError } from '../utils/signInHelpers.mjs';
import { setActiveSignInState, resetActiveSignInState } from '../../../client/utils/store/signInStore.mjs';
import { cacheCognitoTokens } from '../tokenProvider/cacheTokens.mjs';
import '../utils/refreshAuthTokens.mjs';
import '../tokenProvider/errorHelpers.mjs';
import '../utils/types.mjs';
import { tokenOrchestrator } from '../tokenProvider/tokenProvider.mjs';
import { dispatchSignedInHubEvent } from '../utils/dispatchSignedInHubEvent.mjs';
import { getNewDeviceMetadata } from '../utils/getNewDeviceMetadata.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Signs a user in using a custom authentication flow with SRP
 *
 * @param input -  The SignInWithCustomSRPAuthInput object
 * @returns SignInWithCustomSRPAuthOutput
 * @throws service: {@link InitiateAuthException }, {@link RespondToAuthChallengeException } - Cognito
 * service errors thrown during the sign-in process.
 * @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password
 *  are not defined.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function signInWithCustomSRPAuth(input) {
    const { username, password, options } = input;
    const signInDetails = {
        loginId: username,
        authFlowType: 'CUSTOM_WITH_SRP',
    };
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const metadata = options?.clientMetadata;
    assertValidationError(!!username, AuthValidationErrorCode.EmptySignInUsername);
    assertValidationError(!!password, AuthValidationErrorCode.EmptySignInPassword);
    try {
        const { ChallengeName: handledChallengeName, ChallengeParameters: handledChallengeParameters, AuthenticationResult, Session, } = await handleCustomSRPAuthFlow(username, password, metadata, authConfig, tokenOrchestrator);
        const activeUsername = getActiveSignInUsername(username);
        // sets up local state used during the sign-in process
        setActiveSignInState({
            signInSession: Session,
            username: activeUsername,
            challengeName: handledChallengeName,
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
            challengeName: handledChallengeName,
            challengeParameters: handledChallengeParameters,
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

export { signInWithCustomSRPAuth };
//# sourceMappingURL=signInWithCustomSRPAuth.mjs.map
