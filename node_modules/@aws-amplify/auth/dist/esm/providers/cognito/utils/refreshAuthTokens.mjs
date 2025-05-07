import { deDupeAsyncFunction, assertTokenProviderConfig, decodeJWT } from '@aws-amplify/core/internals/utils';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { assertAuthTokensWithRefreshToken } from './types.mjs';
import { AuthError } from '../../../errors/AuthError.mjs';
import { createInitiateAuthClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createInitiateAuthClient.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../types/errors.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';
import { getUserContextData } from './userContextData.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const refreshAuthTokensFunction = async ({ tokens, authConfig, username, }) => {
    assertTokenProviderConfig(authConfig?.Cognito);
    const { userPoolId, userPoolClientId, userPoolEndpoint } = authConfig.Cognito;
    const region = getRegionFromUserPoolId(userPoolId);
    assertAuthTokensWithRefreshToken(tokens);
    const refreshTokenString = tokens.refreshToken;
    const AuthParameters = {
        REFRESH_TOKEN: refreshTokenString,
    };
    if (tokens.deviceMetadata?.deviceKey) {
        AuthParameters.DEVICE_KEY = tokens.deviceMetadata.deviceKey;
    }
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const initiateAuth = createInitiateAuthClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { AuthenticationResult } = await initiateAuth({ region }, {
        ClientId: userPoolClientId,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters,
        UserContextData,
    });
    const accessToken = decodeJWT(AuthenticationResult?.AccessToken ?? '');
    const idToken = AuthenticationResult?.IdToken
        ? decodeJWT(AuthenticationResult.IdToken)
        : undefined;
    const { iat } = accessToken.payload;
    // This should never happen. If it does, it's a bug from the service.
    if (!iat) {
        throw new AuthError({
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
const refreshAuthTokens = deDupeAsyncFunction(refreshAuthTokensFunction);
const refreshAuthTokensWithoutDedupe = refreshAuthTokensFunction;

export { refreshAuthTokens, refreshAuthTokensWithoutDedupe };
//# sourceMappingURL=refreshAuthTokens.mjs.map
