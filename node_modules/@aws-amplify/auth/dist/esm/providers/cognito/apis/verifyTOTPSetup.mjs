import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { AuthValidationErrorCode } from '../../../errors/types/validation.mjs';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { assertAuthTokens } from '../utils/types.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../types/errors.mjs';
import { createVerifySoftwareTokenClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createVerifySoftwareTokenClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Verifies an OTP code retrieved from an associated authentication app.
 *
 * @param input - The VerifyTOTPSetupInput
 * @throws  -{@link VerifySoftwareTokenException }:
 * Thrown due to an invalid MFA token.
 * @throws  -{@link AuthValidationErrorCode }:
 * Thrown when `code` is not defined.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function verifyTOTPSetup(input) {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { code, options } = input;
    assertValidationError(!!code, AuthValidationErrorCode.EmptyVerifyTOTPSetupCode);
    const { tokens } = await fetchAuthSession({ forceRefresh: false });
    assertAuthTokens(tokens);
    const verifySoftwareToken = createVerifySoftwareTokenClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await verifySoftwareToken({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.VerifyTOTPSetup),
    }, {
        AccessToken: tokens.accessToken.toString(),
        UserCode: code,
        FriendlyDeviceName: options?.friendlyDeviceName,
    });
}

export { verifyTOTPSetup };
//# sourceMappingURL=verifyTOTPSetup.mjs.map
