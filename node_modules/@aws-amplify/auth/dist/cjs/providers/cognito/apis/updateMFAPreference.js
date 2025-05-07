'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMFASettings = exports.updateMFAPreference = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const parsers_1 = require("../../../foundation/parsers");
const types_1 = require("../utils/types");
const utils_2 = require("../../../utils");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
/**
 * Updates the MFA preference of the user.
 *
 * @param input - The UpdateMFAPreferenceInput object.
 * @throws -{@link SetUserMFAPreferenceException } - Service error thrown when the MFA preference cannot be updated.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function updateMFAPreference(input) {
    const { sms, totp, email } = input;
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await (0, core_1.fetchAuthSession)({ forceRefresh: false });
    (0, types_1.assertAuthTokens)(tokens);
    const setUserMFAPreference = (0, cognitoIdentityProvider_1.createSetUserMFAPreferenceClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await setUserMFAPreference({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.UpdateMFAPreference),
    }, {
        AccessToken: tokens.accessToken.toString(),
        SMSMfaSettings: getMFASettings(sms),
        SoftwareTokenMfaSettings: getMFASettings(totp),
        EmailMfaSettings: getMFASettings(email),
    });
}
exports.updateMFAPreference = updateMFAPreference;
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
exports.getMFASettings = getMFASettings;
//# sourceMappingURL=updateMFAPreference.js.map
