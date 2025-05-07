'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWebAuthnCredential = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const types_1 = require("../../providers/cognito/utils/types");
const factories_1 = require("../../providers/cognito/factories");
const parsers_1 = require("../parsers");
const utils_2 = require("../../utils");
const cognitoIdentityProvider_1 = require("../factories/serviceClients/cognitoIdentityProvider");
async function deleteWebAuthnCredential(amplify, input) {
    const authConfig = amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await amplify.Auth.fetchAuthSession();
    (0, types_1.assertAuthTokens)(tokens);
    const deleteWebAuthnCredentialResult = (0, cognitoIdentityProvider_1.createDeleteWebAuthnCredentialClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await deleteWebAuthnCredentialResult({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.DeleteWebAuthnCredential),
    }, {
        AccessToken: tokens.accessToken.toString(),
        CredentialId: input.credentialId,
    });
}
exports.deleteWebAuthnCredential = deleteWebAuthnCredential;
//# sourceMappingURL=deleteWebAuthnCredential.js.map
