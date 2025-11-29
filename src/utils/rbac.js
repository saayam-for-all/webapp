export const ROLES = {
  BENEFICIARY: "Beneficiaries",
  VOLUNTEER: "Volunteers",
  STEWARD: "Stewards",
  ADMIN: "Admins",
  SUPER_ADMIN: "SuperAdmins",
};

export const DASHBOARDS = {
  BENEFICIARY: "beneficiary",
  VOLUNTEER: "volunteer",
  STEWARD: "steward",
  ADMIN: "admin",
  SUPER_ADMIN: "superAdmin",
};

const DASHBOARD_ACCESS_MATRIX = {
  [DASHBOARDS.BENEFICIARY]: [
    ROLES.BENEFICIARY,
    ROLES.VOLUNTEER,
    ROLES.STEWARD,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
  ],
  [DASHBOARDS.VOLUNTEER]: [ROLES.VOLUNTEER],
  [DASHBOARDS.STEWARD]: [ROLES.STEWARD, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  [DASHBOARDS.ADMIN]: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  [DASHBOARDS.SUPER_ADMIN]: [ROLES.SUPER_ADMIN],
};

export const canAccessDashboard = (userGroups, dashboard) => {
  if (!userGroups || !Array.isArray(userGroups) || userGroups.length === 0) {
    return dashboard === DASHBOARDS.BENEFICIARY;
  }

  const allowedRoles = DASHBOARD_ACCESS_MATRIX[dashboard] || [];

  return userGroups.some((group) => allowedRoles.includes(group));
};

export const getAccessibleDashboards = (userGroups) => {
  if (!userGroups || !Array.isArray(userGroups) || userGroups.length === 0) {
    return [DASHBOARDS.BENEFICIARY];
  }

  const accessible = [];

  for (const dashboard of Object.keys(DASHBOARD_ACCESS_MATRIX)) {
    if (canAccessDashboard(userGroups, dashboard)) {
      accessible.push(dashboard);
    }
  }

  return accessible.length > 0 ? accessible : [DASHBOARDS.BENEFICIARY];
};

export const getDefaultDashboard = (userGroups) => {
  if (!userGroups || !Array.isArray(userGroups) || userGroups.length === 0) {
    return DASHBOARDS.BENEFICIARY;
  }

  if (userGroups.includes(ROLES.SUPER_ADMIN)) {
    return DASHBOARDS.SUPER_ADMIN;
  }
  if (userGroups.includes(ROLES.ADMIN)) {
    return DASHBOARDS.ADMIN;
  }
  if (userGroups.includes(ROLES.STEWARD)) {
    return DASHBOARDS.STEWARD;
  }
  if (userGroups.includes(ROLES.VOLUNTEER)) {
    return DASHBOARDS.VOLUNTEER;
  }
  return DASHBOARDS.BENEFICIARY;
};

export const getDashboardDisplayName = (dashboard) => {
  const names = {
    [DASHBOARDS.BENEFICIARY]: "Beneficiary Dashboard",
    [DASHBOARDS.VOLUNTEER]: "Volunteer Dashboard",
    [DASHBOARDS.STEWARD]: "Steward Dashboard",
    [DASHBOARDS.ADMIN]: "Admin Dashboard",
    [DASHBOARDS.SUPER_ADMIN]: "Super Admin Dashboard",
  };
  return names[dashboard] || "Dashboard";
};

export const validateDashboardAccess = (userGroups, targetDashboard) => {
  if (!targetDashboard) {
    return { allowed: false, reason: "No dashboard specified" };
  }

  if (!Object.values(DASHBOARDS).includes(targetDashboard)) {
    return { allowed: false, reason: "Invalid dashboard" };
  }

  const hasAccess = canAccessDashboard(userGroups, targetDashboard);

  if (!hasAccess) {
    return {
      allowed: false,
      reason: `You don't have permission to access ${getDashboardDisplayName(targetDashboard)}`,
    };
  }

  return { allowed: true };
};
