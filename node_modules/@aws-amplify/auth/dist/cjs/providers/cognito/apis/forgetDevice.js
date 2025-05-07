'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetDevice = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const types_1 = require("../utils/types");
const parsers_1 = require("../../../foundation/parsers");
const tokenProvider_1 = require("../tokenProvider");
const utils_2 = require("../../../utils");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../factories");
/**
 * Forget a remembered device while authenticated.
 *
 * @param input - The ForgetDeviceInput object.
 * @throws - {@link ForgetDeviceException} - Cognito service errors thrown when
 * forgetting device with invalid device key
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function forgetDevice(input) {
    const { device: { id: externalDeviceKey } = { id: undefined } } = input ?? {};
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await (0, core_1.fetchAuthSession)();
    (0, types_1.assertAuthTokens)(tokens);
    const deviceMetadata = await tokenProvider_1.tokenOrchestrator.getDeviceMetadata();
    const currentDeviceKey = deviceMetadata?.deviceKey;
    if (!externalDeviceKey)
        (0, types_1.assertDeviceMetadata)(deviceMetadata);
    const serviceForgetDevice = (0, cognitoIdentityProvider_1.createForgetDeviceClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await serviceForgetDevice({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.ForgetDevice),
    }, {
        AccessToken: tokens.accessToken.toString(),
        DeviceKey: externalDeviceKey ?? currentDeviceKey,
    });
    if (!externalDeviceKey || externalDeviceKey === currentDeviceKey)
        await tokenProvider_1.tokenOrchestrator.clearDeviceMetadata();
}
exports.forgetDevice = forgetDevice;
//# sourceMappingURL=forgetDevice.js.map
