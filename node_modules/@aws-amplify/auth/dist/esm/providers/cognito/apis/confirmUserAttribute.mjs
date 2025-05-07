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
import { createVerifyUserAttributeClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createVerifyUserAttributeClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Confirms a user attribute with the confirmation code.
 *
 * @param input -  The ConfirmUserAttributeInput object
 * @throws  -{@link AuthValidationErrorCode } -
 * Thrown when `confirmationCode` is not defined.
 * @throws  -{@link VerifyUserAttributeException } - Thrown due to an invalid confirmation code or attribute.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function confirmUserAttribute(input) {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { confirmationCode, userAttributeKey } = input;
    assertValidationError(!!confirmationCode, AuthValidationErrorCode.EmptyConfirmUserAttributeCode);
    const { tokens } = await fetchAuthSession({ forceRefresh: false });
    assertAuthTokens(tokens);
    const verifyUserAttribute = createVerifyUserAttributeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await verifyUserAttribute({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ConfirmUserAttribute),
    }, {
        AccessToken: tokens.accessToken.toString(),
        AttributeName: userAttributeKey,
        Code: confirmationCode,
    });
}

export { confirmUserAttribute };
//# sourceMappingURL=confirmUserAttribute.mjs.map
