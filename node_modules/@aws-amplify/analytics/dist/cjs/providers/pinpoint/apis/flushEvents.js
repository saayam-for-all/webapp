'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushEvents = void 0;
const pinpoint_1 = require("@aws-amplify/core/internals/providers/pinpoint");
const utils_1 = require("@aws-amplify/core/internals/utils");
const core_1 = require("@aws-amplify/core");
const utils_2 = require("../utils");
const utils_3 = require("../../../utils");
const logger = new core_1.ConsoleLogger('Analytics');
/**
 * Flushes all buffered Pinpoint events to the service.
 *
 * @note
 * This API will make a best-effort attempt to flush events from the buffer. Events recorded immediately after invoking
 * this API may not be included in the flush.
 */
const flushEvents = () => {
    const { appId, region, bufferSize, flushSize, flushInterval, resendLimit } = (0, utils_2.resolveConfig)();
    (0, utils_2.resolveCredentials)()
        .then(({ credentials, identityId }) => {
        (0, pinpoint_1.flushEvents)({
            appId,
            region,
            credentials,
            identityId,
            bufferSize,
            flushSize,
            flushInterval,
            resendLimit,
            userAgentValue: (0, utils_3.getAnalyticsUserAgentString)(utils_1.AnalyticsAction.Record),
        });
    })
        .catch(e => {
        logger.warn('Failed to flush events', e);
    });
};
exports.flushEvents = flushEvents;
//# sourceMappingURL=flushEvents.js.map
