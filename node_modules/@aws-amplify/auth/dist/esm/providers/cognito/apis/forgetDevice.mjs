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
import { createForgetDeviceClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createForgetDeviceClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession();
    assertAuthTokens(tokens);
    const deviceMetadata = await tokenOrchestrator.getDeviceMetadata();
    const currentDeviceKey = deviceMetadata?.deviceKey;
    if (!externalDeviceKey)
        assertDeviceMetadata(deviceMetadata);
    const serviceForgetDevice = createForgetDeviceClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await serviceForgetDevice({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ForgetDevice),
    }, {
        AccessToken: tokens.accessToken.toString(),
        DeviceKey: externalDeviceKey ?? currentDeviceKey,
    });
    if (!externalDeviceKey || externalDeviceKey === currentDeviceKey)
        await tokenOrchestrator.clearDeviceMetadata();
}

export { forgetDevice };
//# sourceMappingURL=forgetDevice.mjs.map
