import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { resolveLocationsForCurrentSession } from './resolveLocationsForCurrentSession.mjs';
import { getHighestPrecedenceUserGroup } from './getHighestPrecedenceUserGroup.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const listPaths = async () => {
    const { buckets } = Amplify.getConfig().Storage.S3;
    const { groups } = Amplify.getConfig().Auth.Cognito;
    if (!buckets) {
        return { locations: [] };
    }
    const { tokens, identityId } = await fetchAuthSession();
    const currentUserGroups = tokens?.accessToken.payload['cognito:groups'];
    const userGroupToUse = getHighestPrecedenceUserGroup(groups, currentUserGroups);
    const locations = resolveLocationsForCurrentSession({
        buckets,
        isAuthenticated: !!tokens,
        identityId,
        userGroup: userGroupToUse,
    });
    return { locations };
};

export { listPaths };
//# sourceMappingURL=listPaths.mjs.map
