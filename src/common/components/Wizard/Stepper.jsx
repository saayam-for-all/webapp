import { useState, useEffect, useRef } from "react";

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
        } else if (index === stepNumber - 1 && stepNumber > 0) {
          return {
            ...step,
            highlighted: true,
            selected: true,
            completed: true,
          };
        } else if (
          index === stepNumber + 1 &&
          stepNumber < prevSteps.length - 1
        ) {
          return {
            ...step,
            highlighted: false,
            selected: false,
            completed: false,
          };
        }
        return step;
      }),
    );
  };

  useEffect(() => {
    updateStep(currentStep - 1);
  }, [steps, currentStep]);

  const displaySteps = newStep.map((step, index) => {
    return (
      <div
        key={index}
        className={
          index !== newStep.length - 1
            ? "w-full flex items-center"
            : "flex items-center"
        }
      >
        <div className="relative flex flex-col items-center text-teal-600">
          <div
            className={`rounded-full transition duration-500 ease-in-out border-2 border-gray-300 h-12 w-12 flex items-center justify-center py-3 ${
              step.selected
                ? "bg-green-600 text-white font-bold border border-green-600"
                : ""
            }`}
          >
            {step.completed ? (
              <span className="text-white font-bold text-xl">&#10003;</span>
            ) : (
              index + 1
            )}
          </div>
          <div
            className={`absolute text-center mt-16 w-max text-xs font-medium uppercase 
            ${step.highlighted ? "text-gray-900" : "text-gray-600"}`}
          >
            {step.description}
          </div>
        </div>
        <div
          className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
            step.completed ? "border-green-600" : "border-gray-300"
          }`}
        ></div>
      </div>
    );
  });

  return (
    <div className="mx-4 p-4 flex justify-between items-center mb-8">
      {displaySteps}
    </div>
  );
};

export default Stepper;
