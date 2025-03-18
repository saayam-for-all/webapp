import React, { useState } from "react";
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";

const Wizard = ({ steps, displayStep }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const handleClick = (direction) => {
    let newStep = currentStep;
    direction === "next" ? newStep++ : newStep--;
    newStep > 0 && newStep <= steps.length + 1 && setCurrentStep(newStep);
  };

  return (
    <React.Fragment>
      <div className="container horizontal mt-5 p-12">
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="mt-12 p-12">{displayStep(currentStep)}</div>
      </div>
      {currentStep !== steps.length + 1 && (
        <StepperControl
          handleClick={handleClick}
          currentStep={currentStep}
          steps={steps}
        />
      )}
    </React.Fragment>
  );
};

export default Wizard;
