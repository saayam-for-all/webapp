import { useTranslation } from "react-i18next";

// InputField moved outside component to prevent re-creation on each render
const InputField = ({
  label,
  field,
  placeholder,
  required = true,
  value,
  onChange,
  error,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
      {!required && (
        <span className="text-gray-400 text-xs ml-1">(optional)</span>
      )}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        error ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const EducationBackground = ({ data, setData, errors, setErrors }) => {
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {t("EDUCATION_BACKGROUND") || "Education & Background"}
        </h2>
        <p className="text-gray-600 text-sm">
          {t("EDUCATION_DESCRIPTION") ||
            "Tell us about your educational background and experience."}
        </p>
      </div>

      <InputField
        label={t("COLLEGE_UNIVERSITY") || "College/University"}
        field="college"
        placeholder="Stanford University"
        value={data.college}
        onChange={handleChange}
        error={errors.college}
      />

      <InputField
        label={t("DEGREE_PROGRAM") || "Degree Program"}
        field="degreeProgram"
        placeholder="Bachelor of Science in Computer Science"
        value={data.degreeProgram}
        onChange={handleChange}
        error={errors.degreeProgram}
      />

      <InputField
        label={t("DEAN_CONTACT") || "Dean/Department Contact Number"}
        field="deanContact"
        placeholder="+1 234 567 8901"
        required={false}
        value={data.deanContact}
        onChange={handleChange}
        error={errors.deanContact}
      />

      {/* Relevant Experience Textarea */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {t("RELEVANT_EXPERIENCE") || "Relevant Experience"}
          <span className="text-gray-400 text-xs ml-1">(optional)</span>
        </label>
        <textarea
          value={data.relevantExperience}
          onChange={(e) => {
            if (e.target.value.length <= 2000) {
              handleChange("relevantExperience", e.target.value);
            }
          }}
          placeholder={
            t("EXPERIENCE_PLACEHOLDER") ||
            "Describe any relevant work experience, projects, or skills that make you a good fit for this volunteer role..."
          }
          rows={5}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
            errors.relevantExperience
              ? "border-red-500 bg-red-50"
              : "border-gray-300"
          }`}
        />
        <div className="flex justify-between items-center">
          {errors.relevantExperience ? (
            <p className="text-sm text-red-600">{errors.relevantExperience}</p>
          ) : (
            <span></span>
          )}
          <span
            className={`text-xs ${data.relevantExperience.length > 1800 ? "text-amber-600" : "text-gray-400"}`}
          >
            {data.relevantExperience.length}/2000
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mt-4 shadow-sm">
        <p className="text-blue-800 text-sm">
          <strong>{t("TIP") || "Tip"}:</strong>{" "}
          {t("EXPERIENCE_TIP") ||
            "Include details about any open-source contributions, previous volunteer work, or technical projects."}
        </p>
      </div>
    </div>
  );
};

export default EducationBackground;
