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
  const firstNameRef = useRef(null);
  const countries = CountryList().getData();
  const user = useSelector((state) => state.auth.user);

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

  const handleInputChange = (name, value) => {
    setProfileInfo((prev) => ({ ...prev, [name]: value }));
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

      const countryCodeValue =
        PHONECODESEN[profileInfo.phoneCountryCode]?.secondary || "+1";
      const formattedPhone = `${countryCodeValue}${profileInfo.phone.replace(/\D/g, "")}`;

      // Basic validation
      if (!profileInfo.firstName.trim() || !profileInfo.lastName.trim()) {
        throw new Error("First and last name are required");
      }

      if (!profileInfo.email.trim()) {
        throw new Error("Email is required");
      }

      if (profileInfo.phone && !/^\d+$/.test(profileInfo.phone)) {
        throw new Error("Phone number must contain only digits");
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
            <input
              ref={firstNameRef}
              type="text"
              value={profileInfo.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
            />
          ) : (
            <p className="text-lg text-gray-900">{profileInfo.firstName}</p>
          )}
        </div>
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("LAST_NAME")}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={profileInfo.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
            />
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
                {(PHONECODESEN[profileInfo.phoneCountryCode]?.dialCode || "") +
                  ""}
                {(PHONECODESEN[profileInfo.phoneCountryCode]?.primary ||
                  PHONECODESEN[profileInfo.phoneCountryCode]?.country ||
                  "") + " "}
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
