'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLocationsForCurrentSession = void 0;
const constants_1 = require("../../utils/constants");
const resolvePermissions = (accessRule, isAuthenticated, groups) => {
    if (!isAuthenticated) {
        return {
            permission: accessRule.guest,
        };
    }
    if (groups) {
        const selectedKey = Object.keys(accessRule).find(access => access.includes(groups));
        return {
            permission: selectedKey ? accessRule[selectedKey] : undefined,
        };
    }
    return {
        permission: accessRule.authenticated,
    };
};
const resolveLocationsForCurrentSession = ({ buckets, isAuthenticated, identityId, userGroup, }) => {
    const locations = [];
    for (const [, bucketInfo] of Object.entries(buckets)) {
        const { bucketName, paths } = bucketInfo;
        if (!paths) {
            continue;
        }
        for (const [path, accessRules] of Object.entries(paths)) {
            const shouldIncludeEntityIdPath = !userGroup &&
                path.includes(constants_1.ENTITY_IDENTITY_URL) &&
                isAuthenticated &&
                identityId;
            if (shouldIncludeEntityIdPath) {
                locations.push({
                    type: 'PREFIX',
                    permission: accessRules.entityidentity,
                    bucket: bucketName,
                    prefix: path.replace(constants_1.ENTITY_IDENTITY_URL, identityId),
                });
            }
            const location = {
                type: 'PREFIX',
                ...resolvePermissions(accessRules, isAuthenticated, userGroup),
                bucket: bucketName,
                prefix: path,
            };
            if (location.permission)
                locations.push(location);
        }
    }
    return locations;
};
exports.resolveLocationsForCurrentSession = resolveLocationsForCurrentSession;
//# sourceMappingURL=resolveLocationsForCurrentSession.js.map
