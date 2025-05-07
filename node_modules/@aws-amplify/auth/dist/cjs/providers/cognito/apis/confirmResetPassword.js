'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmResetPassword = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const validation_1 = require("../../../errors/types/validation");
const assertValidationError_1 = require("../../../errors/utils/assertValidationError");
const utils_2 = require("../../../utils");
const userContextData_1 = require("../utils/userContextData");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
const parsers_1 = require("../../../foundation/parsers");
/**
 * Confirms the new password and verification code to reset the password.
 *
 * @param input -  The ConfirmResetPasswordInput object.
 * @throws -{@link ConfirmForgotPasswordException }
 * Thrown due to an invalid confirmation code or password.
 * @throws -{@link AuthValidationErrorCode }
 * Thrown due to an empty confirmation code, password or username.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function confirmResetPassword(input) {
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolClientId, userPoolId, userPoolEndpoint } = authConfig;
    const { username, newPassword } = input;
    (0, assertValidationError_1.assertValidationError)(!!username, validation_1.AuthValidationErrorCode.EmptyConfirmResetPasswordUsername);
    (0, assertValidationError_1.assertValidationError)(!!newPassword, validation_1.AuthValidationErrorCode.EmptyConfirmResetPasswordNewPassword);
    const code = input.confirmationCode;
    (0, assertValidationError_1.assertValidationError)(!!code, validation_1.AuthValidationErrorCode.EmptyConfirmResetPasswordConfirmationCode);
    const metadata = input.options?.clientMetadata;
    const UserContextData = (0, userContextData_1.getUserContextData)({
        username,
        userPoolId,
        userPoolClientId,
    });
    const confirmForgotPassword = (0, cognitoIdentityProvider_1.createConfirmForgotPasswordClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await confirmForgotPassword({
        region: (0, parsers_1.getRegionFromUserPoolId)(authConfig.userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.ConfirmResetPassword),
    }, {
        Username: username,
        ConfirmationCode: code,
        Password: newPassword,
        ClientMetadata: metadata,
        ClientId: authConfig.userPoolClientId,
        UserContextData,
    });
}
exports.confirmResetPassword = confirmResetPassword;
//# sourceMappingURL=confirmResetPassword.js.map
