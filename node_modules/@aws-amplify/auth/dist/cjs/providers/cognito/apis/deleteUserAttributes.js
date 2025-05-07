'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAttributes = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const parsers_1 = require("../../../foundation/parsers");
const types_1 = require("../utils/types");
const utils_2 = require("../../../utils");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
/**
 * Deletes user attributes.
 *
 * @param input -  The DeleteUserAttributesInput object
 * @throws  -{@link DeleteUserAttributesException } - Thrown due to invalid attribute.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function deleteUserAttributes(input) {
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userAttributeKeys } = input;
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await (0, core_1.fetchAuthSession)({ forceRefresh: false });
    (0, types_1.assertAuthTokens)(tokens);
    const deleteUserAttributesClient = (0, cognitoIdentityProvider_1.createDeleteUserAttributesClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await deleteUserAttributesClient({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.DeleteUserAttributes),
    }, {
        AccessToken: tokens.accessToken.toString(),
        UserAttributeNames: userAttributeKeys,
    });
}
exports.deleteUserAttributes = deleteUserAttributes;
//# sourceMappingURL=deleteUserAttributes.js.map
