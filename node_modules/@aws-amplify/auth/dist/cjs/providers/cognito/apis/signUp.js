'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const assertValidationError_1 = require("../../../errors/utils/assertValidationError");
const validation_1 = require("../../../errors/types/validation");
const parsers_1 = require("../../../foundation/parsers");
const apiHelpers_1 = require("../utils/apiHelpers");
const signUpHelpers_1 = require("../utils/signUpHelpers");
const userContextData_1 = require("../utils/userContextData");
const utils_2 = require("../../../utils");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
const store_1 = require("../../../client/utils/store");
const autoSignIn_1 = require("./autoSignIn");
/**
 * Creates a user
 *
 * @param input - The SignUpInput object
 * @returns SignUpOutput
 * @throws service: {@link SignUpException } - Cognito service errors thrown during the sign-up process.
 * @throws validation: {@link AuthValidationErrorCode } - Validation errors thrown either username or password
 *  are not defined.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function signUp(input) {
    const { username, password, options } = input;
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    const signUpVerificationMethod = authConfig?.signUpVerificationMethod ?? 'code';
    const { clientMetadata, validationData, autoSignIn } = input.options ?? {};
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    (0, assertValidationError_1.assertValidationError)(!!username, validation_1.AuthValidationErrorCode.EmptySignUpUsername);
    const signInServiceOptions = typeof autoSignIn !== 'boolean' ? autoSignIn : undefined;
    const signInInput = {
        username,
        options: signInServiceOptions,
    };
    // if the authFlowType is 'CUSTOM_WITHOUT_SRP' then we don't include the password
    if (signInServiceOptions?.authFlowType !== 'CUSTOM_WITHOUT_SRP') {
        signInInput.password = password;
    }
    const { userPoolId, userPoolClientId, userPoolEndpoint } = authConfig;
    const signUpClient = (0, cognitoIdentityProvider_1.createSignUpClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const signUpClientInput = {
        Username: username,
        Password: undefined,
        UserAttributes: options?.userAttributes && (0, apiHelpers_1.toAttributeType)(options?.userAttributes),
        ClientMetadata: clientMetadata,
        ValidationData: validationData && (0, apiHelpers_1.toAttributeType)(validationData),
        ClientId: userPoolClientId,
        UserContextData: (0, userContextData_1.getUserContextData)({
            username,
            userPoolId,
            userPoolClientId,
        }),
    };
    if (password) {
        signUpClientInput.Password = password;
    }
    const { UserSub: userId, CodeDeliveryDetails: cdd, UserConfirmed: userConfirmed, Session: session, } = await signUpClient({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.SignUp),
    }, signUpClientInput);
    if (signInServiceOptions || autoSignIn === true) {
        store_1.autoSignInStore.dispatch({ type: 'START' });
        store_1.autoSignInStore.dispatch({ type: 'SET_USERNAME', value: username });
        store_1.autoSignInStore.dispatch({ type: 'SET_SESSION', value: session });
    }
    const codeDeliveryDetails = {
        destination: cdd?.Destination,
        deliveryMedium: cdd?.DeliveryMedium,
        attributeName: cdd?.AttributeName,
    };
    const isSignUpComplete = !!userConfirmed;
    const isAutoSignInStarted = store_1.autoSignInStore.getState().active;
    // Sign Up Complete
    // No Confirm Sign In Step Required
    if (isSignUpComplete) {
        if (isAutoSignInStarted) {
            (0, autoSignIn_1.setAutoSignIn)((0, signUpHelpers_1.autoSignInUserConfirmed)(signInInput));
            return {
                isSignUpComplete: true,
                nextStep: {
                    signUpStep: 'COMPLETE_AUTO_SIGN_IN',
                },
                userId,
            };
        }
        return {
            isSignUpComplete: true,
            nextStep: {
                signUpStep: 'DONE',
            },
            userId,
        };
    }
    // Sign Up Not Complete
    // Confirm Sign Up Step Required
    if (isAutoSignInStarted) {
        // Confirmation Via Link Occurs In Separate Context
        // AutoSignIn Fn Will Initiate Polling Once Executed
        if (signUpVerificationMethod === 'link') {
            (0, autoSignIn_1.setAutoSignIn)((0, signUpHelpers_1.autoSignInWhenUserIsConfirmedWithLink)(signInInput));
            return {
                isSignUpComplete: false,
                nextStep: {
                    signUpStep: 'COMPLETE_AUTO_SIGN_IN',
                    codeDeliveryDetails,
                },
                userId,
            };
        }
        // Confirmation Via Code Occurs In Same Context
        // AutoSignIn Next Step Will Be Returned From Confirm Sign Up
        (0, signUpHelpers_1.handleCodeAutoSignIn)(signInInput);
    }
    return {
        isSignUpComplete: false,
        nextStep: {
            signUpStep: 'CONFIRM_SIGN_UP',
            codeDeliveryDetails,
        },
        userId,
    };
}
exports.signUp = signUp;
//# sourceMappingURL=signUp.js.map
