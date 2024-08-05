import { useState } from "react";
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import PersonalInfo from "./steps/PersonalInfo";
import TermsConditions from "./steps/TermsConditions";
import Complete from "./steps/Complete";
import VolunteerCourse from "./steps/VolunteerCourse";

const courseUrl = "a9__D53WsUs";

const PromoteToVolunteer = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    "Personal Information",
    "Volunteer Course",
    "Terms & Conditions",
  ];

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return <PersonalInfo />;
      case 2:
        return <VolunteerCourse />;
      case 3:
        return <TermsConditions />;
      case 4:
        return <Complete />;
      default:
    }
  };

  const handleClick = (direction) => {
    let newStep = currentStep;

    direction === "next" ? newStep++ : newStep--;

    newStep > 0 && newStep <= steps.length + 1 && setCurrentStep(newStep);
  };

  return (
    <div className="w-4/5 h-5/6 mx-auto shadow-xl rounded-2xl pb-2 bg-white">
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
    </div>
  );
};

export default PromoteToVolunteer;
