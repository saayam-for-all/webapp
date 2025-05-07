// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Retrieves the device name using the User-Agent Client Hints API if available,
 * falling back to the traditional userAgent string if not.
 *
 * @returns {Promise<string>} A promise that resolves with a string representing the device name.
 *
 * Example Output:
 * navigator.userAgentData:
 *   'macOS 14.2.1 arm macOS Not A(Brand/99.0.0.0;Google Chrome/121.0.6167.160;Chromium/121.0.6167.160'
 * navigator.userAgent:
 *   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0'
 */
const getDeviceName = async () => {
    const { userAgentData } = navigator;
    if (!userAgentData)
        return navigator.userAgent;
    const { platform = '', platformVersion = '', model = '', architecture = '', fullVersionList = [], } = await userAgentData.getHighEntropyValues([
        'platform',
        'platformVersion',
        'architecture',
        'model',
        'fullVersionList',
    ]);
    const versionList = fullVersionList
        .map((v) => `${v.brand}/${v.version}`)
        .join(';');
    const deviceName = [
        platform,
        platformVersion,
        architecture,
        model,
        platform,
        versionList,
    ]
        .filter(value => value)
        .join(' ');
    return deviceName || navigator.userAgent;
};

export { getDeviceName };
//# sourceMappingURL=getDeviceName.mjs.map
