'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceName = void 0;
const react_native_1 = require("@aws-amplify/react-native");
/**
 * Retrieves the device name using name in ios and model in android,
 *
 * @returns {Promise<string>} A promise that resolves with a string representing the device name.
 *
 * Example Output:
 * ios: 'iPhone' / 'user's iPhone'
 * android: 'sdk_gphone64_arm64'
 */
const getDeviceName = async () => (0, react_native_1.getDeviceName)();
exports.getDeviceName = getDeviceName;
//# sourceMappingURL=getDeviceName.native.js.map
