import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaUserCircle,
  FaLock,
  FaTags,
  FaClock,
  FaCog,
  FaSignOutAlt,
  FaIdCard,
  FaBuilding,
  FaUser,
  FaClipboardList,
} from "react-icons/fa";
import { FiChevronRight, FiEdit2 } from "react-icons/fi";

// Tab configuration with unique icons and colors
const tabConfig = {
  profile: {
    icon: FaUser,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
  },
  personal: {
    icon: FaUserCircle,
    color: "indigo",
    gradient: "from-indigo-500 to-indigo-600",
  },
  uploadDocument: {
    icon: FaIdCard,
    color: "purple",
    gradient: "from-purple-500 to-purple-600",
  },
  password: {
    icon: FaLock,
    color: "amber",
    gradient: "from-amber-500 to-amber-600",
  },
  organization: {
    icon: FaBuilding,
    color: "teal",
    gradient: "from-teal-500 to-teal-600",
  },
  skills: {
    icon: FaTags,
    color: "emerald",
    gradient: "from-emerald-500 to-emerald-600",
  },
  availability: {
    icon: FaClock,
    color: "cyan",
    gradient: "from-cyan-500 to-cyan-600",
  },
  preferences: {
    icon: FaCog,
    color: "slate",
    gradient: "from-slate-500 to-slate-600",
  },
  timesheets: {
    icon: FaClipboardList,
    color: "orange",
    gradient: "from-orange-500 to-orange-600",
  },
  signoff: {
    icon: FaSignOutAlt,
    color: "rose",
    gradient: "from-rose-500 to-rose-600",
  },
};

function Sidebar({
  profilePhoto,
  userName,
  userEmail,
  handleTabChange,
  activeTab,
  openModal,
}) {
  const { t } = useTranslation("profile");

  const renderTab = (tabKey, labelKey) => {
    const config = tabConfig[tabKey];
    const Icon = config.icon;
    const isActive = activeTab === tabKey;

    return (
      <button
        key={tabKey}
        className={`group flex items-center justify-between py-3 px-4 w-full text-left rounded-lg transition-all duration-200 ${
          isActive
            ? `bg-gradient-to-r ${config.gradient} text-white shadow-md`
            : "hover:bg-gray-50 text-gray-700 hover:translate-x-1"
        }`}
        onClick={() => handleTabChange(tabKey)}
      >
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ${
              isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive
                  ? "text-white"
                  : "text-gray-500 group-hover:text-gray-700"
              }`}
            />
          </div>
          <span className={`font-medium ${isActive ? "text-white" : ""}`}>
            {t(labelKey)}
          </span>
        </div>
        {!isActive && (
          <FiChevronRight className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white w-72">
      {/* Profile Header with Gradient Background */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 rounded-br-3xl">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative text-center">
          <div className="relative inline-block mb-4">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="rounded-full w-24 h-24 object-cover mx-auto cursor-pointer ring-4 ring-white/30 shadow-xl hover:ring-white/50 transition-all duration-300"
                onClick={openModal}
              />
            ) : (
              <div
                className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto cursor-pointer ring-4 ring-white/30 hover:ring-white/50 transition-all duration-300"
                onClick={openModal}
              >
                <span className="text-white/80 text-xs text-center px-2">
                  {t("UPLOAD_PHOTO")}
                </span>
              </div>
            )}
            <button
              className="absolute bottom-0 right-0 bg-white shadow-lg rounded-full p-2 cursor-pointer hover:bg-gray-50 hover:scale-110 transition-all duration-200"
              onClick={openModal}
            >
              <FiEdit2 className="text-blue-600 w-4 h-4" />
            </button>
          </div>
          <h3 className="font-bold text-lg text-white truncate">{userName}</h3>
          <p className="text-blue-100 text-sm truncate opacity-90">
            {userEmail}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          {t("ACCOUNT_SETTINGS")}
        </p>
        <nav className="space-y-1">
          {renderTab("profile", "YOUR_PROFILE")}
          {renderTab("personal", "PERSONAL_INFORMATION")}
          {renderTab("uploadDocument", "IDENTITY_DOCUMENT")}
          {renderTab("password", "CHANGE_PASSWORD")}
          {renderTab("organization", "ORGANIZATION_DETAILS")}
        </nav>

        <div className="my-4 border-t border-gray-100" />

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          {t("VOLUNTEER_SETTINGS")}
        </p>
        <nav className="space-y-1">
          {renderTab("skills", "SKILLS")}
          {renderTab("availability", "AVAILABILITY")}
          {renderTab("preferences", "PREFERENCES")}
          {renderTab("timesheets", "TIMESHEETS")}
        </nav>

        <div className="my-4 border-t border-gray-100" />

        <nav className="space-y-1">{renderTab("signoff", "SIGN_OFF")}</nav>
      </div>
    </div>
  );
}

export default Sidebar;
