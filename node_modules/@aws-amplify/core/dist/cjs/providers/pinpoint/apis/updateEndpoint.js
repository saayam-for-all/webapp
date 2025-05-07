'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEndpoint = void 0;
const pinpoint_1 = require("../../../awsClients/pinpoint");
const amplifyUuid_1 = require("../../../utils/amplifyUuid");
const getClientInfo_1 = require("../../../utils/getClientInfo");
const cacheEndpointId_1 = require("../utils/cacheEndpointId");
const createEndpointId_1 = require("../utils/createEndpointId");
const getEndpointId_1 = require("../utils/getEndpointId");
/**
 * @internal
 */
const updateEndpoint = async ({ address, appId, category, channelType, credentials, identityId, optOut, region, userAttributes, userId, userProfile, userAgentValue, }) => {
    const endpointId = await (0, getEndpointId_1.getEndpointId)(appId, category);
    // only generate a new endpoint id if one was not found in cache
    const createdEndpointId = !endpointId
        ? (0, createEndpointId_1.createEndpointId)(appId, category)
        : undefined;
    const { customProperties, demographic, email, location, metrics, name, plan, } = userProfile ?? {};
    // only automatically populate the endpoint with client info and identity id upon endpoint creation to
    // avoid overwriting the endpoint with these values every time the endpoint is updated
    const demographicsFromClientInfo = {};
    const resolvedUserId = createdEndpointId ? (userId ?? identityId) : userId;
    if (createdEndpointId) {
        const clientInfo = (0, getClientInfo_1.getClientInfo)();
        demographicsFromClientInfo.appVersion = clientInfo.appVersion;
        demographicsFromClientInfo.make = clientInfo.make;
        demographicsFromClientInfo.model = clientInfo.model;
        demographicsFromClientInfo.modelVersion = clientInfo.version;
        demographicsFromClientInfo.platform = clientInfo.platform;
    }
    const mergedDemographic = {
        ...demographicsFromClientInfo,
        ...demographic,
    };
    const attributes = {
        ...(email && { email: [email] }),
        ...(name && { name: [name] }),
        ...(plan && { plan: [plan] }),
        ...customProperties,
    };
    const shouldAddDemographics = createdEndpointId || demographic;
    const shouldAddAttributes = email || customProperties || name || plan;
    const shouldAddUser = resolvedUserId || userAttributes;
    const input = {
        ApplicationId: appId,
        EndpointId: endpointId ?? createdEndpointId,
        EndpointRequest: {
            RequestId: (0, amplifyUuid_1.amplifyUuid)(),
            EffectiveDate: new Date().toISOString(),
            ChannelType: channelType,
            Address: address,
            ...(shouldAddAttributes && { Attributes: attributes }),
            ...(shouldAddDemographics && {
                Demographic: {
                    AppVersion: mergedDemographic.appVersion,
                    Locale: mergedDemographic.locale,
                    Make: mergedDemographic.make,
                    Model: mergedDemographic.model,
                    ModelVersion: mergedDemographic.modelVersion,
                    Platform: mergedDemographic.platform,
                    PlatformVersion: mergedDemographic.platformVersion,
                    Timezone: mergedDemographic.timezone,
                },
            }),
            ...(location && {
                Location: {
                    City: location.city,
                    Country: location.country,
                    Latitude: location.latitude,
                    Longitude: location.longitude,
                    PostalCode: location.postalCode,
                    Region: location.region,
                },
            }),
            Metrics: metrics,
            OptOut: optOut,
            ...(shouldAddUser && {
                User: {
                    UserId: resolvedUserId,
                    UserAttributes: userAttributes,
                },
            }),
        },
    };
    try {
        await (0, pinpoint_1.updateEndpoint)({ credentials, region, userAgentValue }, input);
        // if we had to create an endpoint id, we need to now cache it
        if (createdEndpointId) {
            await (0, cacheEndpointId_1.cacheEndpointId)(appId, category, createdEndpointId);
        }
    }
    finally {
        // at this point, we completely reset the behavior so even if the update was unsuccessful
        // we can just start over with a newly created endpoint id
        if (createdEndpointId) {
            (0, createEndpointId_1.clearCreatedEndpointId)(appId, category);
        }
    }
};
exports.updateEndpoint = updateEndpoint;
//# sourceMappingURL=updateEndpoint.js.map
