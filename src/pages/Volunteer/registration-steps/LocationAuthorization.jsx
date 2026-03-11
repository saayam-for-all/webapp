import { useTranslation } from "react-i18next";

const LocationAuthorization = ({ data, setData, errors, setErrors }) => {
  const { t } = useTranslation();

  const handleUSBasedChange = (value) => {
    setData({
      isUSBased: value,
      needOfferLetter: null,
      documentType: null,
      country: "",
    });
    setErrors({});
  };

  const handleOfferLetterChange = (value) => {
    setData((prev) => ({
      ...prev,
      needOfferLetter: value,
      documentType: null,
    }));
    if (errors.needOfferLetter) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.needOfferLetter;
        return newErrors;
      });
    }
  };

  const handleDocumentTypeChange = (value) => {
    setData((prev) => ({
      ...prev,
      documentType: value,
    }));
    if (errors.documentType) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.documentType;
        return newErrors;
      });
    }
  };

  const handleCountryChange = (value) => {
    setData((prev) => ({
      ...prev,
      country: value,
    }));
    if (errors.country) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.country;
        return newErrors;
      });
    }
  };

  const RadioOption = ({ label, checked, onChange, name }) => (
    <label
      className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
        checked
          ? "border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-sm"
          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
      />
      <span className="font-medium text-gray-700">{label}</span>
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {t("LOCATION_AUTHORIZATION") || "Location & Work Authorization"}
        </h2>
        <p className="text-gray-600 text-sm">
          {t("LOCATION_DESCRIPTION") ||
            "Help us understand your work authorization requirements."}
        </p>
      </div>

      {/* US-Based Question */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {t("ARE_YOU_US_BASED") || "Are you based in the United States?"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <RadioOption
            label={t("YES") || "Yes"}
            checked={data.isUSBased === true}
            onChange={() => handleUSBasedChange(true)}
            name="isUSBased"
          />
          <RadioOption
            label={t("NO") || "No"}
            checked={data.isUSBased === false}
            onChange={() => handleUSBasedChange(false)}
            name="isUSBased"
          />
        </div>
        {errors.isUSBased && (
          <p className="text-sm text-red-600">{errors.isUSBased}</p>
        )}
      </div>

      {/* Conditional: US-Based Follow-up */}
      {data.isUSBased === true && (
        <div className="space-y-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
          {/* Need Offer Letter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {t("NEED_OFFER_LETTER") ||
                "Do you need an offer letter for work authorization?"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <RadioOption
                label={t("YES") || "Yes"}
                checked={data.needOfferLetter === true}
                onChange={() => handleOfferLetterChange(true)}
                name="needOfferLetter"
              />
              <RadioOption
                label={t("NO") || "No"}
                checked={data.needOfferLetter === false}
                onChange={() => handleOfferLetterChange(false)}
                name="needOfferLetter"
              />
            </div>
            {errors.needOfferLetter && (
              <p className="text-sm text-red-600">{errors.needOfferLetter}</p>
            )}
          </div>

          {/* Conditional: Document Type */}
          {data.needOfferLetter === true && (
            <div className="space-y-3 animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700">
                {t("WHICH_DOCUMENT") || "Which document do you need?"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    data.documentType === "EAD"
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-sm"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="documentType"
                    checked={data.documentType === "EAD"}
                    onChange={() => handleDocumentTypeChange("EAD")}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="font-medium text-gray-700">EAD</span>
                    <p className="text-xs text-gray-500">
                      Employment Authorization Document
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    data.documentType === "i20"
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-sm"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="documentType"
                    checked={data.documentType === "i20"}
                    onChange={() => handleDocumentTypeChange("i20")}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="font-medium text-gray-700">i20</span>
                    <p className="text-xs text-gray-500">
                      Certificate of Eligibility
                    </p>
                  </div>
                </label>
              </div>
              {errors.documentType && (
                <p className="text-sm text-red-600">{errors.documentType}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Conditional: International - Country Input */}
      {data.isUSBased === false && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
          <label className="block text-sm font-medium text-gray-700">
            {t("WHICH_COUNTRY") || "Which country are you based in?"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            placeholder={t("ENTER_COUNTRY") || "Enter your country"}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.country ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.country && (
            <p className="text-sm text-red-600">{errors.country}</p>
          )}
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mt-4 shadow-sm">
        <p className="text-blue-800 text-sm">
          <strong>{t("INFO") || "Info"}:</strong>{" "}
          {t("LOCATION_INFO") ||
            "This information helps us provide the appropriate documentation for your volunteer work with our organization."}
        </p>
      </div>
    </div>
  );
};

export default LocationAuthorization;
