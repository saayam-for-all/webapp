import { useEffect, useState, useMemo, useRef } from "react"; //added for testing
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import Availability from "./steps/Availability";
import Review from "./steps/Review";
import Skills from "./steps/Skills";
import { useNavigate, useSearchParams } from "react-router-dom";
import TermsConditions from "./steps/TermsConditions";
import VolunteerCourse from "./steps/VolunteerCourse";
import {
  createVolunteer,
  updateVolunteer,
  updateUserSkills,
  saveVolunteerStep1,
} from "../../services/volunteerServices";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const getSessionStorageItem = (key) => {
  try {
    return typeof window !== "undefined" && window.sessionStorage
      ? sessionStorage.getItem(key)
      : null;
  } catch (e) {
    console.error("Error reading from sessionStorage", e);
    return null;
  }
};

const setSessionStorageItem = (key, value) => {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.setItem(key, value);
    }
  } catch (e) {
    console.error("Error writing to sessionStorage", e);
  }
};

const removeSessionStorageItem = (key) => {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.removeItem(key);
    }
  } catch (e) {
    console.error("Error removing from sessionStorage", e);
  }
};

const PromoteToVolunteer = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const stepParam = parseInt(searchParams.get("step")) || 1;
  const [currentStep, setCurrentStep] = useState(() => {
    const cachedStep = getSessionStorageItem("volunteer_wizard_step");
    return cachedStep ? parseInt(cachedStep, 10) : stepParam;
  });
  const navigate = useNavigate();
  const [isAcknowledged, setIsAcknowledged] = useState(() => {
    const cachedData = getSessionStorageItem("volunteer_form_data");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        return parsed.isAcknowledged ?? false;
      } catch (e) {
        console.error("Failed to parse volunteer_form_data:", e);
      }
    }
    return false;
  });
  const [govtIdFile, setGovtIdFile] = useState(null);
  const userDBId = useSelector(
    (state) => state.auth?.user?.userDbId || state.auth?.userDBId,
  );
  const [selectedSkills, setSelectedSkills] = useState(() => {
    const cachedData = getSessionStorageItem("volunteer_form_data");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        return parsed.selectedSkills ?? [];
      } catch (e) {
        console.error("Failed to parse volunteer_form_data:", e);
      }
    }
    return [];
  });
  const [categories, setCategories] = useState([]);
  const [availabilitySlots, setAvailabilitySlots] = useState(() => {
    const cachedData = getSessionStorageItem("volunteer_form_data");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed.availabilitySlots) {
          return parsed.availabilitySlots.map((slot) => ({
            ...slot,
            startTime: slot.startTime ? new Date(slot.startTime) : null,
            endTime: slot.endTime ? new Date(slot.endTime) : null,
          }));
        }
      } catch (e) {
        console.error("Failed to parse volunteer_form_data:", e);
      }
    }
    return [{ id: 1, dayOfWeek: "Everyday", startTime: null, endTime: null }];
  });
  const [tobeNotified, setNotification] = useState(() => {
    const cachedData = getSessionStorageItem("volunteer_form_data");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        return parsed.tobeNotified ?? false;
      } catch (e) {
        console.error("Failed to parse volunteer_form_data:", e);
      }
    }
    return false;
  });
  const volunteerDataRef = useRef({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploaded, setIsUploaded] = useState(() => {
    const cachedData = getSessionStorageItem("volunteer_form_data");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        return parsed.isUploaded ?? false;
      } catch (e) {
        console.error("Failed to parse volunteer_form_data:", e);
      }
    }
    return false;
  });

  // Save current step to sessionStorage
  useEffect(() => {
    if (currentStep < 5) {
      setSessionStorageItem("volunteer_wizard_step", currentStep.toString());
    }
  }, [currentStep]);

  // Save form data to sessionStorage
  useEffect(() => {
    if (currentStep < 5) {
      const formData = {
        isAcknowledged,
        isUploaded,
        selectedSkills,
        availabilitySlots: availabilitySlots.map((slot) => ({
          ...slot,
          startTime: slot.startTime ? slot.startTime.toISOString() : null,
          endTime: slot.endTime ? slot.endTime.toISOString() : null,
        })),
        tobeNotified,
      };
      setSessionStorageItem("volunteer_form_data", JSON.stringify(formData));
    }
  }, [
    isAcknowledged,
    isUploaded,
    selectedSkills,
    availabilitySlots,
    tobeNotified,
    currentStep,
  ]);

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
    t("TERMS_AND_CONDITIONS"),
    t("IDENTIFICATION"),
    t("SKILLS"),
    t("AVAILABILITY"),
    t("REVIEW"),
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
        userId: userDBId,
        govtIdFilename: govtIdFile.name,
      });
    }
  };

  const handleClick = async (direction) => {
    let newStep = currentStep;
    let isValidStep = false;

    if (direction === "next") {
      switch (currentStep) {
        case 1: {
          isValidStep = isAcknowledged;
          updateVolunteerData({
            step: currentStep,
            userId: userDBId,
            termsAndConditions: isAcknowledged,
          });
          if (isAcknowledged) {
            try {
              const payload = {
                step: 1,
                userId: userDBId,
                termsAndConditions: isAcknowledged,
              };
              await saveVolunteerStep1(payload);
            } catch (error) {
              console.error(
                "Failed to save Volunteer Step 1 progress (Issue BA #30):",
                error,
              );
            } finally {
              setCurrentStep(2);
            }
          }
          break;
        }
        case 2:
          // isValidStep = govtIdFile && govtIdFile.name !== "";
          handleSaveFile();
          isValidStep = govtIdFile;
          updateVolunteerData({
            step: currentStep,
            userId: userDBId,
            govtIdFilename: govtIdFile ? govtIdFile.name : "",
          });
          break;
        case 3: {
          isValidStep = selectedSkills.length > 0;
          updateVolunteerData({
            step: currentStep,
            userId: userDBId,
            skills: extractSkillsFromArray(selectedSkills),
          });
          if (isValidStep && userDBId) {
            try {
              const skillsToSave = selectedSkills.map((skill) => String(skill));
              await updateUserSkills(userDBId, skillsToSave);
            } catch (skillError) {
              console.error("Failed to save skills to API:", skillError);
              setErrorMessage(t("FAILED_TO_SAVE_SKILLS"));
              isValidStep = false;
            }
          }
          break;
        }
        case 4: {
          const hasValidSlot = isAvailabilityValid;
          isValidStep = hasValidSlot;
          if (isValidStep) {
            updateVolunteerData({
              step: currentStep,
              userId: userDBId,
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
        if (newStep === 5) {
          removeSessionStorageItem("volunteer_wizard_step");
          removeSessionStorageItem("volunteer_form_data");
        }
      } else {
        setErrorMessage(t("COMPLETE_REQUIRED_FIELDS"));
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
      {/* FIXED STEPPER WRAPPER */}
      <div className="w-full flex flex-col items-center mt-5 pt-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t("BECOME_VOLUNTEER")}
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
