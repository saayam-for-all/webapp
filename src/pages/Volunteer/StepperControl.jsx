import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

const StepperControl = ({
  handleClick,
  currentStep,
  steps,
  isAcknowledged,
  isUploaded,
  isExpiryDateValid = true,
  hasExpiryDate = true,
  expiryDateOption = "expiryDate",
  isCheckedCategories,
  isAvailabilityValid,
}) => {
  const { t } = useTranslation();

  const disabledCondition =
    (currentStep === 1 && !isAcknowledged) ||
    (currentStep === 2 &&
      (!isUploaded ||
        !(
          expiryDateOption === "noExpiryDate" ||
          (expiryDateOption === "expiryDate" && isExpiryDateValid)
        ))) ||
    (currentStep === 3 && !isCheckedCategories) ||
    (currentStep === 4 && !isAvailabilityValid) ||
    currentStep >= steps.length;

  let nextTooltipContent = "";
  if (currentStep === 3 && !isCheckedCategories) {
    nextTooltipContent = t("common:SELECT_SKILL_TO_CONTINUE");
  } else if (currentStep === 1 && !isAcknowledged) {
    nextTooltipContent = t("TOOLTIP_ACCEPT_TERMS");
  } else if (currentStep === 2 && !isUploaded) {
    nextTooltipContent = t("TOOLTIP_UPLOAD_GOVT_ID");
  } else if (currentStep === 2 && !expiryDateOption) {
    nextTooltipContent = t("identity:TOOLTIP_SELECT_EXPIRY_DATE_OPTION");
  } else if (
    currentStep === 2 &&
    expiryDateOption === "expiryDate" &&
    (!hasExpiryDate || !isExpiryDateValid)
  ) {
    nextTooltipContent = t("identity:TOOLTIP_ENTER_DOCUMENT_EXPIRY_DATE");
  }

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
          {t("common:BACK") || "Back"}
        </button>
      </div>
      <div className="px-4 w-24">
        <span
          className="inline-block"
          data-tooltip-id="next-button-tooltip"
          data-tooltip-content={nextTooltipContent}
        >
          <button
            onClick={() => handleClick("next")}
            className={`uppercase py-2 px-4 rounded-xl font-semibold transition duration-200 ease-in-out border-2 ${
              disabledCondition
                ? "bg-green-300 text-gray border-green-300 opacity-50 cursor-not-allowed"
                : "bg-green-500 text-white border-green-600 cursor-pointer hover:bg-slate-700 hover:text-white"
            }`}
            disabled={disabledCondition}
            data-testid="next-button"
          >
            {currentStep === steps.length - 1
              ? t("common:CONFIRM") || "Confirm"
              : t("common:NEXT") || "Next"}
          </button>
        </span>
        {nextTooltipContent ? (
          <Tooltip
            id="next-button-tooltip"
            place="top"
            style={{ backgroundColor: "#1f2937", color: "#fff" }}
          />
        ) : null}
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
  isExpiryDateValid: PropTypes.bool,
  hasExpiryDate: PropTypes.bool,
  expiryDateOption: PropTypes.string,
  isCheckedCategories: PropTypes.bool.isRequired,
  isAvailabilityValid: PropTypes.bool.isRequired,
};

export default StepperControl;
