import React from "react"; //added for testing
import { useTranslation } from "react-i18next";

const Stepper = ({ steps, currentStep }) => {
  const { t } = useTranslation();
  // === WIDTH OF GREEN PROGRESS LINE ===
  const progressWidth =
    currentStep === 1
      ? "0%"
      : `${((currentStep - 1) / (steps.length - 1)) * 100}%`;

  return (
    <div className="relative mx-2 sm:mx-4 p-2 sm:p-4 flex justify-between items-start mb-8 w-full">
      {/* CIRCLES + LABELS */}
      {steps.map((step, index) => {
        const completed = index < currentStep - 1;
        const selected = index <= currentStep - 1;
        const highlighted = index <= currentStep - 1;

        return (
          <div key={index} className="flex flex-col items-center z-10 w-full">
            {/* Circle */}
            <div
              className={`rounded-full border-2 h-12 w-12 flex items-center justify-center transition 
                ${
                  selected
                    ? "bg-green-600 text-white border-green-600 font-bold"
                    : "border-gray-300 text-gray-700"
                }`}
            >
              {completed ? (
                <span className="text-white font-bold text-xl">&#10003;</span>
              ) : (
                t(`STEP_NUMBER_${index + 1}`)
              )}
            </div>

            {/* Label */}
            <div
              className={`mt-2 text-center text-[10px] sm:text-xs font-medium uppercase 
                ${highlighted ? "text-gray-900" : "text-gray-600"}`}
            >
              {step}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
