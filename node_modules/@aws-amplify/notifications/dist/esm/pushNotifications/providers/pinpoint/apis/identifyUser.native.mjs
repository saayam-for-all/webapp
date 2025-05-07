import { PushNotificationAction } from '@aws-amplify/core/internals/utils';
import { getEndpointId, updateEndpoint } from '@aws-amplify/core/internals/providers/pinpoint';
import { assertIsInitialized } from '../../../errors/errorHelpers.mjs';
import { getPushNotificationUserAgentString } from '../../../utils/getPushNotificationUserAgentString.mjs';
import { resolveCredentials } from '../../../utils/resolveCredentials.mjs';
import '../utils/createMessageEventRecorder.mjs';
import { getChannelType } from '../utils/getChannelType.mjs';
import { getInflightDeviceRegistration } from '../utils/inflightDeviceRegistration.mjs';
import { resolveConfig } from '../utils/resolveConfig.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const identifyUser = async ({ userId, userProfile, options, }) => {
    assertIsInitialized();
    const { credentials, identityId } = await resolveCredentials();
    const { appId, region } = resolveConfig();
    const { address, optOut, userAttributes } = options ?? {};
    if (!(await getEndpointId(appId, 'PushNotification'))) {
        // if there is no cached endpoint id, wait for successful endpoint creation before continuing
        await getInflightDeviceRegistration();
    }
    await updateEndpoint({
        address,
        channelType: getChannelType(),
        optOut,
        appId,
        category: 'PushNotification',
        credentials,
        identityId,
        region,
        userAttributes,
        userId,
        userProfile,
        userAgentValue: getPushNotificationUserAgentString(PushNotificationAction.IdentifyUser),
    });
};

export { identifyUser };
//# sourceMappingURL=identifyUser.native.mjs.map
