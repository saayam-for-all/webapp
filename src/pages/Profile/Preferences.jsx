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

function Preferences({ setHasUnsavedChanges }) {
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
    dashboardView: user?.dashboard_view || "",
    languagePreference: user?.language_preference || "",
    firstLanguagePreference: user?.first_language_preference || "",
    thirdLanguagePreference: user?.third_language_preference || "",
    phone: user?.phone_number || "",
    primaryPreference: user?.primary_preference || "",
  });

  useEffect(() => {
    if (user) {
      setProfileInfo({
        dashboardView: user.dashboard_view || "",
        languagePreference: user.language_preference || "",
        firstLanguagePreference: user.first_language_preference || "",
        thirdLanguagePreference: user.third_language_preference || "",
        phone: user.phone_number || "",
        primaryPreference: user.primary_preference || "",
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

      // Prepare updated attributes for Cognito
      const updatedAttributes = {
        dashboard_view: profileInfo?.dashboardView,
        language_preference: profileInfo.languagePreference,
        first_language_preference: profileInfo.firstLanguagePreference,
        third_language_preference: profileInfo.thirdLanguagePreference,
        phone_number: profileInfo.phone,
        primary_preference: profileInfo.primaryPreference,
      };

      console.log("Updating Cognito with:", updatedAttributes);
      await updateUserAttributes(updatedAttributes);

      // Update Redux state
      dispatch(updateUserProfileSuccess(updatedAttributes));

      console.log("Profile successfully updated!");
    } catch (error) {
      console.error("Error updating Cognito attributes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col border p-6 rounded-lg w-full">
      {/* Dashboard_view */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("Default Dashboard View")}
          </label>
          {isEditing ? (
            <select
              ref={firstNameRef}
              value={profileInfo.dashboardView}
              onChange={(e) =>
                handleInputChange("dashboardView", e.target.value)
              }
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          ) : (
            <p className="text-lg text-gray-900">
              {profileInfo.dashboardView || ""}
            </p>
          )}
        </div>
      </div>

      {/* Dashboard_view */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("Default Dashboard View")}
          </label>
          {isEditing ? (
            <select
              ref={firstNameRef}
              value={profileInfo.dashboardView}
              onChange={(e) =>
                handleInputChange("dashboardView", e.target.value)
              }
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          ) : (
            <p className="text-lg text-gray-900">
              {profileInfo.dashboardView || ""}
            </p>
          )}
        </div>
      </div>

      {/* Language_Preference */}
      <div
        className="grid grid-cols-1 gap-4 mb-6"
        data-testid="container-test-3"
      >
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("Language Preference")}
          </label>
          {isEditing ? (
            <select
              value={profileInfo.languagePreference}
              onChange={(e) =>
                handleInputChange("languagePreference", e.target.value)
              }
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="english">English</option>
              <option value="telugu">Telugu</option>
              <option value="hindi">Hindi</option>
              {/* Add more language options here */}
            </select>
          ) : (
            <p className="text-lg text-gray-900">
              {profileInfo.languagePreference || ""}
            </p>
          )}
        </div>
      </div>

      {/* First_Language_Preference */}
      <div
        className="grid grid-cols-1 gap-4 mb-6"
        data-testid="container-test-3"
      >
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("FIRST_LANGUAGE_PREFERENCE")}
          </label>
          {isEditing ? (
            <select
              value={profileInfo.firstLanguagePreference}
              onChange={(e) =>
                handleInputChange("firstLanguagePreference", e.target.value)
              }
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="english">Telugu</option>
              <option value="telugu">English</option>
              <option value="hindi">Hindi</option>
              {/* Add more language options here */}
            </select>
          ) : (
            <p className="text-lg text-gray-900">
              {profileInfo.firstLanguagePreference || ""}
            </p>
          )}
        </div>
      </div>

      {/* Third_Language_Preference */}
      <div
        className="grid grid-cols-1 gap-4 mb-6"
        data-testid="container-test-3"
      >
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("THIRD_LANGUAGE_PREFERENCE")}
          </label>
          {isEditing ? (
            <select
              value={profileInfo.thirdLanguagePreference}
              onChange={(e) =>
                handleInputChange("thirdLanguagePreference", e.target.value)
              }
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
              <option value="telugu">Telugu</option>
              {/* Add more language options here */}
            </select>
          ) : (
            <p className="text-lg text-gray-900">
              {profileInfo.thirdLanguagePreference || ""}
            </p>
          )}
        </div>
      </div>

      {/* Primary Preference */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {t("Primary Preferences")}
        </label>
        <div className="flex items-center space-x-2"></div>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="my-email@gmail.com"
              name="Primary Preference"
              value="my-email@gmail.com"
              checked={profileInfo.primaryPreference === "my-email@gmail.com"}
              onChange={(e) =>
                handleInputChange("primaryPreference", e.target.value)
              }
              className="mr-2"
            />
            <label htmlFor="email1">my-email@gmail.com</label>
            <input
              type="radio"
              id="my-other-email@gmail.com"
              name="Primary Preference"
              value="my-other-email@gmail.com"
              checked={
                profileInfo.primaryPreference === "my-other-email@gmail.com"
              }
              onChange={(e) =>
                handleInputChange("primaryPreference", e.target.value)
              }
              className="mr-2"
            />
            <label htmlFor="email2">my-other-email@gmail.com</label>
          </div>
        ) : (
          <p className="text-lg text-gray-900">
            {profileInfo.primaryPreference || ""}
          </p>
        )}
      </div>

      {/* Phone Preferences */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {t("Phone Preferences")}
        </label>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <input
              type="text"
              value={profileInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {profileInfo.phoneCountryCode} {profileInfo.phone}
            </p>
          )}
          <FiPhoneCall
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => setIsCallModalOpen(true)}
          />
          <FiVideo
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => setIsCallModalOpen(true)}
          />
        </div>
      </div>

      {/* Edit / Save Buttons */}
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
              onClick={() => setIsEditing(false)}
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

export default Preferences;
