import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { assertAuthTokens } from '../utils/types.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../types/errors.mjs';
import { createGetUserAttributeVerificationCodeClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createGetUserAttributeVerificationCodeClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Resends user's confirmation code when updating attributes while authenticated.
 *
 * @param input - The SendUserAttributeVerificationCodeInput object
 * @returns SendUserAttributeVerificationCodeOutput
 * @throws - {@link GetUserAttributeVerificationException}
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
const sendUserAttributeVerificationCode = async (input) => {
    const { userAttributeKey, options } = input;
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    const clientMetadata = options?.clientMetadata;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession({ forceRefresh: false });
    assertAuthTokens(tokens);
    const getUserAttributeVerificationCode = createGetUserAttributeVerificationCodeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { CodeDeliveryDetails } = await getUserAttributeVerificationCode({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.SendUserAttributeVerificationCode),
    }, {
        AccessToken: tokens.accessToken.toString(),
        ClientMetadata: clientMetadata,
        AttributeName: userAttributeKey,
    });
    const { DeliveryMedium, AttributeName, Destination } = {
        ...CodeDeliveryDetails,
    };
    return {
        destination: Destination,
        deliveryMedium: DeliveryMedium,
        attributeName: AttributeName,
    };
};

export { sendUserAttributeVerificationCode };
//# sourceMappingURL=sendUserAttributeVerificationCode.mjs.map
