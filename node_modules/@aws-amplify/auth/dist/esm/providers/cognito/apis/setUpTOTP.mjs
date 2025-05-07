import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { AuthError } from '../../../errors/AuthError.mjs';
import { SETUP_TOTP_EXCEPTION } from '../types/errors.mjs';
import { getTOTPSetupDetails } from '../utils/signInHelpers.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { assertAuthTokens } from '../utils/types.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import { createAssociateSoftwareTokenClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createAssociateSoftwareTokenClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Sets up TOTP for the user.
 *
 * @returns SetUpTOTPOutput
 * @throws -{@link AssociateSoftwareTokenException}
 * Thrown if a service occurs while setting up TOTP.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 **/
async function setUpTOTP() {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession({ forceRefresh: false });
    assertAuthTokens(tokens);
    const username = tokens.idToken?.payload['cognito:username'] ?? '';
    const associateSoftwareToken = createAssociateSoftwareTokenClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { SecretCode } = await associateSoftwareToken({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.SetUpTOTP),
    }, {
        AccessToken: tokens.accessToken.toString(),
    });
    if (!SecretCode) {
        // This should never happen.
        throw new AuthError({
            name: SETUP_TOTP_EXCEPTION,
            message: 'Failed to set up TOTP.',
        });
    }
    return getTOTPSetupDetails(SecretCode, JSON.stringify(username));
}

export { setUpTOTP };
//# sourceMappingURL=setUpTOTP.mjs.map
