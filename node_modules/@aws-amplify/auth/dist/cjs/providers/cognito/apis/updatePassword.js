'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const validation_1 = require("../../../errors/types/validation");
const assertValidationError_1 = require("../../../errors/utils/assertValidationError");
const parsers_1 = require("../../../foundation/parsers");
const types_1 = require("../utils/types");
const utils_2 = require("../../../utils");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
/**
 * Updates user's password while authenticated.
 *
 * @param input - The UpdatePasswordInput object.
 * @throws - {@link ChangePasswordException} - Cognito service errors thrown when updating a password.
 * @throws - {@link AuthValidationErrorCode} - Validation errors thrown when oldPassword or newPassword are empty.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function updatePassword(input) {
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { oldPassword, newPassword } = input;
    (0, assertValidationError_1.assertValidationError)(!!oldPassword, validation_1.AuthValidationErrorCode.EmptyUpdatePassword);
    (0, assertValidationError_1.assertValidationError)(!!newPassword, validation_1.AuthValidationErrorCode.EmptyUpdatePassword);
    const { tokens } = await (0, core_1.fetchAuthSession)({ forceRefresh: false });
    (0, types_1.assertAuthTokens)(tokens);
    const changePassword = (0, cognitoIdentityProvider_1.createChangePasswordClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await changePassword({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.UpdatePassword),
    }, {
        AccessToken: tokens.accessToken.toString(),
        PreviousPassword: oldPassword,
        ProposedPassword: newPassword,
    });
}
exports.updatePassword = updatePassword;
//# sourceMappingURL=updatePassword.js.map
