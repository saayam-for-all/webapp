const organizationCache = new Map();

const getCacheKey = (requestId, beneficiaryId) =>
  JSON.stringify([requestId, beneficiaryId]);

export const getCachedOrganizations = (requestId, beneficiaryId) =>
  organizationCache.get(getCacheKey(requestId, beneficiaryId));

export const cacheOrganizations = (requestId, beneficiaryId, organizations) => {
  organizationCache.set(getCacheKey(requestId, beneficiaryId), organizations);
};

export const clearOrganizationsCache = () => {
  organizationCache.clear();
};
