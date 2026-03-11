import { useTranslation } from "react-i18next";

const PREFERRED_ROLES = [
  { value: "Full Stack Developer", label: "Full Stack Developer" },
  { value: "Product Manager", label: "Product Manager" },
  { value: "Project Manager", label: "Project Manager" },
  { value: "SDET", label: "SDET (Software Development Engineer in Test)" },
  { value: "DevSecOps", label: "DevSecOps" },
  { value: "Business Analyst", label: "Business Analyst" },
  { value: "Data Engineer", label: "Data Engineer" },
];

const ENGAGEMENT_TYPES = [
  { value: "Full-Time Volunteering", label: "Full-Time Volunteering" },
  { value: "Internship", label: "Internship" },
];

const RoleAvailability = ({ data, setData, errors, setErrors }) => {
  const { t } = useTranslation();

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user changes value
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {t("ROLE_AVAILABILITY") || "Role & Availability"}
        </h2>
        <p className="text-gray-600 text-sm">
          {t("ROLE_DESCRIPTION") ||
            "Tell us about your preferred role and availability."}
        </p>
      </div>

      {/* Preferred Role */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {t("PREFERRED_ROLE") || "Preferred Role"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <select
          value={data.preferredRole}
          onChange={(e) => handleChange("preferredRole", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.preferredRole
              ? "border-red-500 bg-red-50"
              : "border-gray-300"
          }`}
        >
          <option value="">{t("SELECT_ROLE") || "Select a role"}</option>
          {PREFERRED_ROLES.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        {errors.preferredRole && (
          <p className="text-sm text-red-600">{errors.preferredRole}</p>
        )}
      </div>

      {/* Hours Per Week */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {t("HOURS_PER_WEEK") || "Hours Per Week"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={data.hoursPerWeek}
          onChange={(e) => handleChange("hoursPerWeek", e.target.value)}
          min="21"
          placeholder="21"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.hoursPerWeek ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.hoursPerWeek && (
          <p className="text-sm text-red-600">{errors.hoursPerWeek}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {t("MIN_HOURS_NOTE") || "Minimum 21 hours per week required"}
        </p>
      </div>

      {/* Start Date */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {t("START_DATE") || "Start Date"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
          min={today}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.startDate ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.startDate && (
          <p className="text-sm text-red-600">{errors.startDate}</p>
        )}
      </div>

      {/* Engagement Type */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {t("ENGAGEMENT_TYPE") || "Engagement Type"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <select
          value={data.engagementType}
          onChange={(e) => handleChange("engagementType", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.engagementType
              ? "border-red-500 bg-red-50"
              : "border-gray-300"
          }`}
        >
          <option value="">
            {t("SELECT_ENGAGEMENT_TYPE") || "Select engagement type"}
          </option>
          {ENGAGEMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.engagementType && (
          <p className="text-sm text-red-600">{errors.engagementType}</p>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
        <p className="text-amber-800 text-sm">
          <strong>{t("NOTE") || "Note"}:</strong>{" "}
          {t("COMMITMENT_NOTE") ||
            "Full-time volunteering requires a minimum commitment of 21 hours per week. Please ensure you can meet this requirement before proceeding."}
        </p>
      </div>
    </div>
  );
};

export default RoleAvailability;
