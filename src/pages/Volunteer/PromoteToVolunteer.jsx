import React from 'react' //added for testing
import { useState } from "react";
import { useImmer } from "use-immer";
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import Skills from "./steps/Skills";
import TermsConditions from "./steps/TermsConditions";
import Complete from "./steps/Complete";
import VolunteerCourse from "./steps/VolunteerCourse";
import Availability from "./steps/Availability";

const PromoteToVolunteer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  // state variable to track the skills(categories and subcategories) that the user has selected/checked. 
  const [checkedCategories, setCheckedCategories] = useImmer({});

  const steps = [
    "Terms & Conditions",
    "Identification",
    "Skills",
    "Availability",
  ];

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return (
          <TermsConditions
            isAcknowledged={isAcknowledged}
            setIsAcknowledged={setIsAcknowledged}
          />
        );
      case 2:
        return <VolunteerCourse />;
      case 3:
        return <Skills checkedCategories={checkedCategories} setCheckedCategories={setCheckedCategories}/>;
      case 4:
        return <Availability />;
      case 5:
        return <Complete />;
      default:
        return null;
    }
  };

  const handleClick = (direction) => {
    let newStep = currentStep;

    if (direction === "next") {
      if (currentStep === 1 && !isAcknowledged) return;
      if (currentStep === 3) {
        // Need to send this data to server before going to next step
        console.log("checkedCategories: ", checkedCategories);
      }
      newStep++;
    } else if (direction === "prev") {
      newStep--;
    }

    if (newStep > 0 && newStep <= steps.length + 1) {
      setCurrentStep(newStep);
    }
  };

  return (
    <div className="w-4/5 mx-auto shadow-xl rounded-2xl pb-2 bg-white">
      <div className="container horizontal mt-5 p-12">
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="mt-12 p-12">{displayStep(currentStep)}</div>
      </div>
      {currentStep !== steps.length + 1 && (
        <StepperControl
          handleClick={handleClick}
          currentStep={currentStep}
          steps={steps}
          isAcknowledged={isAcknowledged}
        />
      )}
    </div>
  );
};

export default PromoteToVolunteer;
