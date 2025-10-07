import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";
import YourProfile from "./YourProfile";
import PersonalInformation from "./PersonalInformation";
import IdentityDocument from "./IdentityDocument";
import ChangePassword from "./ChangePassword";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import OrganizationDetails from "./OrganizationDetails";
import Skills from "./Skills";
import Availability from "./Availability";
import Preferences from "./Preferences";
import SignOff from "./SignOff";
import DEFAULT_PROFILE_ICON from "../../assets/Landingpage_images/ProfileImage.jpg";

function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PROFILE_ICON);
  const [tempProfilePhoto, setTempProfilePhoto] =
    useState(DEFAULT_PROFILE_ICON);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedProfilePhoto = localStorage.getItem("profilePhoto");
    if (savedProfilePhoto) {
      setProfilePhoto(savedProfilePhoto);
      setTempProfilePhoto(savedProfilePhoto);
    }
  }, []);

  useEffect(() => {
    const event = new CustomEvent("unsaved-changes", {
      detail: { hasUnsavedChanges },
    });
    window.dispatchEvent(event);
  }, [hasUnsavedChanges]);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo = e.target.result;
        setTempProfilePhoto(photo);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = () => {
    setProfilePhoto(tempProfilePhoto);
    localStorage.setItem("profilePhoto", tempProfilePhoto);
    window.dispatchEvent(new Event("profile-photo-updated"));
    setIsModalOpen(false);
  };

  const handleCancelClick = () => {
    setTempProfilePhoto(profilePhoto);
    setIsModalOpen(false);
  };

  const handleDeleteClick = () => {
    setTempProfilePhoto(DEFAULT_PROFILE_ICON);
  };

  const getTabDisplayName = (tab) => {
    const tabNames = {
      profile: t("YOUR_PROFILE") || "Your Profile",
      personal: t("PERSONAL_INFORMATION") || "Personal Information",
      uploadDocument: t("IDENTITY_DOCUMENT") || "Identity Document",
      password: t("CHANGE_PASSWORD") || "Change Password",
      organization: t("ORGANIZATION_DETAILS") || "Organization Details",
      skills: t("SKILLS") || "Skills",
      availability: t("Availability") || "Availability",
      preferences: t("PREFERENCES") || "Preferences",
      signoff: t("SIGN_OFF") || "Sign Off",
    };
    return tabNames[tab] || "Profile Menu";
  };

  const handleTabChange = (tab) => {
    if (hasUnsavedChanges) {
      const proceed = window.confirm(
        t("UNSAVED_CHANGES_WARNING") ||
          "You have unsaved changes. Do you want to proceed without saving?",
      );
      if (proceed) {
        setActiveTab(tab);
        setHasUnsavedChanges(false);
      }
    } else {
      setActiveTab(tab);
    }
  };

  const openModal = () => {
    if (hasUnsavedChanges) {
      const proceed = window.confirm(
        t("UNSAVED_PROFILE_CHANGES_WARNING") ||
          "You have unsaved changes in your profile. Do you want to proceed without saving?",
      );
      if (proceed) {
        setIsModalOpen(true);
        setHasUnsavedChanges(false);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <YourProfile setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "personal":
        return (
          <PersonalInformation setHasUnsavedChanges={setHasUnsavedChanges} />
        );
      case "uploadDocument":
        return <IdentityDocument setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "password":
        return <ChangePassword setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "organization":
        return (
          <OrganizationDetails setHasUnsavedChanges={setHasUnsavedChanges} />
        );
      case "skills":
        return <Skills setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "availability":
        return <Availability setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "preferences":
        return <Preferences setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "signoff":
        return <SignOff setHasUnsavedChanges={setHasUnsavedChanges} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col p-2 md:p-4 min-h-screen bg-gray-100">
      {/* Back Button */}
      <div className="w-full mb-4">
        <button
          onClick={() => {
            if (hasUnsavedChanges) {
              const proceed = window.confirm(
                t("UNSAVED_CHANGES_WARNING") ||
                  "You have unsaved changes. Do you want to proceed without saving?",
              );
              if (proceed) {
                navigate("/dashboard");
              }
            } else {
              navigate("/dashboard");
            }
          }}
          className="text-blue-600 hover:text-blue-800 font-semibold text-base md:text-lg flex items-center transition-colors duration-200"
        >
          <span className="text-xl md:text-2xl mr-2">&larr;</span>{" "}
          {t("BACK_TO_DASHBOARD") || "Back to Dashboard"}
        </button>
      </div>

      {/* Dropdown Menu Button - Only visible on mobile */}
      <div className="w-full mb-4 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          aria-label="Open profile menu"
        >
          <FaBars className="text-lg" />
          <span className="font-medium">{getTabDisplayName(activeTab)}</span>
        </button>
      </div>

      {/* Main Profile Layout */}
      <div className="flex flex-col md:flex-row w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            profilePhoto={profilePhoto}
            handleTabChange={handleTabChange}
            activeTab={activeTab}
            openModal={openModal}
          />
        </div>

        {/* Content Area */}
        <div className="w-full md:w-3/4 p-3 md:p-6">{renderTabContent()}</div>
      </div>

      {/* Mobile Sliding Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sliding Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-800">
                {t("YOUR_PROFILE") || "Profile Menu"}
              </h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors duration-200"
                aria-label="Close profile menu"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="h-full overflow-y-auto">
              <Sidebar
                profilePhoto={profilePhoto}
                handleTabChange={(tab) => {
                  handleTabChange(tab);
                  setIsSidebarOpen(false);
                }}
                activeTab={activeTab}
                openModal={() => {
                  setIsSidebarOpen(false);
                  openModal();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Profile Photo */}
      {isModalOpen && (
        <Modal
          profilePhoto={tempProfilePhoto}
          handlePhotoChange={handlePhotoChange}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
          handleDeleteClick={handleDeleteClick}
        />
      )}
    </div>
  );
}

export default Profile;
