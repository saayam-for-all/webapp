import { getDeviceName as getDeviceName$1 } from '@aws-amplify/react-native';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Retrieves the device name using name in ios and model in android,
 *
 * @returns {Promise<string>} A promise that resolves with a string representing the device name.
 *
 * Example Output:
 * ios: 'iPhone' / 'user's iPhone'
 * android: 'sdk_gphone64_arm64'
 */
const getDeviceName = async () => getDeviceName$1();

export { getDeviceName };
//# sourceMappingURL=getDeviceName.native.mjs.map
