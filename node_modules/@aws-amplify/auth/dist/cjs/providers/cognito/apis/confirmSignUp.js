'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmSignUp = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const assertValidationError_1 = require("../../../errors/utils/assertValidationError");
const validation_1 = require("../../../errors/types/validation");
const parsers_1 = require("../../../foundation/parsers");
const utils_2 = require("../../../utils");
const userContextData_1 = require("../utils/userContextData");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
const store_1 = require("../../../client/utils/store");
const autoSignIn_1 = require("./autoSignIn");
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
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolId, userPoolClientId, userPoolEndpoint } = authConfig;
    const clientMetadata = options?.clientMetadata;
    (0, assertValidationError_1.assertValidationError)(!!username, validation_1.AuthValidationErrorCode.EmptyConfirmSignUpUsername);
    (0, assertValidationError_1.assertValidationError)(!!confirmationCode, validation_1.AuthValidationErrorCode.EmptyConfirmSignUpCode);
    const UserContextData = (0, userContextData_1.getUserContextData)({
        username,
        userPoolId,
        userPoolClientId,
    });
    const confirmSignUpClient = (0, cognitoIdentityProvider_1.createConfirmSignUpClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { Session: session } = await confirmSignUpClient({
        region: (0, parsers_1.getRegionFromUserPoolId)(authConfig.userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.ConfirmSignUp),
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
            const autoSignInStoreState = store_1.autoSignInStore.getState();
            if (!autoSignInStoreState.active ||
                autoSignInStoreState.username !== username) {
                resolve(signUpOut);
                (0, autoSignIn_1.resetAutoSignIn)();
                return;
            }
            store_1.autoSignInStore.dispatch({ type: 'SET_SESSION', value: session });
            const stopListener = utils_1.HubInternal.listen('auth-internal', ({ payload }) => {
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
            utils_1.HubInternal.dispatch('auth-internal', {
                event: 'confirmSignUp',
                data: signUpOut,
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.confirmSignUp = confirmSignUp;
//# sourceMappingURL=confirmSignUp.js.map
