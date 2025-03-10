import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import CountryList from "react-select-country-list";
import { FiPhoneCall, FiVideo } from "react-icons/fi";
import CallModal from "./CallModal.jsx";

function YourProfile({ setHasUnsavedChanges }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState("audio");
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

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (firstNameRef.current) firstNameRef.current.focus();
    }, 0);
  };

  const handleCallIconClick = (type) => {
    setCallType(type);
    setIsCallModalOpen(true);
  };

  return (
    <div className="flex flex-col border p-6 rounded-lg w-full">
      {/* First Name and Last Name */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 text-xs font-bold mb-2">
            {t("FIRST_NAME")}
          </label>
          {isEditing ? (
            <input
              ref={firstNameRef}
              type="text"
              value={profileInfo.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 focus:outline-none"
            />
          ) : (
            <p className="text-lg text-gray-900">{profileInfo.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-xs font-bold mb-2">
            {t("LAST_NAME")}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={profileInfo.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 focus:outline-none"
            />
          ) : (
            <p className="text-lg text-gray-900">{profileInfo.lastName}</p>
          )}
        </div>
      </div>

      {/* Email (Non-Editable) */}
      <div className="mb-6">
        <label className="block text-gray-700 text-xs font-bold mb-2">
          {t("EMAIL")}
        </label>
        <p className="text-lg text-gray-900">{profileInfo.email}</p>
      </div>

      {/* Phone Number */}
      <div className="mb-6">
        <label className="block text-gray-700 text-xs font-bold mb-2">
          {t("PHONE_NUMBER")}
        </label>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <input
              type="text"
              value={profileInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 focus:outline-none"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {profileInfo.phoneCountryCode} {profileInfo.phone}
            </p>
          )}
          <FiPhoneCall
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => handleCallIconClick("audio")}
          />
          <FiVideo
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => handleCallIconClick("video")}
          />
        </div>
      </div>

      {/* Country */}
      <div className="mb-6">
        <label className="block text-gray-700 text-xs font-bold mb-2">
          {t("COUNTRY")}
        </label>
        {isEditing ? (
          <input
            type="text"
            value={profileInfo.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 focus:outline-none"
          />
        ) : (
          <p className="text-lg text-gray-900">{profileInfo.country}</p>
        )}
      </div>

      {/* Edit Button */}
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
              onClick={() => {
                setIsEditing(false);
                setHasUnsavedChanges(false);
              }}
            >
              {t("SAVE")}
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
