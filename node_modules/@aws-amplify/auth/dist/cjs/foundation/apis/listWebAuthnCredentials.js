'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWebAuthnCredentials = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const types_1 = require("../../providers/cognito/utils/types");
const factories_1 = require("../../providers/cognito/factories");
const parsers_1 = require("../parsers");
const utils_2 = require("../../utils");
const cognitoIdentityProvider_1 = require("../factories/serviceClients/cognitoIdentityProvider");
async function listWebAuthnCredentials(amplify, input) {
    const authConfig = amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await amplify.Auth.fetchAuthSession();
    (0, types_1.assertAuthTokens)(tokens);
    const listWebAuthnCredentialsResult = (0, cognitoIdentityProvider_1.createListWebAuthnCredentialsClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { Credentials: commandCredentials = [], NextToken: nextToken } = await listWebAuthnCredentialsResult({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.ListWebAuthnCredentials),
    }, {
        AccessToken: tokens.accessToken.toString(),
        MaxResults: input?.pageSize,
        NextToken: input?.nextToken,
    });
    const credentials = commandCredentials.map(item => ({
        credentialId: item.CredentialId,
        friendlyCredentialName: item.FriendlyCredentialName,
        relyingPartyId: item.RelyingPartyId,
        authenticatorAttachment: item.AuthenticatorAttachment,
        authenticatorTransports: item.AuthenticatorTransports,
        createdAt: item.CreatedAt ? new Date(item.CreatedAt * 1000) : undefined,
    }));
    return {
        credentials,
        nextToken,
    };
}
exports.listWebAuthnCredentials = listWebAuthnCredentials;
//# sourceMappingURL=listWebAuthnCredentials.js.map
