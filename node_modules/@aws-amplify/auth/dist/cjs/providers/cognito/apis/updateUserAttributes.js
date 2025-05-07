'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserAttributes = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const types_1 = require("../utils/types");
const parsers_1 = require("../../../foundation/parsers");
const apiHelpers_1 = require("../utils/apiHelpers");
const utils_2 = require("../../../utils");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
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
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    const clientMetadata = options?.clientMetadata;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await (0, core_1.fetchAuthSession)({ forceRefresh: false });
    (0, types_1.assertAuthTokens)(tokens);
    const updateUserAttributesClient = (0, cognitoIdentityProvider_1.createUpdateUserAttributesClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { CodeDeliveryDetailsList } = await updateUserAttributesClient({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.UpdateUserAttributes),
    }, {
        AccessToken: tokens.accessToken.toString(),
        ClientMetadata: clientMetadata,
        UserAttributes: (0, apiHelpers_1.toAttributeType)(userAttributes),
    });
    return {
        ...getConfirmedAttributes(userAttributes),
        ...getUnConfirmedAttributes(CodeDeliveryDetailsList),
    };
};
exports.updateUserAttributes = updateUserAttributes;
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
//# sourceMappingURL=updateUserAttributes.js.map
