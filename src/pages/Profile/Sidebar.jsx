import React from "react";
import { useTranslation } from "react-i18next";
import { FaUserCircle, FaLock, FaTags, FaClock, FaCog } from "react-icons/fa";
// REMOVED: FaCalendarAlt for preferences
import { FiChevronRight } from "react-icons/fi";
import { FiEdit2 } from "react-icons/fi";

function Sidebar({
  profilePhoto,
  userName,
  userEmail,
  handleTabChange,
  activeTab,
  openModal,
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-between h-full p-4 bg-white w-60 border-r">
      <div className="text-center mb-8">
        <div className="relative mb-4">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="rounded-full w-24 h-24 object-cover mx-auto cursor-pointer border-2 border-dashed border-gray-300"
              onClick={openModal}
            />
          ) : (
            <div
              className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto cursor-pointer border-2 border-dashed border-gray-300"
              onClick={openModal}
            >
              <span className="text-gray-600">{t("UPLOAD_PHOTO")}</span>
            </div>
          )}
          <div
            className="absolute bottom-2 right-2 bg-white border rounded-full p-1 cursor-pointer"
            onClick={openModal}
          >
            <FiEdit2 className="text-gray-600 w-4 h-4" />
          </div>
        </div>
        <h3 className="font-semibold text-lg">{userName}</h3>
        <p className="text-gray-500 text-sm">{userEmail}</p>
      </div>

      {/* Sidebar Tabs */}
      <div className="space-y-1">
        <button
          className={`flex items-center justify-between py-3 px-4 w-full text-left ${
            activeTab === "profile"
              ? "font-semibold text-blue-500 border-b-2 border-blue-500"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleTabChange("profile")}
        >
          <div className="flex items-center">
            <FaUserCircle className="mr-2 text-gray-500" />
            {t("YOUR_PROFILE")}
          </div>
          {activeTab !== "profile" && (
            <FiChevronRight className="text-gray-600" />
          )}
        </button>

        <button
          className={`flex items-center justify-between py-3 px-4 w-full text-left ${
            activeTab === "personal"
              ? "font-semibold text-blue-500 border-b-2 border-blue-500"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleTabChange("personal")}
        >
          <div className="flex items-center">
            <FaUserCircle className="mr-2 text-gray-500" />
            {t("PERSONAL_INFORMATION")}
          </div>
          {activeTab !== "personal" && (
            <FiChevronRight className="text-gray-600" />
          )}
        </button>

        <button
          className={`flex items-center justify-between py-3 px-4 w-full text-left ${
            activeTab === "uploadDocument"
              ? "font-semibold text-blue-500 border-b-2 border-blue-500"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleTabChange("uploadDocument")}
        >
          <div className="flex items-center">
            <FaUserCircle className="mr-2 text-gray-500" />
            {t("IDENTITY_DOCUMENT")}
          </div>
          {activeTab !== "uploadDocument" && (
            <FiChevronRight className="text-gray-600" />
          )}
        </button>

        <button
          className={`flex items-center justify-between py-3 px-4 w-full text-left ${
            activeTab === "password"
              ? "font-semibold text-blue-500 border-b-2 border-blue-500"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleTabChange("password")}
        >
          <div className="flex items-center">
            <FaLock className="mr-2 text-gray-500" />
            {t("CHANGE_PASSWORD")}
          </div>
          {activeTab !== "password" && (
            <FiChevronRight className="text-gray-600" />
          )}
        </button>

        <button
          className={`flex items-center justify-between py-3 px-4 w-full text-left ${
            activeTab === "organization"
              ? "font-semibold text-blue-500 border-b-2 border-blue-500"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleTabChange("organization")}
        >
          <div className="flex items-center">
            <FaUserCircle className="mr-2 text-gray-500" />
            {t("ORGANIZATION_DETAILS")}
          </div>
          {activeTab !== "organization" && (
            <FiChevronRight className="text-gray-600" />
          )}
        </button>

        {/* Skills Tab */}
        <button
          className={`flex items-center justify-between py-3 px-4 w-full text-left ${
            activeTab === "skills"
              ? "font-semibold text-blue-500 border-b-2 border-blue-500"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleTabChange("skills")}
        >
          <div className="flex items-center">
            <FaTags className="mr-2 text-gray-500" />
            {t("SKILLS")}
          </div>
          {activeTab !== "skills" && (
            <FiChevronRight className="text-gray-600" />
          )}
        </button>

        {/* Availability Tab */}
        <button
          className={`flex items-center justify-between py-3 px-4 w-full text-left ${
            activeTab === "availability"
              ? "font-semibold text-blue-500 border-b-2 border-blue-500"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleTabChange("availability")}
        >
          <div className="flex items-center">
            <FaClock className="mr-2 text-gray-500" />
            {t("Availability")}
          </div>
          {activeTab !== "availability" && (
            <FiChevronRight className="text-gray-600" />
          )}
        </button>

        {/* Preferences Tab */}
        <button
          className={`flex items-center justify-between py-3 px-4 w-full text-left ${
            activeTab === "preferences"
              ? "font-semibold text-blue-500 border-b-2 border-blue-500"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleTabChange("preferences")}
        >
          <div className="flex items-center">
            <FaCog className="mr-2 text-gray-500" />
            {t("Preferences")}
          </div>
          {activeTab !== "preferences" && (
            <FiChevronRight className="text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
