import { useEffect, useState, useMemo, useRef } from "react"; //added for testing
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import Availability from "./steps/Availability";
import Review from "./steps/Review";
import Skills from "./steps/Skills";
import { useSearchParams } from "react-router-dom";
import TermsConditions from "./steps/TermsConditions";
import VolunteerCourse from "./steps/VolunteerCourse";
import {
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
  const [expiryDate, setExpiryDate] = useState(() => {
    const cachedData = getSessionStorageItem("volunteer_form_data");
    if (!cachedData) return "";
    try {
      return JSON.parse(cachedData).expiryDate ?? "";
    } catch {
      return "";
    }
  });

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  const isExpiryDateValid = Boolean(expiryDate && expiryDate > todayString);
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
  const [locationStatus, setLocationStatus] = useState("idle");
  const locationMountedRef = useRef(false);

  useEffect(() => {
    locationMountedRef.current = true;

    return () => {
      locationMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!navigator.permissions?.query) return;

    let active = true;
    let permissionStatus;

    const syncPermission = () => {
      if (!active) return;
      setLocationStatus((previous) => {
        if (permissionStatus.state === "granted") return "granted";
        if (permissionStatus.state === "denied") return "denied";
        return previous === "requesting" ? previous : "idle";
      });
    };

    navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        if (!active) return;
        permissionStatus = status;
        syncPermission();
        permissionStatus.addEventListener?.("change", syncPermission);
      })
      .catch(() => {
        // Permissions API may not support geolocation in every browser.
      });

    return () => {
      active = false;
      permissionStatus?.removeEventListener?.("change", syncPermission);
    };
  }, []);

  const handleEnableLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("requesting");

    navigator.geolocation.getCurrentPosition(
      () => {
        if (!locationMountedRef.current) return;
        setLocationStatus("granted");
      },
      (error) => {
        if (!locationMountedRef.current) return;
        setLocationStatus(error.code === 1 ? "denied" : "unavailable");
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

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
        expiryDate,
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
    expiryDate,
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
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
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
          isValidStep = Boolean(govtIdFile && isExpiryDateValid);
          if (!isExpiryDateValid) {
            setErrorMessage(t("DOCUMENT_EXPIRED_ERROR", { ns: "identity" }));
            return;
          }
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
        {currentStep === 1 && (
          <div className="w-full max-w-2xl mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {t("LOCATION_PERMISSION_TITLE")}
            </h2>
            <p className="mt-2 text-sm text-slate-700">
              {t("LOCATION_PERMISSION_DESCRIPTION")}
            </p>
            <button
              type="button"
              onClick={handleEnableLocation}
              disabled={
                locationStatus === "requesting" || locationStatus === "granted"
              }
              className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {locationStatus === "requesting"
                ? t("LOCATION_REQUESTING")
                : locationStatus === "granted"
                  ? t("LOCATION_ENABLED")
                  : t("ENABLE_LOCATION")}
            </button>
            {locationStatus === "granted" && (
              <p role="status" className="mt-2 text-sm text-green-700">
                {t("LOCATION_PERMISSION_GRANTED")}
              </p>
            )}
            {locationStatus === "denied" && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {t("LOCATION_PERMISSION_DENIED")}
              </p>
            )}
            {locationStatus === "unsupported" && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {t("LOCATION_NOT_SUPPORTED")}
              </p>
            )}
            {locationStatus === "unavailable" && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {t("LOCATION_UNAVAILABLE")}
              </p>
            )}
          </div>
        )}
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
          isExpiryDateValid={isExpiryDateValid}
          isCheckedCategories={selectedSkills.length > 0}
          isAvailabilityValid={isAvailabilityValid}
        />
      )}
    </div>
  );
};

export default PromoteToVolunteer;
