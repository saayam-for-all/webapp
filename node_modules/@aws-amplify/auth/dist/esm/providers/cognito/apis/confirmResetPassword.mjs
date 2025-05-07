import { Amplify } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { AuthValidationErrorCode } from '../../../errors/types/validation.mjs';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import { getUserContextData } from '../utils/userContextData.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../types/errors.mjs';
import { createConfirmForgotPasswordClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createConfirmForgotPasswordClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolClientId, userPoolId, userPoolEndpoint } = authConfig;
    const { username, newPassword } = input;
    assertValidationError(!!username, AuthValidationErrorCode.EmptyConfirmResetPasswordUsername);
    assertValidationError(!!newPassword, AuthValidationErrorCode.EmptyConfirmResetPasswordNewPassword);
    const code = input.confirmationCode;
    assertValidationError(!!code, AuthValidationErrorCode.EmptyConfirmResetPasswordConfirmationCode);
    const metadata = input.options?.clientMetadata;
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const confirmForgotPassword = createConfirmForgotPasswordClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await confirmForgotPassword({
        region: getRegionFromUserPoolId(authConfig.userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmResetPassword),
    }, {
        Username: username,
        ConfirmationCode: code,
        Password: newPassword,
        ClientMetadata: metadata,
        ClientId: authConfig.userPoolClientId,
        UserContextData,
    });
}

export { confirmResetPassword };
//# sourceMappingURL=confirmResetPassword.mjs.map
