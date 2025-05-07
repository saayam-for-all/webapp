'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAmplifyUserAgent = exports.getAmplifyUserAgentObject = exports.Platform = exports.sanitizeAmplifyVersion = void 0;
const types_1 = require("./types");
const version_1 = require("./version");
const detectFramework_1 = require("./detectFramework");
const customUserAgent_1 = require("./customUserAgent");
const BASE_USER_AGENT = `aws-amplify`;
/** Sanitize Amplify version string be removing special character + and character post the special character  */
const sanitizeAmplifyVersion = (amplifyVersion) => amplifyVersion.replace(/\+.*/, '');
exports.sanitizeAmplifyVersion = sanitizeAmplifyVersion;
class PlatformBuilder {
    constructor() {
        this.userAgent = `${BASE_USER_AGENT}/${(0, exports.sanitizeAmplifyVersion)(version_1.version)}`;
    }
    get framework() {
        return (0, detectFramework_1.detectFramework)();
    }
    get isReactNative() {
        return (this.framework === types_1.Framework.ReactNative ||
            this.framework === types_1.Framework.Expo);
    }
    observeFrameworkChanges(fcn) {
        (0, detectFramework_1.observeFrameworkChanges)(fcn);
    }
}
exports.Platform = new PlatformBuilder();
const getAmplifyUserAgentObject = ({ category, action, } = {}) => {
    const userAgent = [
        [BASE_USER_AGENT, (0, exports.sanitizeAmplifyVersion)(version_1.version)],
    ];
    if (category) {
        userAgent.push([category, action]);
    }
    userAgent.push(['framework', (0, detectFramework_1.detectFramework)()]);
    if (category && action) {
        const customState = (0, customUserAgent_1.getCustomUserAgent)(category, action);
        if (customState) {
            customState.forEach(state => {
                userAgent.push(state);
            });
        }
    }
    return userAgent;
};
exports.getAmplifyUserAgentObject = getAmplifyUserAgentObject;
const getAmplifyUserAgent = (customUserAgentDetails) => {
    const userAgent = (0, exports.getAmplifyUserAgentObject)(customUserAgentDetails);
    const userAgentString = userAgent
        .map(([agentKey, agentValue]) => agentKey && agentValue ? `${agentKey}/${agentValue}` : agentKey)
        .join(' ');
    return userAgentString;
};
exports.getAmplifyUserAgent = getAmplifyUserAgent;
//# sourceMappingURL=index.js.map
