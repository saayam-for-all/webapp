import { useTranslation } from "react-i18next";

const ACKNOWLEDGMENT_ITEMS = [
  {
    key: "dailyScrums",
    title: "Daily Scrum Attendance",
    description:
      "I understand that I must attend daily scrum meetings at 10AM PST / 1PM EST on weekdays.",
  },
  {
    key: "weeklyTimesheet",
    title: "Weekly Timesheet Submission",
    description:
      "I understand that I must submit my timesheet weekly by Monday.",
  },
  {
    key: "missingTimesheets",
    title: "Timesheet Policy",
    description:
      "I understand that missing 2 consecutive weeks of timesheets will result in termination.",
  },
  {
    key: "absenceNotice",
    title: "Absence Notice Requirement",
    description:
      "I understand that 1 week of absence without prior notice will void my offer letter.",
  },
  {
    key: "accurateInfo",
    title: "Accuracy Statement",
    description:
      "I confirm that all information provided in this application is accurate and complete to the best of my knowledge.",
  },
];

const Acknowledgments = ({ acknowledgments, setAcknowledgments }) => {
  const { t } = useTranslation();

  const handleChange = (key) => {
    setAcknowledgments((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Helper to get translation with fallback (t() returns the key if not found, not undefined)
  const getTranslation = (key, fallback) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const allChecked = Object.values(acknowledgments).every(Boolean);
  const checkedCount = Object.values(acknowledgments).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {t("ACKNOWLEDGMENTS") || "Acknowledgments"}
        </h2>
        <p className="text-gray-600 text-sm">
          {t("ACKNOWLEDGMENTS_DESCRIPTION") ||
            "Please read and acknowledge each statement below before submitting your application."}
        </p>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6 shadow-sm">
        <p className="text-amber-800 text-sm">
          <strong>{t("IMPORTANT") || "Important"}:</strong>{" "}
          {t("ALL_REQUIRED") ||
            "All acknowledgments are required to complete your registration."}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {t("PROGRESS") || "Progress"}: {checkedCount}/
            {ACKNOWLEDGMENT_ITEMS.length}
          </span>
          {allChecked && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {t("ALL_ACKNOWLEDGED") || "All acknowledged!"}
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(checkedCount / ACKNOWLEDGMENT_ITEMS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Acknowledgment Items */}
      <div className="space-y-4">
        {ACKNOWLEDGMENT_ITEMS.map((item, index) => (
          <label
            key={item.key}
            className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              acknowledgments[item.key]
                ? "border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm"
                : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/30 hover:shadow-sm"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={acknowledgments[item.key]}
                onChange={() => handleChange(item.key)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm">
                  {index + 1}
                </span>
                <h3
                  className={`font-medium ${acknowledgments[item.key] ? "text-green-700" : "text-gray-800"}`}
                >
                  {getTranslation(
                    `ACK_${item.key.toUpperCase()}_TITLE`,
                    item.title,
                  )}
                </h3>
              </div>
              <p
                className={`text-sm ${acknowledgments[item.key] ? "text-green-600" : "text-gray-600"}`}
              >
                {getTranslation(
                  `ACK_${item.key.toUpperCase()}_DESC`,
                  item.description,
                )}
              </p>
            </div>
            {acknowledgments[item.key] && (
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>

      {!allChecked && (
        <p className="text-center text-sm text-amber-600 mt-4">
          {t("ACKNOWLEDGE_ALL_TO_SUBMIT") ||
            "Please acknowledge all statements above to enable the Submit button."}
        </p>
      )}

      {allChecked && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-4 shadow-sm">
          <p className="text-green-800 text-sm text-center flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              <strong>{t("READY_TO_SUBMIT") || "Ready to submit!"}</strong>{" "}
              {t("CLICK_SUBMIT") ||
                'Click the "Submit" button below to complete your registration.'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Acknowledgments;
