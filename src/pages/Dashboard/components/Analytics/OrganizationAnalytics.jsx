import { useState } from "react";
import GrowthLocationAnalytics from "./GrowthLocationAnalytics";

// Organization Dashboard (Application Analytics → Organization).
// Sub-tabs map 1:1 to the backend APIs:
//   Growth & Location   → v1/ml/growth_trend_analytics
//   Size & Contribution → v1/ml/size_contribution_analytics
//   Rating & Type       → v1/ml/rating_type_analytics
const ComingSoon = () => (
  <div className="flex items-center justify-center h-56 text-gray-400 text-sm bg-white rounded-lg border border-gray-200">
    Coming soon.
  </div>
);

const SUB_TABS = [
  {
    id: "growthLocation",
    label: "Growth & Location",
    Component: GrowthLocationAnalytics,
  },
  {
    id: "sizeContribution",
    label: "Size & Contribution",
    Component: ComingSoon,
  },
  { id: "ratingType", label: "Rating & Type", Component: ComingSoon },
];

const OrganizationAnalytics = () => {
  const [activeTab, setActiveTab] = useState(SUB_TABS[0].id);
  const ActiveComponent =
    SUB_TABS.find((tab) => tab.id === activeTab)?.Component ?? ComingSoon;

  return (
    <div className="text-left">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Organization Dashboard
        </h2>
        <p className="text-xs text-gray-500">
          Overview of organization performance and impact
        </p>
      </div>

      <div className="flex mb-3" role="tablist">
        {SUB_TABS.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`flex-1 py-1.5 text-sm text-center cursor-pointer border-b-2 font-semibold
              ${
                activeTab === tab.id
                  ? "bg-white text-blue-500 border-blue-500"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              } ${index < SUB_TABS.length - 1 ? "mr-1" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </div>
  );
};

export default OrganizationAnalytics;
