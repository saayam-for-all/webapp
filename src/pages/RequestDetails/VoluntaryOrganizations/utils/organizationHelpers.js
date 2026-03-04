/**
 * Parse Lambda response - handles various response formats
 * @param {Object|Array} data - Response from the API
 * @returns {Array} - Parsed array of organizations
 */
export const parseOrganizationsResponse = (data) => {
  // Lambda returns: { statusCode, headers, body: [...] }
  if (data?.body && Array.isArray(data.body)) {
    return data.body;
  }
  // Fallback: body might be stringified JSON
  if (data?.body && typeof data.body === "string") {
    try {
      return JSON.parse(data.body);
    } catch (e) {
      throw new Error(`Failed to parse organizations response: ${e.message}`);
    }
  }
  // Direct array response
  if (Array.isArray(data)) {
    return data;
  }
  return [];
};

/**
 * Determine source type from db_or_ai field
 * @param {string} dbOrAi - The db_or_ai field value
 * @returns {string} - 'ai' or 'db'
 */
export const getSourceType = (dbOrAi) => {
  const s = (dbOrAi || "db").toLowerCase();
  return s === "llm" || s === "ai" || s === "genai" ? "ai" : "db";
};

/**
 * Extract category string from various category formats
 * @param {Object|string} category - Category data
 * @returns {string} - Category string
 */
export const extractCategoryString = (category) => {
  if (typeof category === "object") {
    return category?.name || category?.catName || "";
  }
  return category || "";
};

/**
 * Filter organizations by source type
 * @param {Array} organizations - List of organizations
 * @param {string} sourceFilter - 'all', 'ai', or 'db'
 * @returns {Array} - Filtered organizations
 */
export const filterBySource = (organizations, sourceFilter) => {
  if (sourceFilter === "all") {
    return organizations;
  }

  return organizations.filter((org) => {
    const orgSource = getSourceType(org.db_or_ai);
    return sourceFilter === orgSource;
  });
};

/**
 * Filter organizations by search term
 * @param {Array} organizations - List of organizations
 * @param {string} searchTerm - Search term
 * @returns {Array} - Filtered organizations
 */
export const filterBySearchTerm = (organizations, searchTerm) => {
  if (!searchTerm) {
    return organizations;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return organizations.filter((org) =>
    Object.keys(org).some((key) =>
      String(org[key] || "")
        .toLowerCase()
        .includes(lowerSearchTerm),
    ),
  );
};

/**
 * Count organizations by source type
 * @param {Array} organizations - List of organizations
 * @returns {Object} - Counts { all, ai, db }
 */
export const countBySource = (organizations) => {
  const counts = { all: organizations.length, ai: 0, db: 0 };

  organizations.forEach((org) => {
    const source = getSourceType(org.db_or_ai);
    if (source === "ai") {
      counts.ai++;
    } else {
      counts.db++;
    }
  });

  return counts;
};
