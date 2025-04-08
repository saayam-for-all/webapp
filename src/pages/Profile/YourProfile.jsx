import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserAttributes } from "aws-amplify/auth";
import { useTranslation } from "react-i18next";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import CountryList from "react-select-country-list";
import { FiPhoneCall, FiVideo } from "react-icons/fi";
import CallModal from "./CallModal.jsx";
import { updateUserProfileSuccess } from "../../redux/features/authentication/authSlice";

function YourProfile({ setHasUnsavedChanges }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState("audio");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (user) {
      let extractedCountryCode = "US";
      let extractedPhone = user.phone_number || "";

      if (user.phone_number && user.phone_number.startsWith("+")) {
        // Create array of country codes sorted by length (longest first)
        // to avoid partial matches
        const countryCodes = Object.entries(PHONECODESEN)
          .map(([code, data]) => ({ code, dialCode: data.secondary }))
          .sort((a, b) => b.dialCode.length - a.dialCode.length);

        for (const { code, dialCode } of countryCodes) {
          if (user.phone_number.startsWith(dialCode)) {
            extractedCountryCode = code;
            extractedPhone = user.phone_number.slice(dialCode.length);
            break;
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
  }, [user]);

  const handleInputChange = (name, value) => {
    setProfileInfo({ ...profileInfo, [name]: value });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setIsEditing(false);
      setHasUnsavedChanges(false);

      const countryCodeValue =
        PHONECODESEN[profileInfo.phoneCountryCode]?.secondary || "+1";

      const updatedAttributes = {
        given_name: profileInfo.firstName,
        family_name: profileInfo.lastName,
        email: profileInfo.email,
        phone_number: `${countryCodeValue}${profileInfo.phone}`,
        "custom:Country": profileInfo.country,
      };

      await updateUserAttributes(updatedAttributes);
      dispatch(updateUserProfileSuccess(updatedAttributes));

      console.log("Profile successfully updated!");
    } catch (error) {
      console.error("Error updating Cognito attributes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCallInitiation = (type) => {
    setCallType(type);
    setIsCallModalOpen(true);
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
              className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
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
              className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
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
          <input
            type="email"
            value={profileInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
          />
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
                className="w-1/3 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
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
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-2/3 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
              />
            </>
          ) : (
            <>
              <p className="text-lg text-gray-900">
                {PHONECODESEN[profileInfo.phoneCountryCode]?.country || ""}{" "}
                {PHONECODESEN[profileInfo.phoneCountryCode]?.dialCode
                  ? `(${PHONECODESEN[profileInfo.phoneCountryCode].dialCode})`
                  : ""}{" "}
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
            className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
          >
            <option value="">Select a country</option>
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

      {/* Buttons */}
      <div className="flex justify-center mt-6">
        {!isEditing ? (
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => setIsEditing(true)}
          >
            {t("EDIT")}
          </button>
        ) : (
          <>
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : t("SAVE")}
            </button>
            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setIsEditing(false);
                setHasUnsavedChanges(false);
                // Reset form data to original values
                if (user) {
                  let extractedCountryCode = "US";
                  let extractedPhone = user.phone_number || "";

                  if (user.phone_number && user.phone_number.startsWith("+")) {
                    const countryCodes = Object.entries(PHONECODESEN)
                      .map(([code, data]) => ({
                        code,
                        dialCode: data.secondary,
                      }))
                      .sort((a, b) => b.dialCode.length - a.dialCode.length);

                    for (const { code, dialCode } of countryCodes) {
                      if (user.phone_number.startsWith(dialCode)) {
                        extractedCountryCode = code;
                        extractedPhone = user.phone_number.slice(
                          dialCode.length,
                        );
                        break;
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
              }}
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
