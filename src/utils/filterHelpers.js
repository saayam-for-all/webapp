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

  if (enums && enums.requestStatus) {
    // The API returns an indexed object; Object.values also accepts arrays
    const statusValues = Object.values(enums.requestStatus);
    const options = statusValues.map((status) => ({
      key: status,
      value: status,
      label: t(`enums:requestStatus.${status}`, status),
    }));

    return [{ key: "All", value: "All", label: t("ALL", "All") }, ...options];
  }

  // Fallback to default values
  return [
    { key: "All", value: "All", label: t("ALL", "All") },
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
      key: "IN_PROGRESS",
      value: "In Progress",
      label: t("enums:requestStatus.IN_PROGRESS", "In Progress"),
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
    {
      key: "DELETED",
      value: "Deleted",
      label: t("enums:requestStatus.DELETED", "Deleted"),
    },
    {
      key: "RATED_BY_REQUESTER",
      value: "Rated by Requester",
      label: t("enums:requestStatus.RATED_BY_REQUESTER", "Rated by Requester"),
    },
    {
      key: "RATED_BY_VOLUNTEER",
      value: "Rated by Volunteer",
      label: t("enums:requestStatus.RATED_BY_VOLUNTEER", "Rated by Volunteer"),
    },
    {
      key: "VOLUNTEER_NOT_FOUND",
      value: "Volunteer Not Found",
      label: t(
        "enums:requestStatus.VOLUNTEER_NOT_FOUND",
        "Volunteer Not Found",
      ),
    },
    {
      key: "VOLUNTEER_REASSIGNMENT",
      value: "Volunteer Reassignment",
      label: t(
        "enums:requestStatus.VOLUNTEER_REASSIGNMENT",
        "Volunteer Reassignment",
      ),
    },
  ];
};

export const BULK_STATUSES = [
  "CREATED",
  "MATCHING_VOLUNTEER",
  "MANAGED",
  "RESOLVED",
  "CANCELLED",
];

/**
 * Get status options for the bulk "Change Status" action
 * @param {Function} t - Translation function from useTranslation
 * @returns {Array} Array of status objects with key and translated label
 */
export const getBulkStatusOptions = (t) => {
  return BULK_STATUSES.map((status) => ({
    key: status,
    value: status,
    label: t(`enums:requestStatus.${status}`, status),
  }));
};

export const STEWARD_STATUSES = [
  "VOLUNTEER_NOT_FOUND",
  "VOLUNTEER_REASSIGNMENT",
];

/**
 * Get status options restricted to Steward dashboard
 * @param {Function} t - Translation function from useTranslation
 * @returns {Array} Array of status objects with key and translated label
 */
export const getStewardStatusOptions = (t) => {
  return STEWARD_STATUSES.map((status) => ({
    key: status,
    value: status,
    label: t(`enums:requestStatus.${status}`, status),
  }));
};

/**
 * Get request priorities from enums
 * @param {Function} t - Translation function from useTranslation
 * @returns {Array} Array of priority objects with key and translated label
 */
export const getPriorityOptions = (t) => {
  const enums = getEnumsFromStorage();

  if (enums && enums.requestPriority) {
    const priorityValues = Object.values(enums.requestPriority);
    const options = priorityValues.map((val) => ({
      key: val,
      value: val,
      label: t(`enums:requestPriority.${val}`, val),
    }));
    return [{ key: "All", value: "All", label: t("ALL", "All") }, ...options];
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
    const typeValues = Object.values(enums.requestType);
    const options = typeValues.map((val) => ({
      key: val,
      value: val,
      label: t(`enums:requestType.${val}`, val),
    }));

    return [{ key: "All", value: "All", label: t("ALL", "All") }, ...options];
  }

  // Fallback
  return [
    { key: "All", value: "All", label: t("ALL", "All") },
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
      label: t(
        `categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`,
        cat.catName,
      ),
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
          `categories:REQUEST_CATEGORIES.${cat.name || cat.catName}.LABEL`,
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
 * Build category filter options from API categories, matched against
 * category names actually present in the current request data.
 * @param {Array} dataRows - Current request rows (used to build dataCategoryNames)
 * @param {Function} t - Translation function
 * @returns {Array} Category option objects with category, label, subCategories
 */
export const getDashboardCategoryOptions = (dataRows, t) => {
  const categories = getCategoriesFromStorage();

  const dataCategoryNames = new Set(
    dataRows.map((r) => r.category).filter(Boolean),
  );

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const transformCategories = (cats) => {
      return cats.map((cat) => ({
        category: cat.catName,
        label: t(
          `categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`,
          cat.catName,
        ),
        subCategories:
          cat.subCategories && cat.subCategories.length > 0
            ? transformCategories(cat.subCategories)
            : undefined,
      }));
    };

    if (dataCategoryNames.size === 0) {
      return transformCategories(categories);
    }

    const getAllCategoryNames = (cats) => {
      const names = [];
      cats.forEach((cat) => {
        names.push(cat.catName);
        if (cat.subCategories && cat.subCategories.length > 0) {
          names.push(...getAllCategoryNames(cat.subCategories));
        }
      });
      return names;
    };

    const apiCategoryNames = getAllCategoryNames(categories);
    const matchCount = apiCategoryNames.filter((apiCat) =>
      dataCategoryNames.has(apiCat),
    ).length;

    if (
      matchCount >=
      Math.min(dataCategoryNames.size, apiCategoryNames.length) * 0.5
    ) {
      return transformCategories(categories);
    }
  }

  const combined = Array.from(dataCategoryNames);
  return combined.sort().map((cat) => ({
    category: cat,
    label: cat,
  }));
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
