import { PushNotificationError } from '../../../errors/PushNotificationError.mjs';
import '../../../errors/errorHelpers.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const inflightDeviceRegistrationResolver = {};
let inflightDeviceRegistration = new Promise((resolve, reject) => {
    inflightDeviceRegistrationResolver.resolve = resolve;
    inflightDeviceRegistrationResolver.reject = reject;
});
const getInflightDeviceRegistration = () => inflightDeviceRegistration;
const resolveInflightDeviceRegistration = () => {
    inflightDeviceRegistrationResolver.resolve?.();
    // release promise from memory
    inflightDeviceRegistration = undefined;
};
const rejectInflightDeviceRegistration = (underlyingError) => {
    inflightDeviceRegistrationResolver.reject?.(new PushNotificationError({
        name: 'DeviceRegistrationFailed',
        message: 'Failed to register device for push notifications.',
        underlyingError,
    }));
    // release promise from memory
    inflightDeviceRegistration = undefined;
};

export { getInflightDeviceRegistration, rejectInflightDeviceRegistration, resolveInflightDeviceRegistration };
//# sourceMappingURL=inflightDeviceRegistration.mjs.map
