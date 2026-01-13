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
 * Includes:
 * - Requests Analytics (volume trends, category distribution)
 * - KPI Analytics (resolution time, status distribution)
 * - Beneficiaries Analytics (growth trends, geographic distribution)
 * - Volunteer Analytics (activity trends, location distribution)
 */
const ApplicationAnalytics = () => {
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

      <div className="space-y-12">
        {/* Requests Analytics Section */}
        <RequestsAnalytics />

        {/* Divider */}
        <div className="border-t border-gray-300"></div>

        {/* KPI Analytics Section */}
        <KPIAnalytics />

        {/* Divider */}
        <div className="border-t border-gray-300"></div>

        {/* Beneficiaries Analytics Section */}
        <BeneficiariesAnalytics />

        {/* Divider */}
        <div className="border-t border-gray-300"></div>

        {/* Volunteer Analytics Section */}
        <VolunteerAnalytics />
      </div>
    </div>
  );
};

export default ApplicationAnalytics;
