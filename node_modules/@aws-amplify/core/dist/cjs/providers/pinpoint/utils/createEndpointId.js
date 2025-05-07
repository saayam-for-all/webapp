'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCreatedEndpointId = exports.createEndpointId = void 0;
const amplifyUuid_1 = require("../../../utils/amplifyUuid");
const getCacheKey_1 = require("./getCacheKey");
const createdEndpointIds = {};
/**
 * Creates an endpoint id and guarantees multiple creations for a category returns the same uuid.
 *
 * @internal
 */
const createEndpointId = (appId, category) => {
    const cacheKey = (0, getCacheKey_1.getCacheKey)(appId, category);
    if (!createdEndpointIds[cacheKey]) {
        createdEndpointIds[cacheKey] = (0, amplifyUuid_1.amplifyUuid)();
    }
    return createdEndpointIds[cacheKey];
};
exports.createEndpointId = createEndpointId;
/**
 * Clears a created endpoint id for a category.
 *
 * @internal
 */
const clearCreatedEndpointId = (appId, category) => {
    const cacheKey = (0, getCacheKey_1.getCacheKey)(appId, category);
    delete createdEndpointIds[cacheKey];
};
exports.clearCreatedEndpointId = clearCreatedEndpointId;
//# sourceMappingURL=createEndpointId.js.map
