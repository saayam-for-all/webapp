import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const StepperControl = ({
  handleClick,
  currentStep,
  steps,
  isAcknowledged,
  isUploaded,
  isAvailabilityValid,
}) => {
  const { t } = useTranslation();

  const disabledCondition =
    (currentStep === 1 && !isAcknowledged) ||
    (currentStep === 2 && !isUploaded) ||
    (currentStep === 4 && !isAvailabilityValid) ||
    currentStep >= steps.length;

  return (
    <div className="container flex justify-around mt-16 mb-8">
      <div className="px-4 w-24">
        <button
          className={`bg-white text-slate-900 uppercase py-2 px-4 rounded-xl font-semibold border-2 border-slate-900 transition duration-200 ease-in-out ${
            currentStep === 1
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-slate-700 hover:text-white"
          }`}
          onClick={() => handleClick("prev")}
          disabled={currentStep === 1}
        >
          {t("BACK") || "Back"}
        </button>
      </div>
      <div className="px-4 w-24">
        <button
          onClick={() => handleClick("next")}
          className={`uppercase py-2 px-4 rounded-xl font-semibold transition duration-200 ease-in-out border-2 ${
            disabledCondition
              ? "bg-green-300 text-gray border-green-300 opacity-50 cursor-not-allowed"
              : "bg-green-500 text-white border-green-600 cursor-pointer hover:bg-slate-700 hover:text-white"
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
