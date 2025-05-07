'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectInflightDeviceRegistration = exports.resolveInflightDeviceRegistration = exports.getInflightDeviceRegistration = void 0;
const errors_1 = require("../../../errors");
const inflightDeviceRegistrationResolver = {};
let inflightDeviceRegistration = new Promise((resolve, reject) => {
    inflightDeviceRegistrationResolver.resolve = resolve;
    inflightDeviceRegistrationResolver.reject = reject;
});
const getInflightDeviceRegistration = () => inflightDeviceRegistration;
exports.getInflightDeviceRegistration = getInflightDeviceRegistration;
const resolveInflightDeviceRegistration = () => {
    inflightDeviceRegistrationResolver.resolve?.();
    // release promise from memory
    inflightDeviceRegistration = undefined;
};
exports.resolveInflightDeviceRegistration = resolveInflightDeviceRegistration;
const rejectInflightDeviceRegistration = (underlyingError) => {
    inflightDeviceRegistrationResolver.reject?.(new errors_1.PushNotificationError({
        name: 'DeviceRegistrationFailed',
        message: 'Failed to register device for push notifications.',
        underlyingError,
    }));
    // release promise from memory
    inflightDeviceRegistration = undefined;
};
exports.rejectInflightDeviceRegistration = rejectInflightDeviceRegistration;
//# sourceMappingURL=inflightDeviceRegistration.js.map
