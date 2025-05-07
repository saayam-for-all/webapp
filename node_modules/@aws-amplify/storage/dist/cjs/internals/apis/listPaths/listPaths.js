'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPaths = void 0;
const core_1 = require("@aws-amplify/core");
const resolveLocationsForCurrentSession_1 = require("./resolveLocationsForCurrentSession");
const getHighestPrecedenceUserGroup_1 = require("./getHighestPrecedenceUserGroup");
const listPaths = async () => {
    const { buckets } = core_1.Amplify.getConfig().Storage.S3;
    const { groups } = core_1.Amplify.getConfig().Auth.Cognito;
    if (!buckets) {
        return { locations: [] };
    }
    const { tokens, identityId } = await (0, core_1.fetchAuthSession)();
    const currentUserGroups = tokens?.accessToken.payload['cognito:groups'];
    const userGroupToUse = (0, getHighestPrecedenceUserGroup_1.getHighestPrecedenceUserGroup)(groups, currentUserGroups);
    const locations = (0, resolveLocationsForCurrentSession_1.resolveLocationsForCurrentSession)({
        buckets,
        isAuthenticated: !!tokens,
        identityId,
        userGroup: userGroupToUse,
    });
    return { locations };
};
exports.listPaths = listPaths;
//# sourceMappingURL=listPaths.js.map
