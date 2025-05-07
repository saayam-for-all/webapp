'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const parsers_1 = require("../../../foundation/parsers");
const types_1 = require("../utils/types");
const tokenProvider_1 = require("../tokenProvider");
const utils_2 = require("../../../utils");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
const signOut_1 = require("./signOut");
/**
 * Deletes a user from the user pool while authenticated.
 *
 * @throws - {@link DeleteUserException}
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function deleteUser() {
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await (0, core_1.fetchAuthSession)();
    (0, types_1.assertAuthTokens)(tokens);
    const serviceDeleteUser = (0, cognitoIdentityProvider_1.createDeleteUserClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await serviceDeleteUser({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.DeleteUser),
    }, {
        AccessToken: tokens.accessToken.toString(),
    });
    await tokenProvider_1.tokenOrchestrator.clearDeviceMetadata();
    await (0, signOut_1.signOut)();
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=deleteUser.js.map
