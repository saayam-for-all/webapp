/**
 * Authentication utility functions
 */

/**
 * Check if user is authenticated and has valid groups
 * @param {Array} userGroups - Array of user groups from Redux state
 * @returns {Object} - Authentication status and fallback groups
 */
export const getAuthStatus = (userGroups) => {
  // Check if userGroups is valid
  if (!userGroups || !Array.isArray(userGroups) || userGroups.length === 0) {
    return {
      isAuthenticated: false,
      groups: [],
      fallbackRole: "beneficiary", // Default fallback role
      message: "User not authenticated or groups not available",
    };
  }

  return {
    isAuthenticated: true,
    groups: userGroups,
    fallbackRole: null,
    message: null,
  };
};

/**
 * Get default groups for unauthenticated users
 * @returns {Array} - Default groups for fallback
 */
export const getDefaultGroups = () => {
  return ["Beneficiaries"]; // Default to beneficiary role
};

/**
 * Check if user has admin privileges
 * @param {Array} userGroups - Array of user groups
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (userGroups) => {
  if (!userGroups || !Array.isArray(userGroups)) return false;

  return (
    userGroups.includes("SystemAdmins") ||
    userGroups.includes("Admins") ||
    userGroups.includes("Stewards")
  );
};

/**
 * Check if user has volunteer privileges
 * @param {Array} userGroups - Array of user groups
 * @returns {boolean} - True if user is volunteer
 */
export const isVolunteer = (userGroups) => {
  if (!userGroups || !Array.isArray(userGroups)) return false;

  return userGroups.includes("Volunteers");
};

/**
 * Get user role for display purposes
 * @param {Array} userGroups - Array of user groups
 * @returns {string} - User role string
 */
export const getUserRole = (userGroups) => {
  if (isAdmin(userGroups)) return "Admin";
  if (isVolunteer(userGroups)) return "Volunteer";
  return "Beneficiary";
};
