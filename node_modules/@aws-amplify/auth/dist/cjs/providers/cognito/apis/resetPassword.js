'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const validation_1 = require("../../../errors/types/validation");
const assertValidationError_1 = require("../../../errors/utils/assertValidationError");
const parsers_1 = require("../../../foundation/parsers");
const utils_2 = require("../../../utils");
const userContextData_1 = require("../utils/userContextData");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
/**
 * Resets a user's password.
 *
 * @param input -  The ResetPasswordInput object.
 * @returns ResetPasswordOutput
 * @throws -{@link ForgotPasswordException }
 * Thrown due to an invalid confirmation code or password.
 * @throws -{@link AuthValidationErrorCode }
 * Thrown due to an empty username.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 **/
async function resetPassword(input) {
    const { username } = input;
    (0, assertValidationError_1.assertValidationError)(!!username, validation_1.AuthValidationErrorCode.EmptyResetPasswordUsername);
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolClientId, userPoolId, userPoolEndpoint } = authConfig;
    const clientMetadata = input.options?.clientMetadata;
    const UserContextData = (0, userContextData_1.getUserContextData)({
        username,
        userPoolId,
        userPoolClientId,
    });
    const forgotPassword = (0, cognitoIdentityProvider_1.createForgotPasswordClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const res = await forgotPassword({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.ResetPassword),
    }, {
        Username: username,
        ClientMetadata: clientMetadata,
        ClientId: userPoolClientId,
        UserContextData,
    });
    const codeDeliveryDetails = res.CodeDeliveryDetails;
    return {
        isPasswordReset: false,
        nextStep: {
            resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE',
            codeDeliveryDetails: {
                deliveryMedium: codeDeliveryDetails?.DeliveryMedium,
                destination: codeDeliveryDetails?.Destination,
                attributeName: codeDeliveryDetails?.AttributeName,
            },
        },
    };
}
exports.resetPassword = resetPassword;
//# sourceMappingURL=resetPassword.js.map
