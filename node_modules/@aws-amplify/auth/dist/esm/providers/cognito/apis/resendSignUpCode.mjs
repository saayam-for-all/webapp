import { Amplify } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { AuthValidationErrorCode } from '../../../errors/types/validation.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import { getUserContextData } from '../utils/userContextData.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../types/errors.mjs';
import { createResendConfirmationCodeClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createResendConfirmationCodeClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Resend the confirmation code while signing up
 *
 * @param input -  The ResendSignUpCodeInput object
 * @returns ResendSignUpCodeOutput
 * @throws service: {@link ResendConfirmationException } - Cognito service errors thrown when resending the code.
 * @throws validation: {@link AuthValidationErrorCode } - Validation errors thrown either username are not defined.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function resendSignUpCode(input) {
    const { username } = input;
    assertValidationError(!!username, AuthValidationErrorCode.EmptySignUpUsername);
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolClientId, userPoolId, userPoolEndpoint } = authConfig;
    const clientMetadata = input.options?.clientMetadata;
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const resendConfirmationCode = createResendConfirmationCodeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { CodeDeliveryDetails } = await resendConfirmationCode({
        region: getRegionFromUserPoolId(authConfig.userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ResendSignUpCode),
    }, {
        Username: username,
        ClientMetadata: clientMetadata,
        ClientId: authConfig.userPoolClientId,
        UserContextData,
    });
    const { DeliveryMedium, AttributeName, Destination } = {
        ...CodeDeliveryDetails,
    };
    return {
        destination: Destination,
        deliveryMedium: DeliveryMedium,
        attributeName: AttributeName
            ? AttributeName
            : undefined,
    };
}

export { resendSignUpCode };
//# sourceMappingURL=resendSignUpCode.mjs.map
