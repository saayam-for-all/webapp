import { useState } from "react";
import PropTypes from "prop-types";
import SizeContributionAnalytics from "./SizeContributionAnalytics";

// Organization Dashboard (issue #2016). Each sub-tab is backed by its own API:
//   Growth & Location   -> v1/ml/growth_trend_analytics     (separate contribution)
//   Size & Contribution -> v1/ml/size_contribution_analytics
//   Rating & Type       -> v1/ml/rating_type_analytics      (separate contribution)
// To add a sub-tab, replace its placeholder with the component.
const SUB_TABS = [
  { id: "growth", label: "Growth & Location" },
  { id: "size", label: "Size & Contribution" },
  { id: "rating", label: "Rating & Type" },
];

const ComingSoon = ({ label }) => (
  <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200 text-gray-400 text-sm">
    {label} analytics coming soon.
  </div>
);

ComingSoon.propTypes = {
  label: PropTypes.string.isRequired,
};

const OrganizationAnalytics = () => {
  const [activeSubTab, setActiveSubTab] = useState("size");

  return (
    <div>
      <div className="mb-3 text-left">
        <h2 className="text-base font-bold text-gray-800 uppercase">
          Organization Dashboard
        </h2>
        <p className="text-xs text-gray-500">
          Overview of organization performance and impact
        </p>
      </div>

      <div className="flex gap-2 mb-3">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex-1 py-1.5 text-sm font-semibold rounded border ${
              activeSubTab === tab.id
                ? "bg-white text-blue-600 border-blue-500"
                : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === "growth" && <ComingSoon label="Growth & Location" />}
      {activeSubTab === "size" && <SizeContributionAnalytics />}
      {activeSubTab === "rating" && <ComingSoon label="Rating & Type" />}
    </div>
  );
};

export default OrganizationAnalytics;
