import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { IoSearchOutline } from "react-icons/io5";
import { FaRobot, FaClipboardList } from "react-icons/fa";

const FilterBar = ({
  sourceFilter,
  setSourceFilter,
  sourceCounts,
  searchTerm,
  setSearchTerm,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8 space-y-4">
      {/* Source Toggle */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          {t("FILTER_BY_SOURCE")}
        </span>
        <div className="inline-flex rounded-lg border border-gray-200 bg-white shadow-sm p-1">
          <button
            onClick={() => setSourceFilter("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              sourceFilter === "all"
                ? "bg-primary-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t("ALL")}
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
                sourceFilter === "all" ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              {sourceCounts.all}
            </span>
          </button>
          <button
            onClick={() => setSourceFilter("ai")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              sourceFilter === "ai"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaRobot className="text-xs" />
            {t("AI_SUGGESTED")}
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
                sourceFilter === "ai" ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              {sourceCounts.ai}
            </span>
          </button>
          <button
            onClick={() => setSourceFilter("db")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              sourceFilter === "db"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaClipboardList className="text-xs" />
            {t("REGISTERED")}
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
                sourceFilter === "db" ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              {sourceCounts.db}
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IoSearchOutline className="text-gray-400 text-xl" />
        </div>
        <input
          type="text"
          placeholder={t("SEARCH_ORGANIZATIONS_PLACEHOLDER")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
  );
};

FilterBar.propTypes = {
  sourceFilter: PropTypes.oneOf(["all", "ai", "db"]).isRequired,
  setSourceFilter: PropTypes.func.isRequired,
  sourceCounts: PropTypes.shape({
    all: PropTypes.number.isRequired,
    ai: PropTypes.number.isRequired,
    db: PropTypes.number.isRequired,
  }).isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default FilterBar;
