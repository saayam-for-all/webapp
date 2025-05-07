import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { assertAuthTokens } from '../utils/types.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../types/errors.mjs';
import { createSetUserMFAPreferenceClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createSetUserMFAPreferenceClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Updates the MFA preference of the user.
 *
 * @param input - The UpdateMFAPreferenceInput object.
 * @throws -{@link SetUserMFAPreferenceException } - Service error thrown when the MFA preference cannot be updated.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function updateMFAPreference(input) {
    const { sms, totp, email } = input;
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession({ forceRefresh: false });
    assertAuthTokens(tokens);
    const setUserMFAPreference = createSetUserMFAPreferenceClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await setUserMFAPreference({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.UpdateMFAPreference),
    }, {
        AccessToken: tokens.accessToken.toString(),
        SMSMfaSettings: getMFASettings(sms),
        SoftwareTokenMfaSettings: getMFASettings(totp),
        EmailMfaSettings: getMFASettings(email),
    });
}
function getMFASettings(mfaPreference) {
    if (mfaPreference === 'DISABLED') {
        return {
            Enabled: false,
        };
    }
    else if (mfaPreference === 'PREFERRED') {
        return {
            Enabled: true,
            PreferredMfa: true,
        };
    }
    else if (mfaPreference === 'ENABLED') {
        return {
            Enabled: true,
        };
    }
    else if (mfaPreference === 'NOT_PREFERRED') {
        return {
            Enabled: true,
            PreferredMfa: false,
        };
    }
}

export { getMFASettings, updateMFAPreference };
//# sourceMappingURL=updateMFAPreference.mjs.map
