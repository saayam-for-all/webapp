import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { getMFAType, getMFATypes } from '../utils/signInHelpers.mjs';
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
import { createGetUserClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createGetUserClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Fetches the preferred MFA setting and enabled MFA settings for the user.
 *
 * @returns FetchMFAPreferenceOutput
 * @throws  -{@link GetUserException} : error thrown when the service fails to fetch MFA preference
 * and settings.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function fetchMFAPreference() {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession({ forceRefresh: false });
    assertAuthTokens(tokens);
    const getUser = createGetUserClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { PreferredMfaSetting, UserMFASettingList } = await getUser({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.FetchMFAPreference),
    }, {
        AccessToken: tokens.accessToken.toString(),
    });
    return {
        preferred: getMFAType(PreferredMfaSetting),
        enabled: getMFATypes(UserMFASettingList),
    };
}

export { fetchMFAPreference };
//# sourceMappingURL=fetchMFAPreference.mjs.map
