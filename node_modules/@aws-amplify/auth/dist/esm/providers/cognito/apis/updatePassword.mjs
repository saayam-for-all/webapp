import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { AuthValidationErrorCode } from '../../../errors/types/validation.mjs';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { assertAuthTokens } from '../utils/types.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../types/errors.mjs';
import { createChangePasswordClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createChangePasswordClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Updates user's password while authenticated.
 *
 * @param input - The UpdatePasswordInput object.
 * @throws - {@link ChangePasswordException} - Cognito service errors thrown when updating a password.
 * @throws - {@link AuthValidationErrorCode} - Validation errors thrown when oldPassword or newPassword are empty.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function updatePassword(input) {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { oldPassword, newPassword } = input;
    assertValidationError(!!oldPassword, AuthValidationErrorCode.EmptyUpdatePassword);
    assertValidationError(!!newPassword, AuthValidationErrorCode.EmptyUpdatePassword);
    const { tokens } = await fetchAuthSession({ forceRefresh: false });
    assertAuthTokens(tokens);
    const changePassword = createChangePasswordClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await changePassword({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.UpdatePassword),
    }, {
        AccessToken: tokens.accessToken.toString(),
        PreviousPassword: oldPassword,
        ProposedPassword: newPassword,
    });
}

export { updatePassword };
//# sourceMappingURL=updatePassword.mjs.map
