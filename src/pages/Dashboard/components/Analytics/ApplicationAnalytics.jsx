import { useState } from "react";
import RequestsAnalytics from "./RequestsAnalytics";
import KPIAnalytics from "./KPIAnalytics";
import BeneficiariesAnalytics from "./BeneficiariesAnalytics";
import VolunteerAnalytics from "./VolunteerAnalytics";

/**
 * ApplicationAnalytics Component
 *
 * Main container for all analytics visualizations displayed in the
 * Application Analytics tab of Super Admin and Admin dashboards.
 *
 * Organized into 4 tabs:
 * - Requests Analytics (volume trends, category distribution)
 * - KPI Analytics (resolution time, status distribution)
 * - Beneficiaries Analytics (growth trends, geographic distribution)
 * - Volunteer Analytics (activity trends, location distribution)
 */
const ApplicationAnalytics = () => {
  const [activeTab, setActiveTab] = useState("requests");

  const tabs = [
    { id: "requests", label: "Requests" },
    { id: "kpi", label: "KPI" },
    { id: "beneficiaries", label: "Beneficiaries" },
    { id: "volunteers", label: "Volunteers" },
  ];

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Application Analytics Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Comprehensive insights into requests, beneficiaries, and volunteers
        </p>
      </div>

      <div className="flex mb-4">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`flex-1 py-2 text-center cursor-pointer border-b-2 font-semibold
              ${
                activeTab === tab.id
                  ? "bg-white text-blue-500 border-blue-500"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              } ${index < tabs.length - 1 ? "mr-1" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "requests" && <RequestsAnalytics />}
        {activeTab === "kpi" && <KPIAnalytics />}
        {activeTab === "beneficiaries" && <BeneficiariesAnalytics />}
        {activeTab === "volunteers" && <VolunteerAnalytics />}
      </div>
    </div>
  );
};

export default ApplicationAnalytics;
