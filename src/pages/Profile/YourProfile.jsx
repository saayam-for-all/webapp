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
    firstName: user?.given_name || "",
    lastName: user?.family_name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    phoneCountryCode: "US",
    country: user?.zoneinfo || "",
  });

  useEffect(() => {
    if (user) {
      setProfileInfo({
        firstName: user.given_name || "",
        lastName: user.family_name || "",
        email: user.email || "",
        phone: user.phone_number || "",
        phoneCountryCode: "US",
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

      // Prepare updated attributes for Cognito
      const updatedAttributes = {
        given_name: profileInfo.firstName,
        family_name: profileInfo.lastName,
        email: profileInfo.email,
        phone_number: profileInfo.phone,
        "custom:Country": profileInfo.country,
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
      {/* First Name and Last Name */}
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
                className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
                required
                maxLength={50}
              />
              {profileInfo.firstName.length < 1 && (
                <p className="text-red-500 text-xs mt-1">
                  Please fill in the first name field.
                </p>
              )}
            </div>
          ) : (
            <>
              <p className="text-lg text-gray-900">{profileInfo.firstName}</p>
              {profileInfo.firstName.length < 1 && (
                <p className="text-red-500 text-xs mt-1">
                  Please fill in the first name field.
                </p>
              )}
            </>
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
                className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
                required
                maxLength={20}
              />
              {profileInfo.lastName.length < 1 && (
                <p className="text-red-500 text-xs mt-1">
                  Please fill in the last name field.
                </p>
              )}
            </div>
          ) : (
            <>
              <p className="text-lg text-gray-900">{profileInfo.lastName}</p>
              {profileInfo.lastName.length < 1 && (
                <p className="text-red-500 text-xs mt-1">
                  Please fill in the last name field.
                </p>
              )}
            </>
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
              className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
              required
              maxLength={50}
            />
            {profileInfo.email.length < 1 && (
              <p className="text-red-500 text-xs mt-1">
                Please fill in the email field.
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-lg text-gray-900">{profileInfo.email}</p>
            {profileInfo.email.length < 1 && (
              <p className="text-red-500 text-xs mt-1">
                Please fill in the email field.
              </p>
            )}
          </>
        )}
      </div>

      {/* Phone Number */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {t("PHONE_NUMBER")}
        </label>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <div>
              <input
                type="text"
                value={profileInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
                required
                maxLength={12}
              />
              {profileInfo.phone.length < 1 && (
                <p className="text-red-500 text-xs mt-1">
                  Please fill in the phone number field.
                </p>
              )}
            </div>
          ) : (
            <>
              <p className="text-lg text-gray-900">
                {profileInfo.phoneCountryCode} {profileInfo.phone}
              </p>
              {profileInfo.phone.length < 1 && (
                <p className="text-red-500 text-xs mt-1">
                  Please fill in the phone number field.
                </p>
              )}
            </>
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

      {/* Country */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {t("COUNTRY")}
        </label>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={profileInfo.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
            />
            {profileInfo.country.length < 1 && (
              <p className="text-red-500 text-xs mt-1">
                Please fill in the country field.
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-lg text-gray-900">{profileInfo.country}</p>
            {profileInfo.country.length < 1 && (
              <p className="text-red-500 text-xs mt-1">
                Please fill in the country field.
              </p>
            )}
          </>
        )}
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

export default YourProfile;
