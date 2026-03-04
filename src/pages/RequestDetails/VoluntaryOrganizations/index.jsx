import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaBuilding } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";

import {
  LoadingSkeleton,
  EmptyState,
  OrganizationCard,
  FilterBar,
  SourceAttribution,
} from "./components";
import { useOrganizations } from "./hooks";

const VoluntaryOrganizations = () => {
  const { t } = useTranslation(["common", "categories"]);
  const navigate = useNavigate();
  const location = useLocation();
  const requestData = location.state || {};

  const {
    organizations,
    filteredOrganizations,
    loading,
    noRequestData,
    error,
    sourceFilter,
    searchTerm,
    sourceCounts,
    categoryDisplay,
    setSourceFilter,
    setSearchTerm,
    refetch,
  } = useOrganizations(requestData);

  // Translate category using same pattern as rest of app
  const getTranslatedCategory = (category) => {
    if (!category) return "";
    const fallback = category.replace(/_/g, " ").toLowerCase();
    return t(`categories:REQUEST_CATEGORIES.${category}.LABEL`, {
      defaultValue: fallback,
    });
  };

  const hasOrganizations = organizations.length > 0;
  const hasFilteredResults = filteredOrganizations.length > 0;
  const showFilters = !loading && !noRequestData && hasOrganizations;

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
                  {t("SHOWING_ORGANIZATIONS_FOR")}{" "}
                  <span className="font-semibold text-primary-600">
                    {getTranslatedCategory(categoryDisplay)}
                  </span>
                </p>
              )}
            </div>

            {/* Results count */}
            {showFilters && (
              <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                {filteredOrganizations.length}{" "}
                {filteredOrganizations.length === 1
                  ? t("ORGANIZATION")
                  : t("ORGANIZATIONS")}{" "}
                {t("FOUND")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        {showFilters && (
          <FilterBar
            sourceFilter={sourceFilter}
            setSourceFilter={setSourceFilter}
            sourceCounts={sourceCounts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t("TRY_AGAIN")}
            </button>
          </div>
        )}

        {/* No Request Data State */}
        {noRequestData && !loading && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <EmptyState
              icon={FaBuilding}
              title={t("REQUEST_DETAILS_REQUIRED")}
              description={t("REQUEST_DETAILS_REQUIRED_DESC")}
            />
            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                {t("GO_TO_DASHBOARD")}
              </button>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && !noRequestData && !error && !hasFilteredResults && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <EmptyState
              icon={IoSearchOutline}
              title={
                searchTerm
                  ? t("NO_MATCHING_RESULTS")
                  : t("NO_ORGANIZATIONS_FOUND")
              }
              description={
                searchTerm
                  ? t("NO_ORGANIZATIONS_MATCH", { searchTerm })
                  : t("NO_ORGANIZATIONS_AT_MOMENT")
              }
            />
            {searchTerm && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t("CLEAR_SEARCH")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Organizations Grid */}
        {!loading && !noRequestData && !error && hasFilteredResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((org, index) => (
              <OrganizationCard key={org.id || index} org={org} />
            ))}
          </div>
        )}

        {/* Source Attribution */}
        {!loading && !noRequestData && !error && hasFilteredResults && (
          <SourceAttribution />
        )}
      </div>
    </div>
  );
};

export default VoluntaryOrganizations;
