import { useState, useEffect } from "react";
import React from "react"; //added for testing

const Stepper = ({ steps, currentStep }) => {
  const [newStep, setNewStep] = useState(() =>
    steps.map((step, index) => ({
      description: step,
      completed: false,
      highlighted: index === 0,
      selected: index === 0,
    })),
  );

  const updateStep = (stepNumber) => {
    setNewStep((prevSteps) =>
      prevSteps.map((step, index) => {
        if (index === stepNumber) {
          return {
            ...step,
            highlighted: true,
            selected: true,
            completed: false,
          };
        } else if (index < stepNumber) {
          return {
            ...step,
            highlighted: true,
            selected: true,
            completed: true,
          };
        } else {
          return {
            ...step,
            highlighted: false,
            selected: false,
            completed: false,
          };
        }
      }),
    );
  };

  useEffect(() => {
    updateStep(currentStep - 1);
  }, [steps, currentStep]);

  // === WIDTH OF GREEN PROGRESS LINE ===
  const progressWidth =
    currentStep === 1
      ? "0%"
      : `${((currentStep - 1) / (steps.length - 1)) * 100}%`;

  return (
    <div className="relative mx-2 sm:mx-4 p-2 sm:p-4 flex justify-between items-start mb-8 w-full">
      {/* CIRCLES + LABELS */}
      {newStep.map((step, index) => (
        <div key={index} className="flex flex-col items-center z-10 w-full">
          {/* Circle */}
          <div
            className={`rounded-full border-2 h-12 w-12 flex items-center justify-center transition 
              ${
                step.selected
                  ? "bg-green-600 text-white border-green-600 font-bold"
                  : "border-gray-300 text-gray-700"
              }`}
          >
            {step.completed ? (
              <span className="text-white font-bold text-xl">&#10003;</span>
            ) : (
              index + 1
            )}
          </div>

          {/* Label */}
          <div
            className={`mt-2 text-center text-[10px] sm:text-xs font-medium uppercase 
              ${step.highlighted ? "text-gray-900" : "text-gray-600"}`}
          >
            {step.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
