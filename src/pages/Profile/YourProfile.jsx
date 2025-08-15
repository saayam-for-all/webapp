import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserAttributes } from "aws-amplify/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import CountryList from "react-select-country-list";
import { FiPhoneCall, FiVideo } from "react-icons/fi";
import CallModal from "./CallModal.jsx";
import { updateUserProfile } from "../../redux/features/authentication/authActions";
import LoadingIndicator from "../../common/components/Loading/Loading";

function YourProfile({ setHasUnsavedChanges }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState("audio");
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [pendingEmailChange, setPendingEmailChange] = useState(null);
  const [saveAttempted, setSaveAttempted] = useState(false); // Track if save was attempted
  const [showEmailVerificationMessage, setShowEmailVerificationMessage] =
    useState(false); // New state to control email verification message
  const firstNameRef = useRef(null);
  const countries = CountryList().getData();
  const user = useSelector((state) => state.auth.user);

  // Name validation states - Removed general validation message
  const [nameErrors, setNameErrors] = useState({
    firstName: "",
    lastName: "",
  });

  // Email validation state
  const [emailError, setEmailError] = useState("");

  const [profileInfo, setProfileInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneCountryCode: "US",
    country: "",
  });

  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    if (user) {
      let extractedCountryCode = "US";
      let extractedPhone = user.phone_number || "";

      if (user.phone_number && user.phone_number.startsWith("+")) {
        const userCountry = user.zoneinfo || "United States";
        const possibleCountryCodes = Object.entries(PHONECODESEN)
          .filter(([_, data]) => data.primary === userCountry)
          .map(([code, data]) => ({
            code,
            dialCode: data.secondary,
            length: data.secondary.length,
          }));

        if (possibleCountryCodes.length > 0) {
          possibleCountryCodes.sort((a, b) => b.length - a.length);

          for (const { code, dialCode } of possibleCountryCodes) {
            if (user.phone_number.startsWith(dialCode)) {
              extractedCountryCode = code;
              extractedPhone = user.phone_number
                .slice(dialCode.length)
                .replace(/\D/g, "");
              break;
            }
          }
        } else {
          const countryCodes = Object.entries(PHONECODESEN)
            .map(([code, data]) => ({
              code,
              dialCode: data.secondary,
              length: data.secondary.length,
            }))
            .sort((a, b) => b.length - a.length);

          for (const { code, dialCode } of countryCodes) {
            if (user.phone_number.startsWith(dialCode)) {
              extractedCountryCode = code;
              extractedPhone = user.phone_number
                .slice(dialCode.length)
                .replace(/\D/g, "");
              break;
            }
          }
        }
      }

      const userEmail = user.email || "";
      setOriginalEmail(userEmail);
      setProfileInfo({
        firstName: user.given_name || "",
        lastName: user.family_name || "",
        email: userEmail,
        phone: extractedPhone,
        phoneCountryCode: extractedCountryCode,
        country: user.zoneinfo || "",
      });
    }
  }, [user]);

  // Validate name function - for real-time validation (numbers, character limit, and multiple spaces)
  const validateName = (name, value) => {
    let error = "";

    if (value.length > 50) {
      error = "Maximum 50 characters allowed";
    } else if (/\d/.test(value)) {
      error = "Numbers are not allowed";
    } else if (/\s{2,}/.test(value)) {
      error = "Multiple consecutive spaces are not allowed";
    }

    setNameErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  // Validate email function - for save validation only (not real-time)
  const validateEmail = (value, showError = false) => {
    let error = "";

    if (value) {
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      if (!emailRegex.test(value)) {
        error = "Please enter a valid email address";
      }
    }

    // Only set the error if showError is true (during save)
    if (showError) {
      setEmailError(error);
    }
    return error === "";
  };

  // Validate required fields - for save validation
  const validateRequiredFields = () => {
    const errors = { firstName: "", lastName: "" };
    let hasError = false;

    const firstNameEmpty =
      !profileInfo.firstName || profileInfo.firstName.trim() === "";
    const lastNameEmpty =
      !profileInfo.lastName || profileInfo.lastName.trim() === "";

    if (firstNameEmpty) {
      errors.firstName = "First name is required";
      hasError = true;
    }

    if (lastNameEmpty) {
      errors.lastName = "Last name is required";
      hasError = true;
    }

    // Also check for existing validation errors (numbers, character limit, multiple spaces)
    if (nameErrors.firstName && !firstNameEmpty) {
      errors.firstName = nameErrors.firstName;
      hasError = true;
    }

    if (nameErrors.lastName && !lastNameEmpty) {
      errors.lastName = nameErrors.lastName;
      hasError = true;
    }

    setNameErrors(errors);
    return !hasError;
  };

  const handleInputChange = (name, value) => {
    if (name === "firstName" || name === "lastName") {
      // Limit to 50 characters
      const limitedValue = value.slice(0, 50);
      setProfileInfo((prev) => ({ ...prev, [name]: limitedValue }));

      // Real-time validation for numbers, character limit, and multiple spaces
      validateName(name, limitedValue);

      // If save was attempted and user starts typing, clear the "required" error for that field
      if (saveAttempted && limitedValue.trim()) {
        setNameErrors((prev) => ({
          ...prev,
          [name]: prev[name].includes("required") ? "" : prev[name],
        }));
      }

      // Clear save error if user is correcting name fields
      if (
        saveError &&
        (saveError.includes("validation errors") ||
          saveError.includes("First name") ||
          saveError.includes("Last name"))
      ) {
        setSaveError("");
      }
    } else if (name === "phone") {
      // Simple phone handling - just store the value as-is (like old code)
      setProfileInfo((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else if (name === "phoneCountryCode") {
      // When changing phone country code, don't modify the phone number itself
      setProfileInfo((prev) => ({ ...prev, [name]: value }));
    } else if (name === "email") {
      setProfileInfo((prev) => ({ ...prev, [name]: value }));

      // Clear email validation error when user is typing
      if (emailError) {
        setEmailError("");
      }

      // Clear save error if user is correcting email
      if (saveError && saveError.includes("email")) {
        setSaveError("");
      }

      // Hide email verification message when user is typing
      if (showEmailVerificationMessage) {
        setShowEmailVerificationMessage(false);
      }
    } else {
      setProfileInfo((prev) => ({ ...prev, [name]: value }));
    }
    setHasUnsavedChanges(true);
  };

  const sendEmailVerification = async (newEmail) => {
    try {
      // Send verification code to new email
      await updateUserAttributes({
        userAttributes: {
          email: newEmail,
        },
      });
      return true;
    } catch (error) {
      console.error("Error sending email verification:", error);
      throw new Error("Failed to send verification email");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveError("");
      setSaveAttempted(true); // Mark that save was attempted

      const countryCodeValue =
        PHONECODESEN[profileInfo.phoneCountryCode]?.secondary || "+1";

      let formattedPhone = countryCodeValue; // Default to just country code

      // Validate required fields and show field-specific errors
      if (!validateRequiredFields()) {
        throw new Error("Please fix the validation errors before saving");
      }

      if (!profileInfo.email.trim()) {
        throw new Error("Email is required");
      }

      // Email validation for save - using proper email format validation
      if (profileInfo.email) {
        if (!validateEmail(profileInfo.email, true)) {
          throw new Error("Please enter a valid email address");
        }
      }

      // Simple phone validation (like old code)
      if (profileInfo.phone) {
        // Basic validation - only check if it contains only digits
        if (!/^\d+$/.test(profileInfo.phone)) {
          throw new Error("Phone number must contain only digits");
        }

        // Use the phone for formatting
        formattedPhone = `${countryCodeValue}${profileInfo.phone}`;
      }

      // Check if email has changed - show verification message only when attempting to save
      const emailChanged = profileInfo.email !== originalEmail;

      if (emailChanged) {
        // Show email verification message
        setShowEmailVerificationMessage(true);

        // Store the pending email change and send verification
        setPendingEmailChange({
          firstName: profileInfo.firstName,
          lastName: profileInfo.lastName,
          email: profileInfo.email,
          phone: formattedPhone,
          country: profileInfo.country,
        });

        // Send verification email
        await sendEmailVerification(profileInfo.email);

        // Navigate to OTP verification page
        navigate("/verify-otp", {
          state: {
            email: profileInfo.email,
            isEmailUpdate: true,
            pendingProfileData: {
              firstName: profileInfo.firstName,
              lastName: profileInfo.lastName,
              email: profileInfo.email,
              phone: formattedPhone,
              country: profileInfo.country,
            },
          },
        });

        return;
      }

      // If email hasn't changed, proceed with regular update
      const result = await dispatch(
        updateUserProfile({
          firstName: profileInfo.firstName,
          lastName: profileInfo.lastName,
          email: profileInfo.email,
          phone: formattedPhone,
          country: profileInfo.country,
        }),
      )
        .then((response) => response)
        .catch((error) => {
          throw error;
        });

      if (result?.success) {
        alert(t("PROFILE_UPDATE_SUCCESS"));
        setIsEditing(false);
        setHasUnsavedChanges(false);
        setSaveAttempted(false);
        setSaveAttempted(false); // Reset save attempt flag on success
        setShowEmailVerificationMessage(false); // Reset email verification message
      } else {
        throw new Error(result?.error || t("PROFILE_UPDATE_FAILED"));
      }
    } catch (error) {
      console.error("Profile save error:", error);
      setSaveError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCallInitiation = (type) => {
    setCallType(type);
    setIsCallModalOpen(true);
  };

  const resetFormData = () => {
    if (user) {
      let extractedCountryCode = "US";
      let extractedPhone = user.phone_number || "";

      if (user.phone_number && user.phone_number.startsWith("+")) {
        const userCountry = user.zoneinfo || "United States";
        const possibleCountryCodes = Object.entries(PHONECODESEN)
          .filter(([_, data]) => data.primary === userCountry)
          .map(([code, data]) => ({
            code,
            dialCode: data.secondary,
            length: data.secondary.length,
          }));

        if (possibleCountryCodes.length > 0) {
          possibleCountryCodes.sort((a, b) => b.length - a.length);

          for (const { code, dialCode } of possibleCountryCodes) {
            if (user.phone_number.startsWith(dialCode)) {
              extractedCountryCode = code;
              extractedPhone = user.phone_number
                .slice(dialCode.length)
                .replace(/\D/g, "");
              break;
            }
          }
        } else {
          const countryCodes = Object.entries(PHONECODESEN)
            .map(([code, data]) => ({ code, dialCode: data.secondary }))
            .sort((a, b) => b.dialCode.length - a.dialCode.length);

          for (const { code, dialCode } of countryCodes) {
            if (user.phone_number.startsWith(dialCode)) {
              extractedCountryCode = code;
              extractedPhone = user.phone_number
                .slice(dialCode.length)
                .replace(/\D/g, "");
              break;
            }
          }
        }
      }

      setProfileInfo({
        firstName: user.given_name || "",
        lastName: user.family_name || "",
        email: user.email || "",
        phone: extractedPhone,
        phoneCountryCode: extractedCountryCode,
        country: user.zoneinfo || "",
      });
    }
    setSaveError("");
    setPendingEmailChange(null);
    setSaveAttempted(false); // Reset save attempt flag
    setShowEmailVerificationMessage(false); // Reset email verification message
    // Reset name validation errors
    setNameErrors({
      firstName: "",
      lastName: "",
    });
    // Reset email validation error
    setEmailError("");
  };

  return (
    <div className="flex flex-col border p-6 rounded-lg w-full">
      {/* Name */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("FIRST_NAME")}
          </label>
          {isEditing ? (
            <div>
              <input
                ref={firstNameRef}
                type="text"
                value={profileInfo.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`block w-full bg-white text-gray-700 border ${
                  nameErrors.firstName ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 focus:outline-none`}
                maxLength={50}
              />
              <div className="flex justify-between items-center mt-1">
                {nameErrors.firstName &&
                  !nameErrors.firstName.includes("required") && (
                    <p className="text-sm text-red-600">
                      {nameErrors.firstName}
                    </p>
                  )}
                {saveAttempted &&
                  nameErrors.firstName &&
                  nameErrors.firstName.includes("required") && (
                    <p className="text-sm text-red-600">
                      {nameErrors.firstName}
                    </p>
                  )}
                <p className="text-xs text-gray-500 ml-auto">
                  {profileInfo.firstName.length}/50
                </p>
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-900">{profileInfo.firstName}</p>
          )}
        </div>
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("LAST_NAME")}
          </label>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={profileInfo.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`block w-full bg-white text-gray-700 border ${
                  nameErrors.lastName ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 focus:outline-none`}
                maxLength={50}
              />
              <div className="flex justify-between items-center mt-1">
                {nameErrors.lastName &&
                  !nameErrors.lastName.includes("required") && (
                    <p className="text-sm text-red-600">
                      {nameErrors.lastName}
                    </p>
                  )}
                {saveAttempted &&
                  nameErrors.lastName &&
                  nameErrors.lastName.includes("required") && (
                    <p className="text-sm text-red-600">
                      {nameErrors.lastName}
                    </p>
                  )}
                <p className="text-xs text-gray-500 ml-auto">
                  {profileInfo.lastName.length}/50
                </p>
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-900">{profileInfo.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {t("EMAIL")}
        </label>
        {isEditing ? (
          <div>
            <input
              type="email"
              value={profileInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`block w-full bg-white text-gray-700 border ${
                emailError ? "border-red-500" : "border-gray-200"
              } rounded py-3 px-4 focus:outline-none`}
            />
            {emailError && (
              <p className="text-sm text-red-600 mt-1">{emailError}</p>
            )}
            {showEmailVerificationMessage &&
              profileInfo.email !== originalEmail &&
              !emailError && (
                <p className="text-sm text-orange-600 mt-1">
                  {t(
                    "EMAIL_VERIFICATION_REQUIRED",
                    "Email verification will be required for this change",
                  )}
                </p>
              )}
          </div>
        ) : (
          <p className="text-lg text-gray-900">{profileInfo.email}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {t("PHONE_NUMBER")}
        </label>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <select
                value={profileInfo.phoneCountryCode}
                onChange={(e) =>
                  handleInputChange("phoneCountryCode", e.target.value)
                }
                className="w-1/3 bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
              >
                {getPhoneCodeslist(PHONECODESEN).map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.country} ({option.dialCode})
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={profileInfo.phone}
                onChange={(e) =>
                  handleInputChange("phone", e.target.value.replace(/\D/g, ""))
                }
                className="w-2/3 bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
                placeholder="1234567890"
              />
            </>
          ) : (
            <>
              <p className="text-lg text-gray-900">
                {PHONECODESEN[profileInfo.phoneCountryCode]?.primary ||
                  PHONECODESEN[profileInfo.phoneCountryCode]?.country ||
                  ""}{" "}
                {PHONECODESEN[profileInfo.phoneCountryCode]?.secondary || ""}
                {profileInfo.phone}
              </p>
              <FiPhoneCall
                className="text-gray-500 cursor-pointer hover:text-gray-700 ml-2"
                onClick={() => handleCallInitiation("audio")}
              />
              <FiVideo
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => handleCallInitiation("video")}
              />
            </>
          )}
        </div>
      </div>

      {/* Country */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {t("COUNTRY")}
        </label>
        {isEditing ? (
          <select
            value={profileInfo.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
          >
            <option value="">{t("SELECT_COUNTRY")}</option>
            {countries.map((option) => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-lg text-gray-900">{profileInfo.country}</p>
        )}
      </div>

      {/* Error Message */}
      {saveError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {saveError}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center mt-6">
        {!isEditing ? (
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => {
              setIsEditing(true);
              setTimeout(() => {
                if (firstNameRef.current) {
                  firstNameRef.current.focus();
                }
              }, 0);
            }}
          >
            {t("EDIT")}
          </button>
        ) : (
          <>
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600 flex items-center justify-center"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingIndicator size="20px" className="mr-2" />
                  {t("SAVING")}
                </>
              ) : (
                t("SAVE")
              )}
            </button>
            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setIsEditing(false);
                setHasUnsavedChanges(false);
                resetFormData();
              }}
              disabled={loading}
            >
              {t("CANCEL")}
            </button>
          </>
        )}
      </div>

      {/* Call Modal */}
      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        callType={callType}
      />
    </div>
  );
}

export default YourProfile;
