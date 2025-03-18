import React from "react";

const StepperControl = ({ handleClick, currentStep, steps }) => {
  return (
    <div className="container flex justify-around mt-16 mb-8">
      <div className="px-4 w-24">
        <button
          className={`bg-white text-slate-400 uppercase py-2 px-4 rounded-xl font-semibold border-2 border-slate-300  transition duration-200 ease-in-out ${
            currentStep === 1
              ? "opacity-50 cursor-not-allowed"
              : " cursor-pointer hover:bg-slate-700 hover:text-white"
          }`}
          onClick={() => handleClick()}
        >
          Back
        </button>
      </div>
      <div className="px-4 w-24">
        <button
          onClick={() => handleClick("next")}
          className="bg-green-500 text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out"
        >
          {currentStep === steps.length ? "Confirm" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default StepperControl;
