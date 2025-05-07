import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { assertAuthTokens } from '../utils/types.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../types/errors.mjs';
import { createListDevicesClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createListDevicesClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Cognito Documentation for max device
// https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListDevices.html#API_ListDevices_RequestSyntax
const MAX_DEVICES = 60;
/**
 * Fetches devices that have been remembered using {@link rememberDevice}
 * for the currently authenticated user.
 *
 * @returns FetchDevicesOutput
 * @throws {@link ListDevicesException}
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function fetchDevices() {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession();
    assertAuthTokens(tokens);
    const listDevices = createListDevicesClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const response = await listDevices({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.FetchDevices),
    }, {
        AccessToken: tokens.accessToken.toString(),
        Limit: MAX_DEVICES,
    });
    return parseDevicesResponse(response.Devices ?? []);
}
const parseDevicesResponse = async (devices) => {
    return devices.map(({ DeviceKey: id = '', DeviceAttributes = [], DeviceCreateDate, DeviceLastModifiedDate, DeviceLastAuthenticatedDate, }) => {
        let deviceName;
        const attributes = DeviceAttributes.reduce((attrs, { Name, Value }) => {
            if (Name && Value) {
                if (Name === 'device_name')
                    deviceName = Value;
                attrs[Name] = Value;
            }
            return attrs;
        }, {});
        const result = {
            id,
            name: deviceName,
            attributes,
            createDate: DeviceCreateDate
                ? new Date(DeviceCreateDate * 1000)
                : undefined,
            lastModifiedDate: DeviceLastModifiedDate
                ? new Date(DeviceLastModifiedDate * 1000)
                : undefined,
            lastAuthenticatedDate: DeviceLastAuthenticatedDate
                ? new Date(DeviceLastAuthenticatedDate * 1000)
                : undefined,
        };
        return result;
    });
};

export { fetchDevices };
//# sourceMappingURL=fetchDevices.mjs.map
