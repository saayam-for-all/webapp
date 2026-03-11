import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const StepperControl = ({
  handleClick,
  currentStep,
  steps,
  isAcknowledged,
  isUploaded,
  isCheckedCategories,
  isAvailabilityValid,
}) => {
  const { t } = useTranslation();

  const disabledCondition =
    (currentStep === 1 && !isAcknowledged) ||
    (currentStep === 2 && !isUploaded) ||
    (currentStep === 3 && !isCheckedCategories) ||
    (currentStep === 4 && !isAvailabilityValid) ||
    currentStep >= steps.length;

  return (
    <div className="container flex justify-around mt-8 mb-8">
      <div className="px-4">
        <button
          className={`bg-white text-gray-700 uppercase py-2.5 px-6 rounded-lg font-semibold border-2 border-gray-300 transition-all duration-200 ${
            currentStep === 1
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-100 hover:border-gray-400 hover:shadow-md"
          }`}
          onClick={() => handleClick("prev")}
          disabled={currentStep === 1}
        >
          {t("BACK") || "Back"}
        </button>
      </div>
      <div className="px-4">
        <button
          onClick={() => handleClick("next")}
          className={`uppercase py-2.5 px-6 rounded-lg font-semibold transition-all duration-200 border-2 shadow-md ${
            disabledCondition
              ? "bg-teal-300 text-white border-teal-300 opacity-50 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-teal-500 cursor-pointer hover:from-teal-600 hover:to-cyan-600 hover:shadow-lg"
          }`}
          disabled={disabledCondition}
        >
          {currentStep === steps.length - 1
            ? t("CONFIRM") || "Confirm"
            : t("NEXT") || "Next"}
        </button>
      </div>
    </div>
  );
};
StepperControl.propTypes = {
  handleClick: PropTypes.func.isRequired,
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  isAcknowledged: PropTypes.bool.isRequired,
  isUploaded: PropTypes.bool.isRequired,
  isAvailabilityValid: PropTypes.bool.isRequired,
};

export default StepperControl;
