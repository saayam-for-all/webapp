import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserAttributes } from "aws-amplify/auth";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { updateUserProfileSuccess } from "../../redux/features/authentication/authSlice";
import { changeUiLanguage } from "../../common/i18n/utils";
import languagesData from "../../common/i18n/languagesData";

// Dashboard options based on user roles
const dashboardOptions = [
  { value: "super-admin", label: "Super Admin Dashboard" },
  { value: "admin", label: "Admin Dashboard" },
  { value: "steward", label: "Steward Dashboard" },
  { value: "volunteer", label: "Volunteer Dashboard" },
  { value: "beneficiary", label: "Beneficiary Dashboard" },
];

function Preferences({ setHasUnsavedChanges }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const dashboardRef = useRef(null);

  const user = useSelector((state) => state.auth.user);

  const [preferencesInfo, setPreferencesInfo] = useState({
    defaultDashboard: "beneficiary",
    languagePreference1: "", // Using the same naming as PersonalInformation
    languagePreference2: "",
    languagePreference3: "",
    primaryEmailPreference: "",
    secondaryEmailPreference: "",
    selectedEmailPreference: "primary",
    primaryPhonePreference: "",
    secondaryPhonePreference: "",
    selectedPhonePreference: "primary",
    receiveEmergencyNotifications: false,
  });

  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    // Build languages options directly from languagesData.js
    const languageOptions = languagesData.map((lang) => ({
      // Special case: If the language is "Mandarin Chinese", convert its value to "Chinese" to match the locale mapping.
      value: lang.name === "Mandarin Chinese" ? "Chinese" : lang.name,
      label: lang.name,
    }));
    setLanguages(languageOptions);

    // Get personal information from localStorage (only for email/phone, NOT language preferences)
    const savedPersonalInfo =
      JSON.parse(localStorage.getItem("personalInfo")) || {};

    // Get saved preferences from localStorage
    const savedPreferences =
      JSON.parse(localStorage.getItem("userPreferences")) || {};

    // Migrate language preferences from personalInfo if they exist there
    let migratedLanguagePrefs = {};
    if (
      savedPersonalInfo.languagePreference1 ||
      savedPersonalInfo.languagePreference2 ||
      savedPersonalInfo.languagePreference3
    ) {
      migratedLanguagePrefs = {
        languagePreference1: savedPersonalInfo.languagePreference1 || "",
        languagePreference2: savedPersonalInfo.languagePreference2 || "",
        languagePreference3: savedPersonalInfo.languagePreference3 || "",
      };

      // Save migrated preferences and remove from personalInfo
      const updatedPreferences = {
        ...savedPreferences,
        ...migratedLanguagePrefs,
      };
      localStorage.setItem(
        "userPreferences",
        JSON.stringify(updatedPreferences),
      );

      // Remove language preferences from personalInfo
      const updatedPersonalInfo = { ...savedPersonalInfo };
      delete updatedPersonalInfo.languagePreference1;
      delete updatedPersonalInfo.languagePreference2;
      delete updatedPersonalInfo.languagePreference3;
      localStorage.setItem("personalInfo", JSON.stringify(updatedPersonalInfo));
    }

    if (user) {
      setPreferencesInfo({
        defaultDashboard:
          savedPreferences.defaultDashboard ||
          user.dashboard_view ||
          user["custom:dashboard_view"] ||
          "beneficiary",

        // Language preferences prioritize migrated data, then saved preferences, then Cognito
        languagePreference1:
          migratedLanguagePrefs.languagePreference1 ||
          savedPreferences.languagePreference1 ||
          user.first_language_preference ||
          user["custom:first_language_preference"] ||
          "",
        languagePreference2:
          migratedLanguagePrefs.languagePreference2 ||
          savedPreferences.languagePreference2 ||
          user.second_language_preference ||
          user["custom:second_language_preference"] ||
          "",
        languagePreference3:
          migratedLanguagePrefs.languagePreference3 ||
          savedPreferences.languagePreference3 ||
          user.third_language_preference ||
          user["custom:third_language_preference"] ||
          "",

        // Email and phone preferences come from user data and personal info
        primaryEmailPreference: user.email || "",
        secondaryEmailPreference:
          savedPersonalInfo.secondaryEmail ||
          user.secondary_email ||
          user["custom:secondary_email"] ||
          "",
        selectedEmailPreference:
          savedPreferences.selectedEmailPreference ||
          user.selected_email_preference ||
          user["custom:selected_email_preference"] ||
          "primary",

        primaryPhonePreference: user.phone_number || "",
        secondaryPhonePreference:
          savedPersonalInfo.secondaryPhone ||
          user.secondary_phone ||
          user["custom:secondary_phone"] ||
          "",
        selectedPhonePreference:
          savedPreferences.selectedPhonePreference ||
          user.selected_phone_preference ||
          user["custom:selected_phone_preference"] ||
          "primary",

        receiveEmergencyNotifications:
          savedPreferences.receiveEmergencyNotifications ??
          (user.emergency_notifications === "true" ||
            user["custom:emergency_notifications"] === "true" ||
            false),
      });
    }
  }, [user]);

  // Listen for changes in personal information (ONLY for email/phone, NOT language preferences)
  useEffect(() => {
    const handlePersonalInfoUpdate = () => {
      const savedPersonalInfo =
        JSON.parse(localStorage.getItem("personalInfo")) || {};
      setPreferencesInfo((prev) => ({
        ...prev,
        // Only update contact preferences, NOT language preferences
        secondaryEmailPreference: savedPersonalInfo.secondaryEmail || "",
        secondaryPhonePreference: savedPersonalInfo.secondaryPhone || "",
      }));
    };

    window.addEventListener("personal-info-updated", handlePersonalInfoUpdate);
    return () => {
      window.removeEventListener(
        "personal-info-updated",
        handlePersonalInfoUpdate,
      );
    };
  }, []);

  useEffect(() => {
    if (isEditing) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [isEditing, setHasUnsavedChanges]);

  const handleInputChange = (name, value) => {
    setPreferencesInfo({ ...preferencesInfo, [name]: value });
    setHasUnsavedChanges(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (dashboardRef.current) {
        dashboardRef.current.focus();
      }
    }, 0);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // First save to localStorage as backup
      localStorage.setItem("userPreferences", JSON.stringify(preferencesInfo));

      // Call changeUiLanguage to update the UI based on the first language preference (same as PersonalInformation)
      changeUiLanguage(preferencesInfo);

      // Try to update Cognito attributes
      try {
        const updatedAttributes = {};

        // Only include attributes that have changed and are not empty
        if (preferencesInfo.defaultDashboard) {
          updatedAttributes["custom:dashboard_view"] =
            preferencesInfo.defaultDashboard;
        }

        // Store language preferences
        if (preferencesInfo.languagePreference1) {
          updatedAttributes["custom:pref_first_language"] =
            preferencesInfo.languagePreference1;
        }

        if (preferencesInfo.languagePreference2) {
          updatedAttributes["custom:pref_second_language"] =
            preferencesInfo.languagePreference2;
        }

        if (preferencesInfo.languagePreference3) {
          updatedAttributes["custom:pref_third_language"] =
            preferencesInfo.languagePreference3;
        }

        if (preferencesInfo.secondaryEmailPreference) {
          updatedAttributes["custom:secondary_email"] =
            preferencesInfo.secondaryEmailPreference;
        }

        if (preferencesInfo.secondaryPhonePreference) {
          updatedAttributes["custom:secondary_phone"] =
            preferencesInfo.secondaryPhonePreference;
        }

        // Save email and phone preferences
        updatedAttributes["custom:selected_email_preference"] =
          preferencesInfo.selectedEmailPreference;
        updatedAttributes["custom:selected_phone_preference"] =
          preferencesInfo.selectedPhonePreference;
        updatedAttributes["custom:emergency_notifications"] =
          preferencesInfo.receiveEmergencyNotifications.toString();

        console.log("Attempting to update Cognito with:", updatedAttributes);

        if (Object.keys(updatedAttributes).length > 0) {
          await updateUserAttributes(updatedAttributes);
          console.log("Cognito update successful");
        }

        // Update Redux state
        dispatch(updateUserProfileSuccess(updatedAttributes));
      } catch (cognitoError) {
        console.warn(
          "Cognito update failed, but preferences saved locally:",
          cognitoError,
        );
        // Don't throw error here, just log it
      }

      setIsEditing(false);
      setHasUnsavedChanges(false);
      alert(
        t("PREFERENCES UPDATED SUCCESS") || "Preferences updated successfully!",
      );
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert(
        "Some preferences may not have been saved to the server, but they are saved locally. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setHasUnsavedChanges(false);

    // Reset to original values from localStorage or user data
    const savedPreferences = localStorage.getItem("userPreferences");
    const savedPersonalInfo =
      JSON.parse(localStorage.getItem("personalInfo")) || {};

    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferencesInfo({
          ...parsed,
          // Always get the latest secondary email/phone from personal info
          secondaryEmailPreference:
            savedPersonalInfo.secondaryEmail ||
            parsed.secondaryEmailPreference ||
            "",
          secondaryPhonePreference:
            savedPersonalInfo.secondaryPhone ||
            parsed.secondaryPhonePreference ||
            "",
        });
        return;
      } catch (e) {
        console.warn("Failed to parse saved preferences");
      }
    }

    // Fallback to user data
    if (user) {
      setPreferencesInfo({
        defaultDashboard:
          user.dashboard_view || user["custom:dashboard_view"] || "beneficiary",
        languagePreference1:
          user["custom:pref_first_language"] ||
          user.first_language_preference ||
          user["custom:first_language_preference"] ||
          "",
        languagePreference2:
          user["custom:pref_second_language"] ||
          user.second_language_preference ||
          user["custom:second_language_preference"] ||
          "",
        languagePreference3:
          user["custom:pref_third_language"] ||
          user.third_language_preference ||
          user["custom:third_language_preference"] ||
          "",
        primaryEmailPreference: user.email || "",
        secondaryEmailPreference:
          savedPersonalInfo.secondaryEmail ||
          user.secondary_email ||
          user["custom:secondary_email"] ||
          "",
        selectedEmailPreference:
          user.selected_email_preference ||
          user["custom:selected_email_preference"] ||
          "primary",
        primaryPhonePreference: user.phone_number || "",
        secondaryPhonePreference:
          savedPersonalInfo.secondaryPhone ||
          user.secondary_phone ||
          user["custom:secondary_phone"] ||
          "",
        selectedPhonePreference:
          user.selected_phone_preference ||
          user["custom:selected_phone_preference"] ||
          "primary",
        receiveEmergencyNotifications:
          user.emergency_notifications === "true" ||
          user["custom:emergency_notifications"] === "true" ||
          false,
      });
    }
  };

  return (
    <div className="flex flex-col border p-6 rounded-lg w-full">
      {/* Default Dashboard View */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {t("DEFAULT DASHBOARD VIEW")}
        </label>
        {isEditing ? (
          <Select
            ref={dashboardRef}
            value={dashboardOptions.find(
              (option) => option.value === preferencesInfo.defaultDashboard,
            )}
            options={dashboardOptions}
            onChange={(selectedOption) =>
              handleInputChange("defaultDashboard", selectedOption?.value || "")
            }
            className="w-full"
            placeholder={t("SELECT DASHBOARD")}
          />
        ) : (
          <p className="text-lg text-gray-900">
            {dashboardOptions.find(
              (opt) => opt.value === preferencesInfo.defaultDashboard,
            )?.label || "Beneficiary Dashboard"}
          </p>
        )}
      </div>

      {/* Language Preferences - Exact same implementation as PersonalInformation.jsx */}
      <div className="grid grid-cols-3 gap-8 mb-6">
        {/* Preference 1 - full list */}
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("FIRST_LANGUAGE_PREFERENCE")}
          </label>
          {isEditing ? (
            <Select
              value={languages.find(
                (option) =>
                  option.value === preferencesInfo.languagePreference1,
              )}
              options={languages}
              onChange={(selectedOption) =>
                handleInputChange(
                  "languagePreference1",
                  selectedOption?.value || "",
                )
              }
              className="w-full"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {preferencesInfo.languagePreference1 || ""}
            </p>
          )}
        </div>
        {/* Preference 2 - filter out languagePreference1 */}
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("SECOND_LANGUAGE_PREFERENCE")}
          </label>
          {isEditing ? (
            <Select
              value={languages.find(
                (option) =>
                  option.value === preferencesInfo.languagePreference2,
              )}
              options={languages.filter(
                (option) =>
                  option.value !== preferencesInfo.languagePreference1,
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "languagePreference2",
                  selectedOption?.value || "",
                )
              }
              className="w-full"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {preferencesInfo.languagePreference2 || ""}
            </p>
          )}
        </div>
        {/* Preference 3 - filter out languagePreference1 and languagePreference2 */}
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("THIRD_LANGUAGE_PREFERENCE")}
          </label>
          {isEditing ? (
            <Select
              value={languages.find(
                (option) =>
                  option.value === preferencesInfo.languagePreference3,
              )}
              options={languages.filter(
                (option) =>
                  option.value !== preferencesInfo.languagePreference1 &&
                  option.value !== preferencesInfo.languagePreference2,
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "languagePreference3",
                  selectedOption?.value || "",
                )
              }
              className="w-full"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {preferencesInfo.languagePreference3 || ""}
            </p>
          )}
        </div>
      </div>

      {/* Email Preferences */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {t("EMAIL COMMUNICATION PREFERENCE")}
        </label>
        <div className="space-y-2">
          {preferencesInfo.primaryEmailPreference && (
            <div className="flex items-center">
              <input
                type="radio"
                id="primary-email"
                name="emailPreference"
                value="primary"
                checked={preferencesInfo.selectedEmailPreference === "primary"}
                onChange={(e) =>
                  handleInputChange("selectedEmailPreference", e.target.value)
                }
                disabled={!isEditing}
                className="mr-2"
              />
              <label htmlFor="primary-email" className="text-sm">
                <span className="font-medium">Primary Email:</span>{" "}
                {preferencesInfo.primaryEmailPreference}
              </label>
            </div>
          )}
          {preferencesInfo.secondaryEmailPreference && (
            <div className="flex items-center">
              <input
                type="radio"
                id="secondary-email"
                name="emailPreference"
                value="secondary"
                checked={
                  preferencesInfo.selectedEmailPreference === "secondary"
                }
                onChange={(e) =>
                  handleInputChange("selectedEmailPreference", e.target.value)
                }
                disabled={!isEditing}
                className="mr-2"
              />
              <label htmlFor="secondary-email" className="text-sm">
                <span className="font-medium">Secondary Email:</span>{" "}
                {preferencesInfo.secondaryEmailPreference}
              </label>
            </div>
          )}
          {!preferencesInfo.primaryEmailPreference &&
            !preferencesInfo.secondaryEmailPreference && (
              <p className="text-gray-500 text-sm">
                No email addresses available. Please add email addresses in
                Personal Information.
              </p>
            )}
        </div>
      </div>

      {/* Phone Preferences */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {t("PHONE COMMUNICATION PREFERENCE")}
        </label>
        <div className="space-y-2">
          {preferencesInfo.primaryPhonePreference && (
            <div className="flex items-center">
              <input
                type="radio"
                id="primary-phone"
                name="phonePreference"
                value="primary"
                checked={preferencesInfo.selectedPhonePreference === "primary"}
                onChange={(e) =>
                  handleInputChange("selectedPhonePreference", e.target.value)
                }
                disabled={!isEditing}
                className="mr-2"
              />
              <label htmlFor="primary-phone" className="text-sm">
                <span className="font-medium">Primary Phone:</span>{" "}
                {preferencesInfo.primaryPhonePreference}
              </label>
            </div>
          )}
          {preferencesInfo.secondaryPhonePreference && (
            <div className="flex items-center">
              <input
                type="radio"
                id="secondary-phone"
                name="phonePreference"
                value="secondary"
                checked={
                  preferencesInfo.selectedPhonePreference === "secondary"
                }
                onChange={(e) =>
                  handleInputChange("selectedPhonePreference", e.target.value)
                }
                disabled={!isEditing}
                className="mr-2"
              />
              <label htmlFor="secondary-phone" className="text-sm">
                <span className="font-medium">Secondary Phone:</span>{" "}
                {preferencesInfo.secondaryPhonePreference}
              </label>
            </div>
          )}
          {!preferencesInfo.primaryPhonePreference &&
            !preferencesInfo.secondaryPhonePreference && (
              <p className="text-gray-500 text-sm">
                No phone numbers available. Please add phone numbers in Personal
                Information.
              </p>
            )}
        </div>
      </div>

      {/* Emergency Notifications */}
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="emergency-notifications"
            checked={preferencesInfo.receiveEmergencyNotifications}
            onChange={(e) =>
              handleInputChange(
                "receiveEmergencyNotifications",
                e.target.checked,
              )
            }
            disabled={!isEditing}
            className="mr-2"
          />
          <label
            htmlFor="emergency-notifications"
            className="text-sm font-bold"
          >
            {t("RECEIVE EMERGENCY NOTIFICATIONS")}
          </label>
        </div>
      </div>

      {/* Edit / Save Buttons */}
      <div className="flex justify-center mt-6">
        {!isEditing ? (
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleEditClick}
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
              {loading ? t("SAVING") || "Saving..." : t("SAVE")}
            </button>
            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={handleCancelClick}
              disabled={loading}
            >
              {t("CANCEL")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Preferences;
