import { useTranslation } from "react-i18next";
import PHONECODESEN from "../../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../../utils/utils";

const TIME_ZONES = [
  { value: "EST", label: "EST (Eastern Standard Time)" },
  { value: "CST", label: "CST (Central Standard Time)" },
  { value: "MST", label: "MST (Mountain Standard Time)" },
  { value: "PST", label: "PST (Pacific Standard Time)" },
  { value: "IST", label: "IST (India Standard Time)" },
  { value: "GMT", label: "GMT (Greenwich Mean Time)" },
  { value: "Other", label: "Other" },
];

const PersonalInformation = ({ data, setData, errors, setErrors }) => {
  const { t } = useTranslation();

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const InputField = ({
    label,
    field,
    type = "text",
    placeholder,
    required = true,
    maxLength,
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={data[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          errors[field] ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      />
      {errors[field] && <p className="text-sm text-red-600">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {t("PERSONAL_INFORMATION") || "Personal Information"}
        </h2>
        <p className="text-gray-600 text-sm">
          {t("ALL_REQUIRED_UNLESS_NOTED") ||
            "All fields are required unless noted as optional."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label={t("FIRST_NAME") || "First Name"}
          field="firstName"
          placeholder="John"
        />
        <InputField
          label={t("LAST_NAME") || "Last Name"}
          field="lastName"
          placeholder="Doe"
        />
      </div>

      <InputField
        label={t("EMAIL") || "Email"}
        field="email"
        type="email"
        placeholder="john.doe@example.com"
      />

      {/* Phone Number Row */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {t("PHONE_NUMBER") || "Phone Number"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {/* Country Code Dropdown */}
          <select
            value={data.countryCode}
            onChange={(e) => handleChange("countryCode", e.target.value)}
            className="w-36 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {getPhoneCodeslist(PHONECODESEN).map((option) => (
              <option key={option.code} value={option.code}>
                {option.dialCode} ({option.code})
              </option>
            ))}
          </select>

          {/* Phone Number */}
          <input
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 15) {
                handleChange("phoneNumber", value);
              }
            }}
            placeholder="1234567890"
            className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.phoneNumber
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
          />

          {/* Extension (Optional) */}
          <input
            type="text"
            value={data.phoneExtension}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                handleChange("phoneExtension", value);
              }
            }}
            placeholder="Ext. (optional)"
            className={`w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.phoneExtension
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
          />
        </div>
        {(errors.phoneNumber || errors.phoneExtension) && (
          <p className="text-sm text-red-600">
            {errors.phoneNumber || errors.phoneExtension}
          </p>
        )}
      </div>

      <InputField
        label={t("LINKEDIN_URL") || "LinkedIn URL"}
        field="linkedInUrl"
        placeholder="https://www.linkedin.com/in/yourprofile"
      />

      <InputField
        label={t("GITHUB_URL") || "GitHub URL"}
        field="githubUrl"
        placeholder="https://github.com/yourusername"
      />

      {/* Time Zone */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {t("TIME_ZONE") || "Time Zone"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <select
          value={data.timeZone}
          onChange={(e) => handleChange("timeZone", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.timeZone ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        >
          <option value="">
            {t("SELECT_TIME_ZONE") || "Select your time zone"}
          </option>
          {TIME_ZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
        {errors.timeZone && (
          <p className="text-sm text-red-600">{errors.timeZone}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
