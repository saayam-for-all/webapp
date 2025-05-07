'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.rememberDevice = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const types_1 = require("../utils/types");
const parsers_1 = require("../../../foundation/parsers");
const tokenProvider_1 = require("../tokenProvider");
const utils_2 = require("../../../utils");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
/**
 * Marks device as remembered while authenticated.
 *
 * @throws - {@link UpdateDeviceStatusException} - Cognito service errors thrown when
 * setting device status to remembered using an invalid device key.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function rememberDevice() {
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await (0, core_1.fetchAuthSession)();
    (0, types_1.assertAuthTokens)(tokens);
    const deviceMetadata = await tokenProvider_1.tokenOrchestrator?.getDeviceMetadata();
    (0, types_1.assertDeviceMetadata)(deviceMetadata);
    const updateDeviceStatus = (0, cognitoIdentityProvider_1.createUpdateDeviceStatusClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await updateDeviceStatus({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.RememberDevice),
    }, {
        AccessToken: tokens.accessToken.toString(),
        DeviceKey: deviceMetadata.deviceKey,
        DeviceRememberedStatus: 'remembered',
    });
}
exports.rememberDevice = rememberDevice;
//# sourceMappingURL=rememberDevice.js.map
