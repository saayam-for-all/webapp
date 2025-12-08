import { useEffect, useState, useMemo, useRef } from "react"; //added for testing
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
  const [checkedCategories, setCheckedCategories] = useImmer({});
  const [categoriesData, setCategoriesData] = useState({});
  const [availabilitySlots, setAvailabilitySlots] = useImmer([
    { id: 1, dayOfWeek: "Everyday", startTime: null, endTime: null },
  ]);
  const [tobeNotified, setNotification] = useState(false);
  const volunteerDataRef = useRef({});
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [textboxCheck, setTextboxCheck] = useState(true);
  const [textboxValue, setTextboxValue] = useState("");
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

  // Transform categories from mockCategories API format to Skills component format
  const transformCategories = (categories) => {
    return categories.map((cat) => {
      const transformed = {
        category: cat.catName, // Transform catName to category
        subCategories: cat.subCategories
          ? transformCategories(cat.subCategories)
          : [],
      };
      return transformed;
    });
  };

  const fetchSkills = () => {
    // Use categories from localStorage (same as mockCategories API)
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      try {
        const categoriesArray = JSON.parse(storedCategories);
        // Transform categories to match the expected structure for Skills component
        // Skills component expects { categories: [...] } where each category has a 'category' property
        const transformedCategories = transformCategories(categoriesArray);
        setCategoriesData({ categories: transformedCategories });
      } catch (parseError) {
        console.warn("Failed to parse categories from localStorage:", parseError);
      }
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
            setIsUploaded={setIsUploaded}
          />
        );
      case 3:
        return (
          <Skills
            checkedCategories={checkedCategories}
            setCheckedCategories={setCheckedCategories}
            categoriesData={categoriesData}
            setTextboxCheck={setTextboxCheck}
            textboxValue={textboxValue}
            setTextboxValue={setTextboxValue}
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

  const isAvailabilityValid = useMemo(() => {
    if (!availabilitySlots || availabilitySlots.length === 0) return false;
    return availabilitySlots.some((slot) => {
      if (!(slot.startTime instanceof Date && slot.endTime instanceof Date))
        return false;
      return slot.endTime > slot.startTime;
    });
  }, [availabilitySlots]);

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
          const selectedSkills = extractSkillsWithHierarchy(checkedCategories);
          isValidStep =
            selectedSkills !== "" &&
            (textboxCheck || (!textboxCheck && textboxValue.trim().length > 0));
          updateVolunteerData({
            step: currentStep,
            userId: userId,
            skills: selectedSkills,
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
        <Stepper steps={steps} currentStep={currentStep} />
        {/* FIXED CONTENT WRAPPER */}
        <div className="w-full mt-8 px-4">{displayStep(currentStep)}</div>
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
          isUploaded={isUploaded}
          isAvailabilityValid={isAvailabilityValid}
          disableNext={
            (currentStep === 1 && !isAcknowledged) ||
            (currentStep === 2 && !isUploaded) ||
            (currentStep === 4 && !isAvailabilityValid)
          }
        />
      )}
    </div>
  );
};

export default PromoteToVolunteer;
