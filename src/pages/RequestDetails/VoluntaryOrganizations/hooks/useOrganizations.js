import { useState, useEffect, useMemo } from "react";
import { getVolunteerOrgsList } from "../../../../services/volunteerServices";
import {
  parseOrganizationsResponse,
  extractCategoryString,
  filterBySource,
  filterBySearchTerm,
  countBySource,
} from "../utils";

/**
 * Custom hook for fetching and filtering organizations
 * @param {Object} requestData - Request data from location state
 * @returns {Object} - Hook state and handlers
 */
const useOrganizations = (requestData) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noRequestData, setNoRequestData] = useState(false);
  const [error, setError] = useState(null);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categoryStr = extractCategoryString(requestData.category);
  const descriptionStr = requestData.description || "";
  const locationStr =
    requestData.location || requestData.city || requestData.state || "";
  const subjectStr = requestData.subject || categoryStr;

  const fetchOrganizations = async () => {
    const hasRequiredData =
      categoryStr.trim().length > 0 || descriptionStr.trim().length > 0;

    if (!hasRequiredData) {
      setNoRequestData(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setNoRequestData(false);
      setError(null);

      const payload = {
        category: categoryStr || "General Help",
        subject: subjectStr || categoryStr || "Help Request",
        description: descriptionStr || `Request for ${categoryStr}`,
        location: locationStr || "US",
      };

      const response = await getVolunteerOrgsList(payload);
      const orgs = parseOrganizationsResponse(response);
      setOrganizations(orgs);
    } catch (err) {
      setError("Failed to load organizations. Please try again.");
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [
    requestData.category,
    requestData.subject,
    requestData.description,
    requestData.location,
  ]);

  // Filter organizations by source and search term
  const filteredOrganizations = useMemo(() => {
    let filtered = filterBySource(organizations, sourceFilter);
    filtered = filterBySearchTerm(filtered, searchTerm);
    return filtered;
  }, [organizations, searchTerm, sourceFilter]);

  // Count organizations by source
  const sourceCounts = useMemo(
    () => countBySource(organizations),
    [organizations],
  );

  // Get display category name
  const categoryDisplay = categoryStr;

  return {
    // State
    organizations,
    filteredOrganizations,
    loading,
    noRequestData,
    error,
    sourceFilter,
    searchTerm,
    sourceCounts,
    categoryDisplay,

    // Actions
    setSourceFilter,
    setSearchTerm,
    refetch: fetchOrganizations,
  };
};

export default useOrganizations;
