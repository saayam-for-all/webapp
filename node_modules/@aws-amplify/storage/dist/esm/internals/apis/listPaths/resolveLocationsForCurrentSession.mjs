import { ENTITY_IDENTITY_URL } from '../../utils/constants.mjs';

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
                path.includes(ENTITY_IDENTITY_URL) &&
                isAuthenticated &&
                identityId;
            if (shouldIncludeEntityIdPath) {
                locations.push({
                    type: 'PREFIX',
                    permission: accessRules.entityidentity,
                    bucket: bucketName,
                    prefix: path.replace(ENTITY_IDENTITY_URL, identityId),
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

export { resolveLocationsForCurrentSession };
//# sourceMappingURL=resolveLocationsForCurrentSession.mjs.map
