/**
 * Retrieves the device name using name in ios and model in android,
 *
 * @returns {Promise<string>} A promise that resolves with a string representing the device name.
 *
 * Example Output:
 * ios: 'iPhone' / 'user's iPhone'
 * android: 'sdk_gphone64_arm64'
 */
export declare const getDeviceName: () => Promise<string>;
