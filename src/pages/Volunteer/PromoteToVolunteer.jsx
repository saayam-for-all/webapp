import React, { useEffect, useState, useMemo, useRef } from "react"; //added for testing
import { useImmer } from "use-immer";
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import Availability from "./steps/Availability";
import Complete from "./steps/Complete";
import Skills from "./steps/Skills";
import TermsConditions from "./steps/TermsConditions";
import VolunteerCourse from "./steps/VolunteerCourse";
import {
  createVolunteer,
  getVolunteerSkills,
  updateVolunteer,
} from "../../services/volunteerServices";
import { getCurrentUser } from "aws-amplify/auth";
import { setUserId } from "../../redux/features/user/userSlice";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

const PromoteToVolunteer = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  // const [userId, setUserId] = useState(null);
  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadAck, setUploadAck] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Fetch current user details (loginId)
        const user = await getCurrentUser();
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    // Only fetch userId once when the component mounts
    fetchUserId();
  }, []);
  useEffect(() => {
    // This will run after userId has been updated
    if (userId) {
      console.log("User ID is set:", userId);
    } else {
      console.log("User ID is not set");
    }
  }, [userId]); // This hook will run whenever userId changes
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
            setIsUploaded={setIsUploaded}
            ack={uploadAck}
            setAck={setUploadAck}
            error={uploadError}
            setError={setUploadError}
            preview={previewUrl}
            setPreview={setPreviewUrl}
            fileInputRef={fileInputRef}
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

  const testLocalBe = async () => {
    try {
      // console.log("Sending API Request with volunteerData:", volunteerDataRef.current);

      /* .........Uncomment this for local testing without aws api ...........*/

      const response = await axios({
        method: "get",
        url: "http://localhost:8080/0.0.1/volunteers/all",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error(
        "API Error:",
        error.response ? error.response.data : error.message,
      );
      return null;
    }
  };

  const saveVolunteerData = async () => {
    try {
      const formData = new FormData();
      if (
        volunteerDataRef.current.step === 2 &&
        govtIdFile &&
        govtIdFile.name !== ""
      ) {
        formData.append("file", govtIdFile); // Assuming govtIdFile is the file you want to send
      }

      formData.append(
        "volunteerData",
        JSON.stringify(volunteerDataRef.current),
      );

      // Determine the API URL based on the current step
      const apiUrl =
        volunteerDataRef.current.step === 1
          ? "http://localhost:8080/0.0.1/volunteers/createvolunteer"
          : volunteerDataRef.current.step === 2
            ? "http://localhost:8080/0.0.1/volunteers/updatestep2"
            : volunteerDataRef.current.step === 3
              ? "http://localhost:8080/0.0.1/volunteers/updatestep3"
              : "http://localhost:8080/0.0.1/volunteers/updatestep4";
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const data =
        volunteerDataRef.current.step === 2
          ? formData // For step 2, send FormData (with the file and other metadata)
          : volunteerDataRef.current;
      const response = await axios({
        method: volunteerDataRef.current.step === 1 ? "post" : "put",
        url: apiUrl,
        data: data,
        headers: headers,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      console.error("API Error:", errorMessage);

      // Show the message to the user
      alert(errorMessage); // You can replace this with a toast/snackbar if preferred

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
          saveVolunteerData();
          break;
        case 2:
          isValidStep = govtIdFile && govtIdFile.name !== "";
          updateVolunteerData({
            step: currentStep,
            userId: userId,
            govtIdFilename: govtIdFile ? govtIdFile.name : "",
          });
          saveVolunteerData();
          break;
        case 3:
          const selectedSkills = extractSkillsWithHierarchy(checkedCategories);
          isValidStep = selectedSkills !== "";
          updateVolunteerData({
            step: currentStep,
            userId: userId,
            skills: selectedSkills,
          });
          saveVolunteerData();
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
          saveVolunteerData();
          break;
        default:
          isValidStep = false;
      }

      if (isValidStep) {
        try {
          setErrorMessage("");
          // await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure all updates are made
          // const result = await saveVolunteerData();
          // if (!result || !result.data || result.data.statusCode !== 200) {
          //   console.error("Save failed. Step not increased.");
          //   setErrorMessage("Save Failed.");
          //   return;
          // }
          setErrorMessage("");
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
    } else if (direction === "confirm") {
      updateVolunteerData({
        step: currentStep,
        userId: userId,
        notification: tobeNotified,
        isCompleted: true,
        availability: availabilitySlots,
      });
      saveVolunteerData();
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
          isCheckedCategories={Object.keys(checkedCategories).length !== 0}
          isAvailabilitySlots={availabilitySlots.every(
            ({ startTime, endTime }) =>
              startTime !== null && endTime !== null && endTime > startTime,
          )}
        />
      )}
    </div>
  );
};

export default PromoteToVolunteer;
