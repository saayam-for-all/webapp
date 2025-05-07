import { Amplify } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { AuthErrorCodes } from '../../../common/AuthErrorStrings.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import { AuthError } from '../../../errors/AuthError.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../errors/types/validation.mjs';
import '../../../providers/cognito/types/errors.mjs';
import { createRespondToAuthChallengeClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createRespondToAuthChallengeClient.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { createCognitoUserPoolEndpointResolver } from '../../../providers/cognito/factories/createCognitoUserPoolEndpointResolver.mjs';
import { cacheCognitoTokens } from '../../../providers/cognito/tokenProvider/cacheTokens.mjs';
import { dispatchSignedInHubEvent } from '../../../providers/cognito/utils/dispatchSignedInHubEvent.mjs';
import '../../utils/store/autoSignInStore.mjs';
import { signInStore, setActiveSignInState } from '../../utils/store/signInStore.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import { assertPasskeyError, PasskeyErrorCode } from '../../utils/passkey/errors.mjs';
import { getPasskey } from '../../utils/passkey/getPasskey.mjs';
import { getNewDeviceMetadata } from '../../../providers/cognito/utils/getNewDeviceMetadata.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
async function handleWebAuthnSignInResult(challengeParameters) {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { username, signInSession, signInDetails, challengeName } = signInStore.getState();
    if (challengeName !== 'WEB_AUTHN' || !username) {
        throw new AuthError({
            name: AuthErrorCodes.SignInException,
            message: 'Unable to proceed due to invalid sign in state.',
        });
    }
    const { CREDENTIAL_REQUEST_OPTIONS: credentialRequestOptions } = challengeParameters;
    assertPasskeyError(!!credentialRequestOptions, PasskeyErrorCode.InvalidPasskeyAuthenticationOptions);
    const cred = await getPasskey(JSON.parse(credentialRequestOptions));
    const respondToAuthChallenge = createRespondToAuthChallengeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: authConfig.userPoolEndpoint,
        }),
    });
    const { ChallengeName: nextChallengeName, ChallengeParameters: nextChallengeParameters, AuthenticationResult: authenticationResult, Session: nextSession, } = await respondToAuthChallenge({
        region: getRegionFromUserPoolId(authConfig.userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignIn),
    }, {
        ChallengeName: 'WEB_AUTHN',
        ChallengeResponses: {
            USERNAME: username,
            CREDENTIAL: JSON.stringify(cred),
        },
        ClientId: authConfig.userPoolClientId,
        Session: signInSession,
    });
    setActiveSignInState({
        signInSession: nextSession,
        username,
        challengeName: nextChallengeName,
        signInDetails,
    });
    if (authenticationResult) {
        await cacheCognitoTokens({
            ...authenticationResult,
            username,
            NewDeviceMetadata: await getNewDeviceMetadata({
                userPoolId: authConfig.userPoolId,
                userPoolEndpoint: authConfig.userPoolEndpoint,
                newDeviceMetadata: authenticationResult.NewDeviceMetadata,
                accessToken: authenticationResult.AccessToken,
            }),
            signInDetails,
        });
        signInStore.dispatch({ type: 'RESET_STATE' });
        await dispatchSignedInHubEvent();
        return {
            isSignedIn: true,
            nextStep: { signInStep: 'DONE' },
        };
    }
    if (nextChallengeName === 'WEB_AUTHN') {
        throw new AuthError({
            name: AuthErrorCodes.SignInException,
            message: 'Sequential WEB_AUTHN challenges returned from underlying service cannot be handled.',
        });
    }
    return {
        challengeName: nextChallengeName,
        challengeParameters: nextChallengeParameters,
    };
}

export { handleWebAuthnSignInResult };
//# sourceMappingURL=handleWebAuthnSignInResult.mjs.map
