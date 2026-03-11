import { useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Stepper from "../../common/components/Wizard/Stepper";
import BeforeYouBegin from "./registration-steps/BeforeYouBegin";
import PersonalInformation from "./registration-steps/PersonalInformation";
import EducationBackground from "./registration-steps/EducationBackground";
import RoleAvailability from "./registration-steps/RoleAvailability";
import LocationAuthorization from "./registration-steps/LocationAuthorization";
import DocumentUploads from "./registration-steps/DocumentUploads";
import Acknowledgments from "./registration-steps/Acknowledgments";
import {
  registerVolunteer,
  uploadVolunteerDocument,
} from "../../services/volunteerRegistrationServices";

const STEPS = [
  "Before You Begin",
  "Personal Info",
  "Education",
  "Role & Availability",
  "Location",
  "Documents",
  "Acknowledgments",
];

const VolunteerRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 state
  const [materialsReviewed, setMaterialsReviewed] = useState(false);

  // Step 2 state - Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "US",
    phoneNumber: "",
    phoneExtension: "",
    linkedInUrl: "",
    githubUrl: "",
    timeZone: "",
  });
  const [personalInfoErrors, setPersonalInfoErrors] = useState({});

  // Step 3 state - Education
  const [education, setEducation] = useState({
    college: "",
    degreeProgram: "",
    deanContact: "",
    relevantExperience: "",
  });
  const [educationErrors, setEducationErrors] = useState({});

  // Step 4 state - Role & Availability
  const [roleAvailability, setRoleAvailability] = useState({
    preferredRole: "",
    hoursPerWeek: "",
    startDate: "",
    engagementType: "",
  });
  const [roleErrors, setRoleErrors] = useState({});

  // Step 5 state - Location & Work Authorization
  const [location, setLocation] = useState({
    isUSBased: null,
    needOfferLetter: null,
    documentType: null,
    country: "",
  });
  const [locationErrors, setLocationErrors] = useState({});

  // Step 6 state - Documents
  const [documents, setDocuments] = useState({
    resume: null,
    eadCard: null,
    i20: null,
    governmentId: null,
  });
  const [documentErrors, setDocumentErrors] = useState({});

  // Step 7 state - Acknowledgments
  const [acknowledgments, setAcknowledgments] = useState({
    dailyScrums: false,
    weeklyTimesheet: false,
    missingTimesheets: false,
    absenceNotice: false,
    accurateInfo: false,
  });

  // Form data ref for submission
  const formDataRef = useRef({});

  // Validation functions for each step
  const validatePersonalInfo = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Z\s-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^https:\/\/.+/;

    if (!personalInfo.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (!nameRegex.test(personalInfo.firstName)) {
      errors.firstName = "Only letters, spaces, and hyphens allowed";
    }

    if (!personalInfo.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (!nameRegex.test(personalInfo.lastName)) {
      errors.lastName = "Only letters, spaces, and hyphens allowed";
    }

    if (!personalInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(personalInfo.email)) {
      errors.email = "Invalid email format";
    }

    if (!personalInfo.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{7,15}$/.test(personalInfo.phoneNumber)) {
      errors.phoneNumber = "Phone must be 7-15 digits";
    }

    if (
      personalInfo.phoneExtension &&
      !/^\d{1,10}$/.test(personalInfo.phoneExtension)
    ) {
      errors.phoneExtension = "Extension must be up to 10 digits";
    }

    if (!personalInfo.linkedInUrl.trim()) {
      errors.linkedInUrl = "LinkedIn URL is required";
    } else if (!urlRegex.test(personalInfo.linkedInUrl)) {
      errors.linkedInUrl = "URL must start with https://";
    }

    if (!personalInfo.githubUrl.trim()) {
      errors.githubUrl = "GitHub URL is required";
    } else if (!urlRegex.test(personalInfo.githubUrl)) {
      errors.githubUrl = "URL must start with https://";
    }

    if (!personalInfo.timeZone) {
      errors.timeZone = "Time zone is required";
    }

    setPersonalInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEducation = () => {
    const errors = {};

    if (!education.college.trim()) {
      errors.college = "College/University is required";
    }

    if (!education.degreeProgram.trim()) {
      errors.degreeProgram = "Degree program is required";
    }

    if (
      education.relevantExperience &&
      education.relevantExperience.length > 2000
    ) {
      errors.relevantExperience = "Maximum 2000 characters allowed";
    }

    setEducationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRoleAvailability = () => {
    const errors = {};

    if (!roleAvailability.preferredRole) {
      errors.preferredRole = "Preferred role is required";
    }

    if (!roleAvailability.hoursPerWeek) {
      errors.hoursPerWeek = "Hours per week is required";
    } else if (parseInt(roleAvailability.hoursPerWeek) < 21) {
      errors.hoursPerWeek = "Minimum 21 hours per week required";
    }

    if (!roleAvailability.startDate) {
      errors.startDate = "Start date is required";
    } else {
      const selectedDate = new Date(roleAvailability.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.startDate = "Start date cannot be in the past";
      }
    }

    if (!roleAvailability.engagementType) {
      errors.engagementType = "Engagement type is required";
    }

    setRoleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLocation = () => {
    const errors = {};

    if (location.isUSBased === null) {
      errors.isUSBased = "Please select if you are US-based";
    }

    if (location.isUSBased === true && location.needOfferLetter === null) {
      errors.needOfferLetter = "Please select if you need an offer letter";
    }

    if (
      location.isUSBased === true &&
      location.needOfferLetter === true &&
      !location.documentType
    ) {
      errors.documentType = "Please select document type";
    }

    if (location.isUSBased === false && !location.country.trim()) {
      errors.country = "Country is required";
    }

    setLocationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDocuments = () => {
    const errors = {};

    if (!documents.resume) {
      errors.resume = "Resume is required";
    }

    // EAD required if US + offer letter + EAD selected
    if (
      location.isUSBased &&
      location.needOfferLetter &&
      location.documentType === "EAD" &&
      !documents.eadCard
    ) {
      errors.eadCard = "EAD Card is required";
    }

    // i20 required if US + offer letter + i20 selected
    if (
      location.isUSBased &&
      location.needOfferLetter &&
      location.documentType === "i20" &&
      !documents.i20
    ) {
      errors.i20 = "i20 document is required";
    }

    // Government ID required if international
    if (location.isUSBased === false && !documents.governmentId) {
      errors.governmentId = "Government ID is required";
    }

    setDocumentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const allAcknowledgmentsChecked = useMemo(() => {
    return Object.values(acknowledgments).every(Boolean);
  }, [acknowledgments]);

  // Step navigation handlers
  const handleNext = () => {
    let isValid = true;

    switch (currentStep) {
      case 1:
        isValid = materialsReviewed;
        break;
      case 2:
        isValid = validatePersonalInfo();
        break;
      case 3:
        isValid = validateEducation();
        break;
      case 4:
        isValid = validateRoleAvailability();
        break;
      case 5:
        isValid = validateLocation();
        break;
      case 6:
        isValid = validateDocuments();
        break;
      default:
        isValid = true;
    }

    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allAcknowledgmentsChecked) return;

    setIsSubmitting(true);

    try {
      // Assemble payload
      const payload = {
        personalInfo: {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          email: personalInfo.email,
          countryCode: personalInfo.countryCode,
          phoneNumber: personalInfo.phoneNumber,
          phoneExtension: personalInfo.phoneExtension || null,
          linkedInUrl: personalInfo.linkedInUrl,
          githubUrl: personalInfo.githubUrl,
          timeZone: personalInfo.timeZone,
        },
        education: {
          college: education.college,
          degreeProgram: education.degreeProgram,
          deanContact: education.deanContact || null,
          relevantExperience: education.relevantExperience || null,
        },
        roleAvailability: {
          preferredRole: roleAvailability.preferredRole,
          hoursPerWeek: parseInt(roleAvailability.hoursPerWeek),
          startDate: roleAvailability.startDate,
          engagementType: roleAvailability.engagementType,
        },
        location: {
          isUSBased: location.isUSBased,
          needOfferLetter: location.isUSBased ? location.needOfferLetter : null,
          documentType:
            location.isUSBased && location.needOfferLetter
              ? location.documentType
              : null,
          country: !location.isUSBased ? location.country : null,
        },
        acknowledgments: acknowledgments,
      };

      // POST form data to backend
      const response = await registerVolunteer(payload);
      const submissionId = response.submissionId;

      // Upload documents
      const { firstName, lastName } = personalInfo;
      const documentsToUpload = [];

      if (documents.resume) {
        documentsToUpload.push({
          file: documents.resume,
          docType: "Resume",
          submissionId,
          firstName,
          lastName,
        });
      }

      if (documents.eadCard) {
        documentsToUpload.push({
          file: documents.eadCard,
          docType: "EAD_Card",
          submissionId,
          firstName,
          lastName,
        });
      }

      if (documents.i20) {
        documentsToUpload.push({
          file: documents.i20,
          docType: "i20",
          submissionId,
          firstName,
          lastName,
        });
      }

      if (documents.governmentId) {
        documentsToUpload.push({
          file: documents.governmentId,
          docType: "Government_ID",
          submissionId,
          firstName,
          lastName,
        });
      }

      // Upload all documents
      for (const doc of documentsToUpload) {
        await uploadVolunteerDocument(doc);
      }

      // Navigate to success page
      navigate("/dashboard", {
        state: {
          successMessage:
            t("VOLUNTEER_REGISTRATION_SUCCESS") ||
            "Thank you! HR will review your application within 2-3 business days. You'll be contacted via WhatsApp or email.",
        },
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BeforeYouBegin
            materialsReviewed={materialsReviewed}
            setMaterialsReviewed={setMaterialsReviewed}
          />
        );
      case 2:
        return (
          <PersonalInformation
            data={personalInfo}
            setData={setPersonalInfo}
            errors={personalInfoErrors}
            setErrors={setPersonalInfoErrors}
          />
        );
      case 3:
        return (
          <EducationBackground
            data={education}
            setData={setEducation}
            errors={educationErrors}
            setErrors={setEducationErrors}
          />
        );
      case 4:
        return (
          <RoleAvailability
            data={roleAvailability}
            setData={setRoleAvailability}
            errors={roleErrors}
            setErrors={setRoleErrors}
          />
        );
      case 5:
        return (
          <LocationAuthorization
            data={location}
            setData={setLocation}
            errors={locationErrors}
            setErrors={setLocationErrors}
          />
        );
      case 6:
        return (
          <DocumentUploads
            documents={documents}
            setDocuments={setDocuments}
            errors={documentErrors}
            setErrors={setDocumentErrors}
            locationData={location}
          />
        );
      case 7:
        return (
          <Acknowledgments
            acknowledgments={acknowledgments}
            setAcknowledgments={setAcknowledgments}
          />
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !materialsReviewed;
      case 7:
        return !allAcknowledgmentsChecked;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4">
      <ToastContainer position="top-center" autoClose={5000} />

      <div className="max-w-4xl mx-auto">
        {/* Back to Dashboard */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-purple-600 hover:text-purple-800 font-semibold text-lg flex items-center transition-colors"
          >
            <span className="text-2xl mr-2">&lt;</span>
            {t("BACK_TO_DASHBOARD") || "Back to Dashboard"}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8">
          {t("VOLUNTEER_REGISTRATION") || "Volunteer Registration"}
        </h1>

        {/* Stepper */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md"
            }`}
          >
            {t("BACK") || "Back"}
          </button>

          {currentStep < STEPS.length ? (
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md ${
                isNextDisabled()
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {t("NEXT") || "Next"}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAcknowledgmentsChecked || isSubmitting}
              className={`px-8 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md ${
                !allAcknowledgmentsChecked || isSubmitting
                  ? "bg-green-300 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("SUBMITTING") || "Submitting..."}
                </span>
              ) : (
                t("SUBMIT") || "Submit"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistration;
