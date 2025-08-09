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
  const firstNameRef = useRef(null);
  const countries = CountryList().getData();
  const user = useSelector((state) => state.auth.user);

  // Name validation states - Removed general validation message
  const [nameErrors, setNameErrors] = useState({
    firstName: "",
    lastName: "",
  });

  // Phone validation state
  const [phoneError, setPhoneError] = useState("");

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

  // Enhanced phone validation function
  const validatePhone = (value) => {
    let error = "";

    // Remove any non-digit characters for validation
    const cleanPhone = value.replace(/\D/g, "");

    // Only allow digits and check length
    if (cleanPhone.length > 10) {
      error = "Please enter only 10 digits";
    }

    setPhoneError(error);
    return error === "";
  };

  // Validate phone for save - shows "less than 10 digits" error only when saving
  const validatePhoneForSave = (value) => {
    let error = "";

    // Remove any non-digit characters for validation
    const cleanPhone = value.replace(/\D/g, "");

    if (cleanPhone.length > 10) {
      error = "Please enter only 10 digits";
    } else if (cleanPhone.length < 10 && cleanPhone.length > 0) {
      error = "Phone number should contain 10 digits";
    }

    setPhoneError(error);
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
      // Only allow digits and limit to 10 characters - ensure no country codes get mixed in
      const phoneValue = value.replace(/\D/g, "").slice(0, 10);
      setProfileInfo((prev) => ({ ...prev, [name]: phoneValue }));

      // Real-time phone validation
      validatePhone(phoneValue);

      // Clear save error if user is correcting phone number
      if (saveError && saveError.includes("phone")) {
        setSaveError("");
      }
    } else if (name === "phoneCountryCode") {
      // When changing phone country code, don't modify the phone number itself
      setProfileInfo((prev) => ({ ...prev, [name]: value }));
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

      // Phone validation for save
      if (profileInfo.phone) {
        // Ensure phone contains only digits and extract just the numeric part
        const cleanPhone = profileInfo.phone.replace(/\D/g, "");

        // Update the profileInfo to ensure it's clean before validation
        if (cleanPhone !== profileInfo.phone) {
          setProfileInfo((prev) => ({ ...prev, phone: cleanPhone }));
        }

        if (!/^\d+$/.test(cleanPhone)) {
          throw new Error("Phone number must contain only digits");
        }
        if (!validatePhoneForSave(cleanPhone)) {
          throw new Error(
            "Please fix the phone number validation errors before saving",
          );
        }
        if (cleanPhone.length !== 10) {
          throw new Error("Phone number must be exactly 10 digits");
        }

        // Use the clean phone for formatting
        formattedPhone = `${countryCodeValue}${cleanPhone}`;
      }

      // Check if email has changed
      const emailChanged = profileInfo.email !== originalEmail;

      if (emailChanged) {
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
    // Reset name validation errors
    setNameErrors({
      firstName: "",
      lastName: "",
    });
    // Reset phone validation error
    setPhoneError("");
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
              className="block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
            />
            {profileInfo.email !== originalEmail && (
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
              <div className="w-2/3">
                <input
                  type="text"
                  value={profileInfo.phone}
                  onChange={(e) =>
                    handleInputChange(
                      "phone",
                      e.target.value.replace(/\D/g, ""),
                    )
                  }
                  className={`block w-full bg-white text-gray-700 border ${
                    phoneError ? "border-red-500" : "border-gray-200"
                  } rounded py-3 px-4 focus:outline-none`}
                  placeholder="1234567890"
                  maxLength={10}
                />
                {phoneError && (
                  <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {profileInfo.phone.length}/10
                </p>
              </div>
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
