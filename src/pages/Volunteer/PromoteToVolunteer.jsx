import { useEffect, useState, useMemo, useRef } from "react"; //added for testing
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import Availability from "./steps/Availability";
import Review from "./steps/Review";
import Skills from "./steps/Skills";
import { useNavigate } from "react-router-dom";
import TermsConditions from "./steps/TermsConditions";
import VolunteerCourse from "./steps/VolunteerCourse";
import {
  createVolunteer,
  updateVolunteer,
} from "../../services/volunteerServices";
import { getCurrentUser } from "aws-amplify/auth";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PromoteToVolunteer = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [govtIdFile, setGovtIdFile] = useState(null);
  const token = useSelector((state) => state.auth.idToken);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availabilitySlots, setAvailabilitySlots] = useState([
    { id: 1, dayOfWeek: "Everyday", startTime: null, endTime: null },
  ]);
  const [tobeNotified, setNotification] = useState(false);
  const volunteerDataRef = useRef({});
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

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

  useEffect(() => {
    if (categories.length === 0) {
      const storedCategories = localStorage.getItem("categories");
      if (storedCategories) {
        try {
          setCategories(JSON.parse(storedCategories));
        } catch (parseError) {
          console.warn(
            "Failed to parse categories from localStorage:",
            parseError,
          );
        }
      }
    }
  }, []);

  const steps = [
    "Terms & Conditions",
    "Identification",
    "Skills",
    "Availability",
    "Review",
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
            setIsUploaded={setIsUploaded}
            onSaveFile={handleSaveFile}
          />
        );
      case 3:
        return (
          <Skills
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            categories={categories}
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
        return <Review />;
      default:
        return null;
    }
  };

  const isAvailabilityValid = useMemo(() => {
    if (!availabilitySlots || availabilitySlots.length === 0) return false;
    return availabilitySlots.some((slot) => {
      if (!(slot.startTime instanceof Date && slot.endTime instanceof Date))
        return false;
      return slot.endTime > slot.startTime;
    });
  }, [availabilitySlots]);

  const extractSkillsFromArray = (skills) => {
    return skills.join(", ");
  };

  const updateVolunteerData = (updates) => {
    volunteerDataRef.current = { ...volunteerDataRef.current, ...updates };
  };

  const handleSaveFile = () => {
    if (govtIdFile) {
      updateVolunteerData({
        step: 2,
        userId: userId,
        govtIdFilename: govtIdFile.name,
      });
    }
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
          // isValidStep = govtIdFile && govtIdFile.name !== "";
          isValidStep = govtIdFile;
          updateVolunteerData({
            step: currentStep,
            userId: userId,
            govtIdFilename: govtIdFile ? govtIdFile.name : "",
          });
          break;
        case 3: {
          isValidStep = selectedSkills.length > 0;
          updateVolunteerData({
            step: currentStep,
            userId: userId,
            skills: extractSkillsFromArray(selectedSkills),
          });
          break;
        }
        case 4: {
          const hasValidSlot = isAvailabilityValid;
          isValidStep = hasValidSlot;
          if (isValidStep) {
            updateVolunteerData({
              step: currentStep,
              userId: userId,
              notification: tobeNotified,
              isCompleted: true,
              availability: availabilitySlots.map((slot) => ({
                dayOfWeek: slot.dayOfWeek,
                startTime: slot.startTime?.toISOString(),
                endTime: slot.endTime?.toISOString(),
              })),
            });
          }
          break;
        }
        default:
          isValidStep = false;
      }

      if (isValidStep) {
        setErrorMessage("");
        newStep++;
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
    <div className="w-full mx-auto shadow-xl rounded-2xl pb-2 bg-white">
      <div className="w-full px-4 mt-4 flex justify-start">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
        >
          <span className="text-2xl mr-2">&lt;</span>
          {t("BACK_TO_DASHBOARD") || "Back to Dashboard"}
        </button>
      </div>
      {/* FIXED STEPPER WRAPPER */}
      <div className="w-full flex flex-col items-center mt-5 pt-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t("Become a Volunteer") || "Become a Volunteer"}
        </h1>
        <Stepper steps={steps} currentStep={currentStep} />
        {/* FIXED CONTENT WRAPPER */}
        <div className="w-full mt-8 px-4">{displayStep(currentStep)}</div>
      </div>
      {errorMessage && (
        <div className="text-red-500 text-center my-4">{errorMessage}</div>
      )}
      {currentStep !== steps.length && (
        <StepperControl
          handleClick={handleClick}
          currentStep={currentStep}
          steps={steps}
          isAcknowledged={isAcknowledged}
          isUploaded={isUploaded}
          isCheckedCategories={selectedSkills.length > 0}
          isAvailabilityValid={isAvailabilityValid}
          disableNext={
            (currentStep === 1 && !isAcknowledged) ||
            (currentStep === 2 && !isUploaded) ||
            (currentStep === 3 && selectedSkills.length === 0) ||
            (currentStep === 4 && !isAvailabilityValid)
          }
        />
      )}
    </div>
  );
};

export default PromoteToVolunteer;
