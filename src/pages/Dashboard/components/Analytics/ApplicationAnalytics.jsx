import { useState } from "react";
import RequestsAnalytics from "./RequestsAnalytics";
import KPIAnalytics from "./KPIAnalytics";
import BeneficiariesAnalytics from "./BeneficiariesAnalytics";
import VolunteerAnalytics from "./VolunteerAnalytics";
import OrganizationAnalytics from "./OrganizationAnalytics"; // Adjust path if located elsewhere

const ApplicationAnalytics = () => {
  const [activeTab, setActiveTab] = useState("requests");

  const tabs = [
    { id: "requests", label: "Requests" },
    { id: "kpi", label: "KPI" },
    { id: "beneficiaries", label: "Beneficiaries" },
    { id: "volunteers", label: "Volunteers" },
    { id: "organization", label: "Organization" },
  ];

  return (
    <div className="px-3 pb-3 pt-1 bg-gray-50">
      {/* Compact inner tab bar */}
      <div className="flex mb-2 flex-wrap">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`flex-1 min-w-[100px] py-1.5 text-sm text-center cursor-pointer border-b-2 font-semibold
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
        {activeTab === "organization" && <OrganizationAnalytics />}
      </div>
    </div>
  );
};

export default ApplicationAnalytics;
