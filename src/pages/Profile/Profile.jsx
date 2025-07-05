import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import DEFAULT_PROFILE_ICON from "../../assets/Landingpage_images/ProfileImage.jpg";

function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PROFILE_ICON);
  const [tempProfilePhoto, setTempProfilePhoto] =
    useState(DEFAULT_PROFILE_ICON);
  const [activeTab, setActiveTab] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      {/* Back Button */}
      <div className="w-full max-w-6xl mb-4">
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
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center transition-colors duration-200"
        >
          <span className="text-2xl mr-2">&larr;</span>{" "}
          {t("BACK_TO_HOME") || "Back to Home"}
        </button>
      </div>

      {/* Main Profile Layout */}
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg">
        <Sidebar
          profilePhoto={profilePhoto}
          handleTabChange={handleTabChange}
          activeTab={activeTab}
          openModal={openModal}
        />
        <div className="w-3/4 p-6">{renderTabContent()}</div>
      </div>

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
