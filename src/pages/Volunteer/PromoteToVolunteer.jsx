import React, { useEffect, useState, useMemo, useRef } from "react"; //added for testing
import { useImmer } from "use-immer";
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import Availability from "./steps/Availability";
import Complete from "./steps/Complete";
import Skills from "./steps/Skills";
import { useNavigate } from "react-router-dom";
import TermsConditions from "./steps/TermsConditions";
import VolunteerCourse from "./steps/VolunteerCourse";
import {
  createVolunteer,
  getVolunteerSkills,
  updateVolunteer,
} from "../../services/volunteerServices";
import { getCurrentUser } from "aws-amplify/auth";
import axios from "axios";
import { useSelector } from "react-redux";

const PromoteToVolunteer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [govtIdFile, setGovtIdFile] = useState({});
  const token = useSelector((state) => state.auth.idToken);
  const [checkedCategories, setCheckedCategories] = useImmer({});
  const [categoriesData, setCategoriesData] = useState({});
  const [availabilitySlots, setAvailabilitySlots] = useImmer([
    { id: 1, dayOfWeek: "Everyday", startTime: "00:00", endTime: "00:00" },
  ]);
  const [tobeNotified, setNotification] = useState(false);
  const volunteerDataRef = useRef({});
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await getCurrentUser(); // Fetch user once
        setUserId(user.userId);
        // setUserId("SID-00-000-000-086"); // remove this line.. added to test with aws api
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    if (!userId) fetchUserId();
  }, [userId]);

  const fetchSkills = async () => {
    try {
      const response = await getVolunteerSkills();
      setCategoriesData(response.body);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    if (!categoriesData?.categories) {
      fetchSkills();
    }
  }, []);

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
        return (
          <VolunteerCourse
            selectedFile={govtIdFile}
            setSelectedFile={setGovtIdFile}
          />
        );
      case 3:
        return (
          <Skills
            checkedCategories={checkedCategories}
            setCheckedCategories={setCheckedCategories}
            categoriesData={categoriesData}
          />
        );
      case 4:
        return (
          <Availability
            availabilitySlots={availabilitySlots}
            tobeNotified={tobeNotified}
            setAvailabilitySlots={setAvailabilitySlots}
            setNotification={setNotification}
          />
        );
      case 5:
        return <Complete />;
      default:
        return null;
    }
  };

  const saveVolunteerData = async () => {
    try {
      // console.log("Sending API Request with volunteerData:", volunteerDataRef.current);

      /* .........Uncomment this for local testing without aws api ...........*/

      // const response = await axios({
      //   method: volunteerDataRef.current.step === 1 ? "post" : "put",
      //   url: volunteerDataRef.current.step === 1
      //     ? "http://localhost:8080/0.0.1/volunteers/createvolunteer"
      //     : "http://localhost:8080/0.0.1/volunteers/updatevolunteer",
      //   data: volunteerDataRef.current, // Get latest data from ref
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      if (volunteerDataRef.current.step === 1) {
        const response = await createVolunteer(volunteerDataRef.current);
        return response;
      } else {
        const response = await updateVolunteer(volunteerDataRef.current);
        return response;
      }
    } catch (error) {
      console.error(
        "API Error:",
        error.response ? error.response.data : error.message,
      );
      return null;
    }
  };

  const extractSkillsWithHierarchy = (categories) => {
    let skills = [];

    Object.keys(categories).forEach((category) => {
      if (categories[category].checked) {
        skills.push(category);
      }

      Object.keys(categories[category]).forEach((subcategory) => {
        if (
          subcategory !== "checked" &&
          categories[category][subcategory].checked
        ) {
          skills.push(`${category}:${subcategory}`);
        }
      });
    });

    return skills.join(", ");
  };

  const updateVolunteerData = (updates) => {
    volunteerDataRef.current = { ...volunteerDataRef.current, ...updates };
    // console.log("Updated volunteerDataRef:", volunteerDataRef.current);
  };

  const handleClick = async (direction) => {
    let newStep = currentStep;
    let isValidStep = false;

    if (direction === "next") {
      switch (currentStep) {
        case 1:
          isValidStep = isAcknowledged;
          updateVolunteerData({
            step: currentStep,
            userId: userId,
            termsAndConditions: isAcknowledged,
          });
          break;
        case 2:
          isValidStep = govtIdFile && govtIdFile.name !== "";
          updateVolunteerData({
            step: currentStep,
            userId: userId,
            govtIdFilename: govtIdFile ? govtIdFile.name : "",
          });
          break;
        case 3:
          const selectedSkills = extractSkillsWithHierarchy(checkedCategories);
          isValidStep = selectedSkills !== "";
          updateVolunteerData({
            step: currentStep,
            userId: userId,
            skills: selectedSkills,
          });
          break;
        case 4:
          isValidStep = availabilitySlots.length > 0;
          updateVolunteerData({
            step: currentStep,
            userId: userId,
            notification: tobeNotified,
            isCompleted: true,
            availability: availabilitySlots,
          });
          break;
        default:
          isValidStep = false;
      }

      if (isValidStep) {
        try {
          // await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure all updates are made
          // const result = await saveVolunteerData();
          // if (!result || !result.data || result.data.statusCode !== 200) {
          //   console.error("Save failed. Step not increased.");
          //   setErrorMessage("Save Failed.");
          //   return;
          // }
          newStep++;
        } catch (error) {
          console.error("Error in handleClick:", error);
          return;
        }
      } else {
        setErrorMessage(
          "Please complete all required fields before proceeding.",
        );
      }
    } else if (direction === "prev") {
      newStep--;
    }

    if (newStep > 0 && newStep <= steps.length + 1) {
      setCurrentStep(newStep);
    }
  };

  return (
    <div className="w-4/5 mx-auto shadow-xl rounded-2xl pb-2 bg-white">
      <div className="w-full max-w-2xl mx-auto px-4 mt-4">
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
        >
          <span className="text-2xl mr-2">&lt;</span> Back to Home
        </button>
      </div>
      <div className="container horizontal mt-5 p-12">
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="mt-12 p-12">{displayStep(currentStep)}</div>
      </div>
      {errorMessage && (
        <div className="text-red-500 text-center my-4">{errorMessage}</div>
      )}
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
