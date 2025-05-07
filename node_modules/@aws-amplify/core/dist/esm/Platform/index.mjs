import { Framework } from './types.mjs';
import { version } from './version.mjs';
import { detectFramework, observeFrameworkChanges } from './detectFramework.mjs';
import { getCustomUserAgent } from './customUserAgent.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const BASE_USER_AGENT = `aws-amplify`;
/** Sanitize Amplify version string be removing special character + and character post the special character  */
const sanitizeAmplifyVersion = (amplifyVersion) => amplifyVersion.replace(/\+.*/, '');
class PlatformBuilder {
    constructor() {
        this.userAgent = `${BASE_USER_AGENT}/${sanitizeAmplifyVersion(version)}`;
    }
    get framework() {
        return detectFramework();
    }
    get isReactNative() {
        return (this.framework === Framework.ReactNative ||
            this.framework === Framework.Expo);
    }
    observeFrameworkChanges(fcn) {
        observeFrameworkChanges(fcn);
    }
}
const Platform = new PlatformBuilder();
const getAmplifyUserAgentObject = ({ category, action, } = {}) => {
    const userAgent = [
        [BASE_USER_AGENT, sanitizeAmplifyVersion(version)],
    ];
    if (category) {
        userAgent.push([category, action]);
    }
    userAgent.push(['framework', detectFramework()]);
    if (category && action) {
        const customState = getCustomUserAgent(category, action);
        if (customState) {
            customState.forEach(state => {
                userAgent.push(state);
            });
        }
    }
    return userAgent;
};
const getAmplifyUserAgent = (customUserAgentDetails) => {
    const userAgent = getAmplifyUserAgentObject(customUserAgentDetails);
    const userAgentString = userAgent
        .map(([agentKey, agentValue]) => agentKey && agentValue ? `${agentKey}/${agentValue}` : agentKey)
        .join(' ');
    return userAgentString;
};

export { Platform, getAmplifyUserAgent, getAmplifyUserAgentObject, sanitizeAmplifyVersion };
//# sourceMappingURL=index.mjs.map
