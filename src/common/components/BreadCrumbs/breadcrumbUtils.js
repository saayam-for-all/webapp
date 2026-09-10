export const DASHBOARD_BREADCRUMB = {
  label: "DASHBOARD",
  path: "/dashboard",
};

const withDefinedLabel = (item) => item && item.label;
const withoutBreadcrumbTrail = (state) => {
  if (!state || typeof state !== "object") {
    return state;
  }

  const { breadcrumbTrail, ...rest } = state;
  return rest;
};

export const buildBreadcrumbTrail = (...items) =>
  items.filter(withDefinedLabel);

export const createRequestDetailsCrumb = ({
  requestId,
  requestData,
  requestLabel = "REQUEST_DETAILS",
} = {}) => ({
  label: requestLabel,
  path: requestId ? `/request/${requestId}` : null,
  state: withoutBreadcrumbTrail(requestData),
});

export const createRequestDetailsTrail = (options = {}) =>
  buildBreadcrumbTrail(
    DASHBOARD_BREADCRUMB,
    createRequestDetailsCrumb(options),
  );

export const createOrganizationsPageState = ({
  requestId,
  requestData,
  requestLabel = "REQUEST_DETAILS",
  organizationsLabel = "ORGANIZATIONS",
} = {}) => {
  const requestCrumb = createRequestDetailsCrumb({
    requestId,
    requestData,
    requestLabel,
  });

  return {
    ...withoutBreadcrumbTrail(requestData),
    breadcrumbTrail: buildBreadcrumbTrail(DASHBOARD_BREADCRUMB, requestCrumb, {
      label: organizationsLabel,
      path: "/voluntary-organizations",
    }),
  };
};

export const createOrganizationDetailsTrail = ({
  organizationName,
  requestId,
  requestData,
  requestLabel = "REQUEST_DETAILS",
  organizationsLabel = "ORGANIZATIONS",
} = {}) => {
  const organizationsPageState = createOrganizationsPageState({
    requestId,
    requestData,
    requestLabel,
    organizationsLabel,
  });

  return buildBreadcrumbTrail(
    ...organizationsPageState.breadcrumbTrail.slice(0, 2),
    {
      ...organizationsPageState.breadcrumbTrail[2],
      state: organizationsPageState,
    },
    {
      label: organizationName || "ORGANIZATION_DETAILS",
    },
  );
};
