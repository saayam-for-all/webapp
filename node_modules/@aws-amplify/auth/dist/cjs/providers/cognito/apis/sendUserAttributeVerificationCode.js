'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUserAttributeVerificationCode = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const types_1 = require("../utils/types");
const parsers_1 = require("../../../foundation/parsers");
const utils_2 = require("../../../utils");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
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
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    const clientMetadata = options?.clientMetadata;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await (0, core_1.fetchAuthSession)({ forceRefresh: false });
    (0, types_1.assertAuthTokens)(tokens);
    const getUserAttributeVerificationCode = (0, cognitoIdentityProvider_1.createGetUserAttributeVerificationCodeClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { CodeDeliveryDetails } = await getUserAttributeVerificationCode({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.SendUserAttributeVerificationCode),
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
exports.sendUserAttributeVerificationCode = sendUserAttributeVerificationCode;
//# sourceMappingURL=sendUserAttributeVerificationCode.js.map
