'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMFAPreference = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const signInHelpers_1 = require("../utils/signInHelpers");
const parsers_1 = require("../../../foundation/parsers");
const types_1 = require("../utils/types");
const utils_2 = require("../../../utils");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
/**
 * Fetches the preferred MFA setting and enabled MFA settings for the user.
 *
 * @returns FetchMFAPreferenceOutput
 * @throws  -{@link GetUserException} : error thrown when the service fails to fetch MFA preference
 * and settings.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function fetchMFAPreference() {
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await (0, core_1.fetchAuthSession)({ forceRefresh: false });
    (0, types_1.assertAuthTokens)(tokens);
    const getUser = (0, cognitoIdentityProvider_1.createGetUserClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { PreferredMfaSetting, UserMFASettingList } = await getUser({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.FetchMFAPreference),
    }, {
        AccessToken: tokens.accessToken.toString(),
    });
    return {
        preferred: (0, signInHelpers_1.getMFAType)(PreferredMfaSetting),
        enabled: (0, signInHelpers_1.getMFATypes)(UserMFASettingList),
    };
}
exports.fetchMFAPreference = fetchMFAPreference;
//# sourceMappingURL=fetchMFAPreference.js.map
