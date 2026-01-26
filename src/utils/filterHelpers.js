/**
 * Helper functions for dashboard filters using Enums and Categories APIs
 * Handles reading from localStorage and providing translated values
 */

/**
 * Get enums from localStorage
 * @returns {Object|null} Enums object or null if not available
 */
export const getEnumsFromStorage = () => {
  try {
    const enums = localStorage.getItem("enums");
    return enums ? JSON.parse(enums) : null;
  } catch (error) {
    console.warn("Failed to parse enums from localStorage:", error);
    return null;
  }
};

/**
 * Get categories from localStorage
 * @returns {Array|null} Categories array or null if not available
 */
export const getCategoriesFromStorage = () => {
  try {
    const categories = localStorage.getItem("categories");
    return categories ? JSON.parse(categories) : null;
  } catch (error) {
    console.warn("Failed to parse categories from localStorage:", error);
    return null;
  }
};

/**
 * Get request statuses from enums
 * @param {Function} t - Translation function from useTranslation
 * @returns {Array} Array of status objects with key and translated label
 */
export const getStatusOptions = (t) => {
  const enums = getEnumsFromStorage();

  if (enums && Array.isArray(enums.requestStatus)) {
    const options = enums.requestStatus.map((status) => ({
      key: status,
      value: status,
      label: t(`enums:requestStatus.${status}`, status),
    }));

    return [
      { key: "All", value: "All", label: t("common.All", "All") },
      ...options,
    ];
  }

  // Fallback to default values
  return [
    {
      key: "CREATED",
      value: "Created",
      label: t("enums:requestStatus.CREATED", "Created"),
    },
    {
      key: "MATCHING_VOLUNTEER",
      value: "Matching Volunteer",
      label: t("enums:requestStatus.MATCHING_VOLUNTEER", "Matching Volunteer"),
    },
    {
      key: "MANAGED",
      value: "Managed",
      label: t("enums:requestStatus.MANAGED", "Managed"),
    },
    {
      key: "RESOLVED",
      value: "Resolved",
      label: t("enums:requestStatus.RESOLVED", "Resolved"),
    },
    {
      key: "CANCELLED",
      value: "Cancelled",
      label: t("enums:requestStatus.CANCELLED", "Cancelled"),
    },
  ];
};

/**
 * Get request priorities from enums
 * @param {Function} t - Translation function from useTranslation
 * @returns {Array} Array of priority objects with key and translated label
 */
export const getPriorityOptions = (t) => {
  const enums = getEnumsFromStorage();

  if (enums && enums.requestPriority) {
    const priorityKeys = Object.keys(enums.requestPriority);
    return priorityKeys.map((key) => ({
      key: key,
      value: enums.requestPriority[key],
      label: t(`enums:requestPriority.${key}`, enums.requestPriority[key]),
    }));
  }

  // Fallback to default values
  return [
    { key: "LOW", value: "Low", label: t("enums:requestPriority.LOW", "Low") },
    {
      key: "MEDIUM",
      value: "Medium",
      label: t("enums:requestPriority.MEDIUM", "Medium"),
    },
    {
      key: "HIGH",
      value: "High",
      label: t("enums:requestPriority.HIGH", "High"),
    },
    {
      key: "CRITICAL",
      value: "Critical",
      label: t("enums:requestPriority.CRITICAL", "Critical"),
    },
  ];
};

/**
 * Get request types from enums
 * @param {Function} t - Translation function from useTranslation
 * @returns {Array} Array of type objects with key and translated label
 */
export const getTypeOptions = (t) => {
  const enums = getEnumsFromStorage();

  if (enums && enums.requestType) {
    const typeKeys = Object.keys(enums.requestType);
    return typeKeys.map((key) => ({
      key: key,
      value: enums.requestType[key],
      label: t(`enums:requestType.${key}`, enums.requestType[key]),
    }));
  }

  // Fallback to default values
  return [
    {
      key: "IN_PERSON",
      value: "In Person",
      label: t("enums:requestType.IN_PERSON", "In Person"),
    },
    {
      key: "REMOTE",
      value: "Remote",
      label: t("enums:requestType.REMOTE", "Remote"),
    },
  ];
};

/**
 * Get categories from Categories API
 * @param {Function} t - Translation function from useTranslation
 * @returns {Array} Array of category objects with name and translated label
 */
export const getCategoryOptions = (t) => {
  const categories = getCategoriesFromStorage();

  if (categories && Array.isArray(categories)) {
    return categories.map((cat) => ({
      id: cat.catId,
      name: cat.catName,
      label: t(`categories:REQUEST_CATEGORIES.${cat.catId}.LABEL`, cat.catName),
      subcategories: cat.subcategories || [],
    }));
  }

  // Fallback - return empty array, let component handle fallback
  return [];
};

/**
 * Flatten nested categories for filter display
 * @param {Array} categories - Categories array
 * @param {Function} t - Translation function
 * @param {number} depth - Current depth level
 * @returns {Array} Flattened array of categories
 */
export const flattenCategories = (categories, t, depth = 0) => {
  const flattened = [];

  categories.forEach((cat) => {
    flattened.push({
      id: cat.id || cat.catId,
      name: cat.name || cat.catName,
      label:
        cat.label ||
        t(
          `categories:REQUEST_CATEGORIES.${cat.id || cat.catId}.LABEL`,
          cat.name || cat.catName,
        ),
      depth: depth,
    });

    if (cat.subcategories && cat.subcategories.length > 0) {
      const subFlattened = flattenCategories(cat.subcategories, t, depth + 1);
      flattened.push(...subFlattened);
    }
  });

  return flattened;
};

/**
 * Normalize type value for comparison
 * Used to match backend values with enum keys
 */
export const normalizeTypeValue = (value) => {
  if (!value) return null;
  return String(value).trim().toUpperCase().replace(/\s+/g, "_");
};

/**
 * Normalize status value for comparison
 */
export const normalizeStatusValue = (value) => {
  if (!value) return null;
  return String(value).trim().toUpperCase().replace(/\s+/g, "_");
};

/**
 * Normalize priority value for comparison
 */
export const normalizePriorityValue = (value) => {
  if (!value) return null;
  return String(value).trim().toUpperCase().replace(/\s+/g, "_");
};
