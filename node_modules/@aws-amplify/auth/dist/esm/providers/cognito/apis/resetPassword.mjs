import { Amplify } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { AuthValidationErrorCode } from '../../../errors/types/validation.mjs';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import { getUserContextData } from '../utils/userContextData.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../types/errors.mjs';
import { createForgotPasswordClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createForgotPasswordClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
    assertValidationError(!!username, AuthValidationErrorCode.EmptyResetPasswordUsername);
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolClientId, userPoolId, userPoolEndpoint } = authConfig;
    const clientMetadata = input.options?.clientMetadata;
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const forgotPassword = createForgotPasswordClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const res = await forgotPassword({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ResetPassword),
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

export { resetPassword };
//# sourceMappingURL=resetPassword.mjs.map
