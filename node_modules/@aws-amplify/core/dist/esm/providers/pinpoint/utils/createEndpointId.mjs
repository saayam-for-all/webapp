import { amplifyUuid } from '../../../utils/amplifyUuid/index.mjs';
import { getCacheKey } from './getCacheKey.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createdEndpointIds = {};
/**
 * Creates an endpoint id and guarantees multiple creations for a category returns the same uuid.
 *
 * @internal
 */
const createEndpointId = (appId, category) => {
    const cacheKey = getCacheKey(appId, category);
    if (!createdEndpointIds[cacheKey]) {
        createdEndpointIds[cacheKey] = amplifyUuid();
    }
    return createdEndpointIds[cacheKey];
};
/**
 * Clears a created endpoint id for a category.
 *
 * @internal
 */
const clearCreatedEndpointId = (appId, category) => {
    const cacheKey = getCacheKey(appId, category);
    delete createdEndpointIds[cacheKey];
};

export { clearCreatedEndpointId, createEndpointId };
//# sourceMappingURL=createEndpointId.mjs.map
