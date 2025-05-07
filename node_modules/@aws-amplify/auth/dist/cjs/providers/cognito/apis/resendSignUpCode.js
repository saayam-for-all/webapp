'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendSignUpCode = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const assertValidationError_1 = require("../../../errors/utils/assertValidationError");
const validation_1 = require("../../../errors/types/validation");
const parsers_1 = require("../../../foundation/parsers");
const utils_2 = require("../../../utils");
const userContextData_1 = require("../utils/userContextData");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
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
    (0, assertValidationError_1.assertValidationError)(!!username, validation_1.AuthValidationErrorCode.EmptySignUpUsername);
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolClientId, userPoolId, userPoolEndpoint } = authConfig;
    const clientMetadata = input.options?.clientMetadata;
    const UserContextData = (0, userContextData_1.getUserContextData)({
        username,
        userPoolId,
        userPoolClientId,
    });
    const resendConfirmationCode = (0, cognitoIdentityProvider_1.createResendConfirmationCodeClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { CodeDeliveryDetails } = await resendConfirmationCode({
        region: (0, parsers_1.getRegionFromUserPoolId)(authConfig.userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.ResendSignUpCode),
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
exports.resendSignUpCode = resendSignUpCode;
//# sourceMappingURL=resendSignUpCode.js.map
