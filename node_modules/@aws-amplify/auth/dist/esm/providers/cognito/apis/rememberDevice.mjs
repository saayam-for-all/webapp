import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { assertAuthTokens, assertDeviceMetadata } from '../utils/types.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import '../utils/refreshAuthTokens.mjs';
import '../tokenProvider/errorHelpers.mjs';
import { tokenOrchestrator } from '../tokenProvider/tokenProvider.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../types/errors.mjs';
import { createUpdateDeviceStatusClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createUpdateDeviceStatusClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Marks device as remembered while authenticated.
 *
 * @throws - {@link UpdateDeviceStatusException} - Cognito service errors thrown when
 * setting device status to remembered using an invalid device key.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function rememberDevice() {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession();
    assertAuthTokens(tokens);
    const deviceMetadata = await tokenOrchestrator?.getDeviceMetadata();
    assertDeviceMetadata(deviceMetadata);
    const updateDeviceStatus = createUpdateDeviceStatusClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await updateDeviceStatus({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.RememberDevice),
    }, {
        AccessToken: tokens.accessToken.toString(),
        DeviceKey: deviceMetadata.deviceKey,
        DeviceRememberedStatus: 'remembered',
    });
}

export { rememberDevice };
//# sourceMappingURL=rememberDevice.mjs.map
