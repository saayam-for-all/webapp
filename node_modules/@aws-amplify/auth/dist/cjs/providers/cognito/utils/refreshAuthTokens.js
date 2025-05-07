'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAuthTokensWithoutDedupe = exports.refreshAuthTokens = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const parsers_1 = require("../../../foundation/parsers");
const types_1 = require("../utils/types");
const AuthError_1 = require("../../../errors/AuthError");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
const userContextData_1 = require("./userContextData");
const refreshAuthTokensFunction = async ({ tokens, authConfig, username, }) => {
    (0, utils_1.assertTokenProviderConfig)(authConfig?.Cognito);
    const { userPoolId, userPoolClientId, userPoolEndpoint } = authConfig.Cognito;
    const region = (0, parsers_1.getRegionFromUserPoolId)(userPoolId);
    (0, types_1.assertAuthTokensWithRefreshToken)(tokens);
    const refreshTokenString = tokens.refreshToken;
    const AuthParameters = {
        REFRESH_TOKEN: refreshTokenString,
    };
    if (tokens.deviceMetadata?.deviceKey) {
        AuthParameters.DEVICE_KEY = tokens.deviceMetadata.deviceKey;
    }
    const UserContextData = (0, userContextData_1.getUserContextData)({
        username,
        userPoolId,
        userPoolClientId,
    });
    const initiateAuth = (0, cognitoIdentityProvider_1.createInitiateAuthClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { AuthenticationResult } = await initiateAuth({ region }, {
        ClientId: userPoolClientId,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters,
        UserContextData,
    });
    const accessToken = (0, utils_1.decodeJWT)(AuthenticationResult?.AccessToken ?? '');
    const idToken = AuthenticationResult?.IdToken
        ? (0, utils_1.decodeJWT)(AuthenticationResult.IdToken)
        : undefined;
    const { iat } = accessToken.payload;
    // This should never happen. If it does, it's a bug from the service.
    if (!iat) {
        throw new AuthError_1.AuthError({
            name: 'iatNotFoundException',
            message: 'iat not found in access token',
        });
    }
    const clockDrift = iat * 1000 - new Date().getTime();
    return {
        accessToken,
        idToken,
        clockDrift,
        refreshToken: refreshTokenString,
        username,
    };
};
exports.refreshAuthTokens = (0, utils_1.deDupeAsyncFunction)(refreshAuthTokensFunction);
exports.refreshAuthTokensWithoutDedupe = refreshAuthTokensFunction;
//# sourceMappingURL=refreshAuthTokens.js.map
