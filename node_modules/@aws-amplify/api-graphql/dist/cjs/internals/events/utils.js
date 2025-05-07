'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeEvents = exports.configure = exports.normalizeAuth = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const core_1 = require("@aws-amplify/core");
const normalizeAuth = (explicitAuthMode, defaultAuthMode) => {
    if (!explicitAuthMode) {
        return defaultAuthMode;
    }
    if (explicitAuthMode === 'identityPool') {
        return 'iam';
    }
    return explicitAuthMode;
};
exports.normalizeAuth = normalizeAuth;
const configure = () => {
    const config = core_1.Amplify.getConfig();
    const eventsConfig = config.API?.Events;
    if (!eventsConfig) {
        throw new Error('Amplify configuration is missing. Have you called Amplify.configure()?');
    }
    const configAuthMode = (0, exports.normalizeAuth)(eventsConfig.defaultAuthMode, 'apiKey');
    const options = {
        appSyncGraphqlEndpoint: eventsConfig.endpoint,
        region: eventsConfig.region,
        authenticationType: configAuthMode,
        apiKey: eventsConfig.apiKey,
    };
    return options;
};
exports.configure = configure;
/**
 * Event API expects an array of JSON strings
 *
 * @param events - JSON-serializable value or an array of values
 * @returns array of JSON strings
 */
const serializeEvents = (events) => {
    if (Array.isArray(events)) {
        return events.map((ev, idx) => {
            const eventJson = JSON.stringify(ev);
            if (eventJson === undefined) {
                throw new Error(`Event must be a valid JSON value. Received ${ev} at index ${idx}`);
            }
            return eventJson;
        });
    }
    const eventJson = JSON.stringify(events);
    if (eventJson === undefined) {
        throw new Error(`Event must be a valid JSON value. Received ${events}`);
    }
    return [eventJson];
};
exports.serializeEvents = serializeEvents;
//# sourceMappingURL=utils.js.map
