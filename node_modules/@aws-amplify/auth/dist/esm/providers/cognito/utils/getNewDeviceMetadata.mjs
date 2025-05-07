import { base64Encoder, getDeviceName } from '@aws-amplify/core/internals/utils';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../types/errors.mjs';
import { createConfirmDeviceClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createConfirmDeviceClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { getAuthenticationHelper } from './srp/getAuthenticationHelper.mjs';
import { getBytesFromHex } from './srp/getBytesFromHex.mjs';
import '@aws-crypto/sha256-js';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * This function is used to kick off the device management flow.
 *
 * If an error is thrown while generating a hash device or calling the `ConfirmDevice`
 * client, then this API will ignore the error and return undefined. Otherwise the authentication
 * flow will not complete and the user won't be able to be signed in.
 *
 * @returns DeviceMetadata | undefined
 */
async function getNewDeviceMetadata({ userPoolId, userPoolEndpoint, newDeviceMetadata, accessToken, }) {
    if (!newDeviceMetadata)
        return undefined;
    const userPoolName = userPoolId.split('_')[1] || '';
    const authenticationHelper = await getAuthenticationHelper(userPoolName);
    const deviceKey = newDeviceMetadata?.DeviceKey;
    const deviceGroupKey = newDeviceMetadata?.DeviceGroupKey;
    try {
        await authenticationHelper.generateHashDevice(deviceGroupKey ?? '', deviceKey ?? '');
    }
    catch (errGenHash) {
        // TODO: log error here
        return undefined;
    }
    const deviceSecretVerifierConfig = {
        Salt: base64Encoder.convert(getBytesFromHex(authenticationHelper.getSaltToHashDevices())),
        PasswordVerifier: base64Encoder.convert(getBytesFromHex(authenticationHelper.getVerifierDevices())),
    };
    const randomPassword = authenticationHelper.getRandomPassword();
    try {
        const confirmDevice = createConfirmDeviceClient({
            endpointResolver: createCognitoUserPoolEndpointResolver({
                endpointOverride: userPoolEndpoint,
            }),
        });
        await confirmDevice({ region: getRegionFromUserPoolId(userPoolId) }, {
            AccessToken: accessToken,
            DeviceName: await getDeviceName(),
            DeviceKey: newDeviceMetadata?.DeviceKey,
            DeviceSecretVerifierConfig: deviceSecretVerifierConfig,
        });
        return {
            deviceKey,
            deviceGroupKey,
            randomPassword,
        };
    }
    catch (error) {
        // TODO: log error here
        return undefined;
    }
}

export { getNewDeviceMetadata };
//# sourceMappingURL=getNewDeviceMetadata.mjs.map
