import React, { useState, useEffect, useMemo } from "react";
import { getVolunteerOrgsList } from "../../services/volunteerServices";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaBuilding,
  FaArrowLeft,
  FaRobot,
  FaClipboardList,
} from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";

const VoluntaryOrganizations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Get request data from navigation state
  const requestData = location.state || {};

  // Handle category - can be string or object
  const getCategoryString = (category) => {
    if (!category) return "";
    if (typeof category === "object") {
      return category.name || category.catName || "";
    }
    return category;
  };

  const categoryStr = getCategoryString(requestData.category);
  const subjectStr = requestData.subject || "";
  const descriptionStr = requestData.description || "";
  const locationStr = requestData.location || "";

  // State definitions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noRequestData, setNoRequestData] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all"); // "all", "ai", "db"

  // Helper to determine if source is "db" (registered) or "ai"
  const isDbSource = (source) => {
    if (!source) return true; // Missing treated as db
    const normalized = source.toLowerCase();
    return normalized === "db" || normalized === "database";
  };

  const getVoluntaryOrganizations = async () => {
    try {
      setLoading(true);
      setNoRequestData(false);
      setError(null);

      // Check if we have required request data
      if (!categoryStr && !descriptionStr) {
        setNoRequestData(true);
        setLoading(false);
        return;
      }

      const payload = {
        category: categoryStr || "General Help",
        subject: subjectStr || categoryStr || "Help Request",
        description: descriptionStr || `Request for ${categoryStr}`,
        location: locationStr || "US",
      };

      const response = await getVolunteerOrgsList(payload);

      // Parse response - Lambda returns: { statusCode, headers, body: [...] }
      let orgs = [];
      if (response?.body && Array.isArray(response.body)) {
        orgs = response.body;
      } else if (response?.body && typeof response.body === "string") {
        orgs = JSON.parse(response.body);
      } else if (Array.isArray(response)) {
        orgs = response;
      }

      setOrganizations(orgs);
    } catch (err) {
      console.error("Error fetching organizations:", err);
      setError("Failed to load organizations. Please try again.");
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVoluntaryOrganizations();
  }, []);

  // Calculate source counts
  const sourceCounts = useMemo(() => {
    const counts = { all: organizations.length, ai: 0, db: 0 };
    organizations.forEach((org) => {
      if (isDbSource(org.db_or_ai)) {
        counts.db++;
      } else {
        counts.ai++;
      }
    });
    return counts;
  }, [organizations]);

  // Filter organizations based on search and source filter
  const filteredOrganizations = useMemo(() => {
    let filtered = organizations;

    // Filter by source
    if (sourceFilter === "ai") {
      filtered = filtered.filter((org) => !isDbSource(org.db_or_ai));
    } else if (sourceFilter === "db") {
      filtered = filtered.filter((org) => isDbSource(org.db_or_ai));
    }

    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (org) =>
          org.name?.toLowerCase().includes(lowerSearch) ||
          org.location?.toLowerCase().includes(lowerSearch) ||
          org.causes?.toLowerCase().includes(lowerSearch) ||
          org.description?.toLowerCase().includes(lowerSearch),
      );
    }

    return filtered;
  }, [organizations, searchTerm, sourceFilter]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const getSourceBadge = (source) => {
    if (isDbSource(source)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FaClipboardList className="mr-1" />
          Registered
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <FaRobot className="mr-1" />
        AI Suggested
      </span>
    );
  };

  const renderOrganizationCard = (org, index) => (
    <div
      key={org.id || index}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <FaBuilding className="text-gray-500 mr-3 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
        </div>
        {getSourceBadge(org.db_or_ai)}
      </div>

      {org.description && (
        <p className="text-gray-600 mb-4 text-sm">{org.description}</p>
      )}

      <div className="space-y-2 text-sm">
        {org.location && (
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-red-500" />
            <span>{org.location}</span>
          </div>
        )}
        {org.phone && (
          <div className="flex items-center text-gray-600">
            <FaPhoneAlt className="mr-2 text-green-500" />
            <span>{org.phone}</span>
          </div>
        )}
        {org.email && (
          <div className="flex items-center text-gray-600">
            <FaEnvelope className="mr-2 text-blue-500" />
            <a href={`mailto:${org.email}`} className="hover:underline">
              {org.email}
            </a>
          </div>
        )}
        {org.web_url && (
          <div className="flex items-center text-gray-600">
            <FaGlobe className="mr-2 text-purple-500" />
            <a
              href={org.web_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center"
            >
              Visit Website
              <HiOutlineExternalLink className="ml-1" />
            </a>
          </div>
        )}
      </div>

      {org.causes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-xs font-medium text-gray-500 uppercase">
            {t("CAUSES") || "Causes"}:
          </span>
          <p className="text-sm text-gray-700 mt-1">{org.causes}</p>
        </div>
      )}
    </div>
  );

  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 animate-pulse"
        >
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );

  // Format category for display
  const displayCategory = categoryStr
    ? categoryStr.replace(/_/g, " ").toLowerCase()
    : "";

  if (noRequestData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Request Details Required
        </h2>
        <p className="text-gray-600 mb-4">
          Please provide request details to find matching organizations.
        </p>
        <button
          onClick={handleGoToDashboard}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center mb-4"
          >
            <FaArrowLeft className="mr-2" />
            {t("BACK") || "Back"}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("VOLUNTARY_ORGANIZATIONS") || "Organizations That Can Help"}
          </h1>
          {displayCategory && (
            <p className="text-gray-600 mt-1">Category: {displayCategory}</p>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Source Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSourceFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sourceFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({sourceCounts.all})
              </button>
              <button
                onClick={() => setSourceFilter("ai")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  sourceFilter === "ai"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaRobot className="mr-2" />
                AI Suggested ({sourceCounts.ai})
              </button>
              <button
                onClick={() => setSourceFilter("db")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  sourceFilter === "db"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaClipboardList className="mr-2" />
                Registered ({sourceCounts.db})
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={getVoluntaryOrganizations}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && renderLoadingSkeletons()}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Results Summary */}
            <div className="mb-4">
              <p className="text-gray-600">
                {filteredOrganizations.length} organizations found
              </p>
            </div>

            {/* No organizations from API */}
            {organizations.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Organizations Found
                </h3>
                <p className="text-gray-600">
                  We couldn't find any organizations matching your request.
                </p>
              </div>
            )}

            {/* No results from search/filter */}
            {organizations.length > 0 && filteredOrganizations.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Matching Results
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters.
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Organizations Grid */}
            {filteredOrganizations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrganizations.map((org, index) =>
                  renderOrganizationCard(org, index),
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VoluntaryOrganizations;
