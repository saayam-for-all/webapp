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
} from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";

const VoluntaryOrganizations = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const requestData = location.state || {};
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noRequestData, setNoRequestData] = useState(false);
  const [error, setError] = useState(null);

  const getVoluntaryOrganizations = async () => {
    const categoryStr =
      typeof requestData.category === "object"
        ? requestData.category?.name || requestData.category?.catName || ""
        : requestData.category || "";

    const descriptionStr = requestData.description || "";
    const locationStr =
      requestData.location || requestData.city || requestData.state || "";
    const subjectStr = requestData.subject || categoryStr;

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

      const orgs = await getVolunteerOrgsList(payload);
      setOrganizations(orgs || []);
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
  }, [
    requestData.category,
    requestData.subject,
    requestData.description,
    requestData.location,
  ]);

  // Filter by search term across all fields
  const filteredOrganizations = useMemo(() => {
    if (!searchTerm) return organizations;
    return organizations.filter((org) =>
      Object.keys(org).some((key) =>
        String(org[key] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [organizations, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Get display category name
  const categoryDisplay =
    typeof requestData.category === "object"
      ? requestData.category?.name || requestData.category?.catName || ""
      : requestData.category || "";

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Organization card component
  const OrganizationCard = ({ org }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 overflow-hidden group">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
            <FaBuilding className="text-white text-xl" />
          </div>
          <h3 className="text-lg font-bold text-white line-clamp-2">
            {org.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* Location */}
        {org.location && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <FaMapMarkerAlt className="text-red-500" />
            </div>
            <p className="text-gray-600 text-sm">{org.location}</p>
          </div>
        )}

        {/* Contact */}
        {org.contact && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <FaPhoneAlt className="text-green-500" />
            </div>
            <a
              href={`tel:${org.contact.replace(/[^0-9+]/g, "")}`}
              className="text-gray-600 text-sm hover:text-primary-600 transition-colors"
            >
              {org.contact}
            </a>
          </div>
        )}

        {/* Email */}
        {org.email && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <FaEnvelope className="text-blue-500" />
            </div>
            <a
              href={`mailto:${org.email}`}
              className="text-gray-600 text-sm hover:text-primary-600 transition-colors truncate"
            >
              {org.email}
            </a>
          </div>
        )}

        {/* Mission (if available) */}
        {org.mission && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-gray-500 text-sm line-clamp-3 italic">
              "{org.mission}"
            </p>
          </div>
        )}
      </div>

      {/* Card Footer - Website Link */}
      {org.web_url && (
        <div className="px-5 pb-5">
          <a
            href={org.web_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium rounded-lg transition-colors group-hover:bg-primary-100"
          >
            <FaGlobe className="text-sm" />
            <span>Visit Website</span>
            <HiOutlineExternalLink className="text-sm" />
          </a>
        </div>
      )}
    </div>
  );

  // Empty state component
  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 p-6 rounded-full mb-6">
        <Icon className="text-gray-400 text-4xl" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-800 font-semibold mb-4 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            <span>{t("BACK") || "Back"}</span>
          </button>

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t("VOLUNTARY_ORGANIZATIONS") || "Voluntary Organizations"}
              </h1>
              {categoryDisplay && (
                <p className="mt-2 text-lg text-gray-700">
                  Showing organizations that can help with{" "}
                  <span className="font-semibold text-primary-600">
                    {categoryDisplay.replace(/_/g, " ").toLowerCase()}
                  </span>
                </p>
              )}
            </div>

            {/* Results count */}
            {!loading && !noRequestData && organizations.length > 0 && (
              <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                {filteredOrganizations.length}{" "}
                {filteredOrganizations.length === 1
                  ? "organization"
                  : "organizations"}{" "}
                found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        {!loading && !noRequestData && organizations.length > 0 && (
          <div className="mb-8">
            <div className="relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IoSearchOutline className="text-gray-400 text-xl" />
              </div>
              <input
                type="text"
                placeholder="Search organizations by name, location, or contact..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-gray-700 placeholder-gray-400 bg-white shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={getVoluntaryOrganizations}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Request Data State */}
        {noRequestData && !loading && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <EmptyState
              icon={FaBuilding}
              title="Request Details Required"
              description="Please provide request details (category, description, or location) to find relevant organizations that can help."
            />
            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading &&
          !noRequestData &&
          !error &&
          filteredOrganizations.length === 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <EmptyState
                icon={IoSearchOutline}
                title={
                  searchTerm ? "No Matching Results" : "No Organizations Found"
                }
                description={
                  searchTerm
                    ? `No organizations match "${searchTerm}". Try adjusting your search.`
                    : "We couldn't find any organizations for this request at the moment."
                }
              />
              {searchTerm && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          )}

        {/* Organizations Grid */}
        {!loading &&
          !noRequestData &&
          !error &&
          filteredOrganizations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizations.map((org, index) => (
                <OrganizationCard key={org.id || index} org={org} />
              ))}
            </div>
          )}

        {/* Source Attribution */}
        {!loading &&
          !noRequestData &&
          !error &&
          filteredOrganizations.length > 0 && (
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                Organizations are suggested based on your request details and
                may include AI-powered recommendations.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default VoluntaryOrganizations;
