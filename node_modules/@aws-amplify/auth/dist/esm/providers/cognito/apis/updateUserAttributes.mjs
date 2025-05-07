import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { assertAuthTokens } from '../utils/types.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { toAttributeType } from '../utils/apiHelpers.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../types/errors.mjs';
import { createUpdateUserAttributesClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createUpdateUserAttributesClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Updates user's attributes while authenticated.
 *
 * @param input - The UpdateUserAttributesInput object
 * @returns UpdateUserAttributesOutput
 * @throws - {@link UpdateUserAttributesException}
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
const updateUserAttributes = async (input) => {
    const { userAttributes, options } = input;
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    const clientMetadata = options?.clientMetadata;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession({ forceRefresh: false });
    assertAuthTokens(tokens);
    const updateUserAttributesClient = createUpdateUserAttributesClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { CodeDeliveryDetailsList } = await updateUserAttributesClient({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.UpdateUserAttributes),
    }, {
        AccessToken: tokens.accessToken.toString(),
        ClientMetadata: clientMetadata,
        UserAttributes: toAttributeType(userAttributes),
    });
    return {
        ...getConfirmedAttributes(userAttributes),
        ...getUnConfirmedAttributes(CodeDeliveryDetailsList),
    };
};
function getConfirmedAttributes(attributes) {
    const confirmedAttributes = {};
    Object.keys(attributes)?.forEach(key => {
        confirmedAttributes[key] = {
            isUpdated: true,
            nextStep: {
                updateAttributeStep: 'DONE',
            },
        };
    });
    return confirmedAttributes;
}
function getUnConfirmedAttributes(codeDeliveryDetailsList) {
    const unConfirmedAttributes = {};
    codeDeliveryDetailsList?.forEach(codeDeliveryDetails => {
        const { AttributeName, DeliveryMedium, Destination } = codeDeliveryDetails;
        if (AttributeName)
            unConfirmedAttributes[AttributeName] = {
                isUpdated: false,
                nextStep: {
                    updateAttributeStep: 'CONFIRM_ATTRIBUTE_WITH_CODE',
                    codeDeliveryDetails: {
                        attributeName: AttributeName,
                        deliveryMedium: DeliveryMedium,
                        destination: Destination,
                    },
                },
            };
    });
    return unConfirmedAttributes;
}

export { updateUserAttributes };
//# sourceMappingURL=updateUserAttributes.mjs.map
