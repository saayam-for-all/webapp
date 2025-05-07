import { Amplify } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction, HubInternal } from '@aws-amplify/core/internals/utils';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { AuthValidationErrorCode } from '../../../errors/types/validation.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import { getUserContextData } from '../utils/userContextData.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../types/errors.mjs';
import { createConfirmSignUpClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createConfirmSignUpClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';
import { autoSignInStore } from '../../../client/utils/store/autoSignInStore.mjs';
import '../../../client/utils/store/signInStore.mjs';
import { resetAutoSignIn } from './autoSignIn.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Confirms a new user account.
 *
 * @param input -  The ConfirmSignUpInput object.
 * @returns ConfirmSignUpOutput
 * @throws -{@link ConfirmSignUpException }
 * Thrown due to an invalid confirmation code.
 * @throws -{@link AuthValidationErrorCode }
 * Thrown due to an empty confirmation code
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function confirmSignUp(input) {
    const { username, confirmationCode, options } = input;
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolId, userPoolClientId, userPoolEndpoint } = authConfig;
    const clientMetadata = options?.clientMetadata;
    assertValidationError(!!username, AuthValidationErrorCode.EmptyConfirmSignUpUsername);
    assertValidationError(!!confirmationCode, AuthValidationErrorCode.EmptyConfirmSignUpCode);
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const confirmSignUpClient = createConfirmSignUpClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { Session: session } = await confirmSignUpClient({
        region: getRegionFromUserPoolId(authConfig.userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmSignUp),
    }, {
        Username: username,
        ConfirmationCode: confirmationCode,
        ClientMetadata: clientMetadata,
        ForceAliasCreation: options?.forceAliasCreation,
        ClientId: authConfig.userPoolClientId,
        UserContextData,
    });
    return new Promise((resolve, reject) => {
        try {
            const signUpOut = {
                isSignUpComplete: true,
                nextStep: {
                    signUpStep: 'DONE',
                },
            };
            const autoSignInStoreState = autoSignInStore.getState();
            if (!autoSignInStoreState.active ||
                autoSignInStoreState.username !== username) {
                resolve(signUpOut);
                resetAutoSignIn();
                return;
            }
            autoSignInStore.dispatch({ type: 'SET_SESSION', value: session });
            const stopListener = HubInternal.listen('auth-internal', ({ payload }) => {
                switch (payload.event) {
                    case 'autoSignIn':
                        resolve({
                            isSignUpComplete: true,
                            nextStep: {
                                signUpStep: 'COMPLETE_AUTO_SIGN_IN',
                            },
                        });
                        stopListener();
                }
            });
            HubInternal.dispatch('auth-internal', {
                event: 'confirmSignUp',
                data: signUpOut,
            });
        }
        catch (error) {
            reject(error);
        }
    });
}

export { confirmSignUp };
//# sourceMappingURL=confirmSignUp.mjs.map
