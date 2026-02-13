import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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
import {
  uploadProfileImage,
  deleteProfileImage,
  fetchProfileImage,
} from "../../services/volunteerServices";

const MAX_PROFILE_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png"];

function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation("profile");
  const location = useLocation();
  const userDbId = useSelector((state) => state.auth.user?.userDbId);

  const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PROFILE_ICON);
  const [tempProfilePhoto, setTempProfilePhoto] =
    useState(DEFAULT_PROFILE_ICON);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoLoadError, setPhotoLoadError] = useState(null);

  const profileImageObjectUrlRef = useRef(null);
  const pendingFileRef = useRef(null);
  const deleteRequestedRef = useRef(false);

  // When we have userDbId, fetch profile image from backend; otherwise fall back to localStorage
  useEffect(() => {
    if (userDbId) {
      let cancelled = false;
      setPhotoLoadError(null);
      fetchProfileImage(userDbId)
        .then((blob) => {
          if (cancelled) return;
          if (blob) {
            if (profileImageObjectUrlRef.current) {
              URL.revokeObjectURL(profileImageObjectUrlRef.current);
            }
            const url = URL.createObjectURL(blob);
            profileImageObjectUrlRef.current = url;
            setProfilePhoto(url);
            setTempProfilePhoto(url);
          } else {
            setProfilePhoto(DEFAULT_PROFILE_ICON);
            setTempProfilePhoto(DEFAULT_PROFILE_ICON);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setPhotoLoadError(
              err?.message ||
                t("PROFILE_PHOTO_LOAD_ERROR") ||
                "Failed to load profile photo.",
            );
            setProfilePhoto(DEFAULT_PROFILE_ICON);
            setTempProfilePhoto(DEFAULT_PROFILE_ICON);
          }
        });
      return () => {
        cancelled = true;
      };
    } else {
      const savedProfilePhoto = localStorage.getItem("profilePhoto");
      if (savedProfilePhoto) {
        setProfilePhoto(savedProfilePhoto);
        setTempProfilePhoto(savedProfilePhoto);
      }
    }
  }, [userDbId]);

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (profileImageObjectUrlRef.current) {
        URL.revokeObjectURL(profileImageObjectUrlRef.current);
        profileImageObjectUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const event = new CustomEvent("unsaved-changes", {
      detail: { hasUnsavedChanges },
    });
    window.dispatchEvent(event);
  }, [hasUnsavedChanges]);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    const input = event.target;
    if (!file) return;

    if (file.size > MAX_PROFILE_PHOTO_SIZE) {
      setUploadMessage({
        type: "error",
        text:
          t("PROFILE_PHOTO_ERROR_SIZE") || "File size must be 5 MB or less.",
      });
      input.value = "";
      return;
    }
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setUploadMessage({
        type: "error",
        text:
          t("PROFILE_PHOTO_ERROR_FORMAT") ||
          "Only JPG and PNG formats are accepted.",
      });
      input.value = "";
      return;
    }

    deleteRequestedRef.current = false;
    pendingFileRef.current = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      setTempProfilePhoto(e.target.result);
      setUploadMessage({
        type: "success",
        text:
          t("PROFILE_PHOTO_UPLOAD_SUCCESS") ||
          "Photo accepted. Click Save to confirm.",
      });
    };
    reader.readAsDataURL(file);
    input.value = "";
  };

  const handleSaveClick = async () => {
    if (userDbId && (pendingFileRef.current || deleteRequestedRef.current)) {
      setPhotoLoading(true);
      setPhotoLoadError(null);
      try {
        if (deleteRequestedRef.current) {
          await deleteProfileImage(userDbId);
          if (profileImageObjectUrlRef.current) {
            URL.revokeObjectURL(profileImageObjectUrlRef.current);
            profileImageObjectUrlRef.current = null;
          }
          setProfilePhoto(DEFAULT_PROFILE_ICON);
          setTempProfilePhoto(DEFAULT_PROFILE_ICON);
          localStorage.removeItem("profilePhoto");
        } else if (pendingFileRef.current) {
          await uploadProfileImage(userDbId, pendingFileRef.current);
          const blob = await fetchProfileImage(userDbId);
          if (blob) {
            if (profileImageObjectUrlRef.current) {
              URL.revokeObjectURL(profileImageObjectUrlRef.current);
            }
            const url = URL.createObjectURL(blob);
            profileImageObjectUrlRef.current = url;
            setProfilePhoto(url);
            setTempProfilePhoto(url);
          }
          localStorage.removeItem("profilePhoto");
        }
        window.dispatchEvent(new Event("profile-photo-updated"));
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          t("PROFILE_PHOTO_ERROR_UPLOAD") ||
          "Failed to update profile photo.";
        setUploadMessage({ type: "error", text: message });
        setPhotoLoading(false);
        return;
      }
      pendingFileRef.current = null;
      deleteRequestedRef.current = false;
      setPhotoLoading(false);
    } else {
      setProfilePhoto(tempProfilePhoto);
      localStorage.setItem("profilePhoto", tempProfilePhoto);
      window.dispatchEvent(new Event("profile-photo-updated"));
    }
    setUploadMessage(null);
    setIsModalOpen(false);
  };

  const handleCancelClick = () => {
    pendingFileRef.current = null;
    deleteRequestedRef.current = false;
    setTempProfilePhoto(profilePhoto);
    setUploadMessage(null);
    setIsModalOpen(false);
  };

  const handleDeleteClick = () => {
    deleteRequestedRef.current = true;
    pendingFileRef.current = null;
    setTempProfilePhoto(DEFAULT_PROFILE_ICON);
    setUploadMessage(null);
  };

  const getTabDisplayName = (tab) => {
    const tabNames = {
      profile: t("YOUR_PROFILE") || "Your Profile",
      personal: t("PERSONAL_INFORMATION") || "Personal Information",
      uploadDocument: t("IDENTITY_DOCUMENT") || "Identity Document",
      password: t("CHANGE_PASSWORD") || "Change Password",
      organization: t("ORGANIZATION_DETAILS") || "Organization Details",
      skills: t("SKILLS") || "Skills",
      availability: t("AVAILABILITY") || "Availability",
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
    setTempProfilePhoto(profilePhoto);
    pendingFileRef.current = null;
    deleteRequestedRef.current = false;
    if (hasUnsavedChanges) {
      const proceed = window.confirm(
        t("UNSAVED_PROFILE_CHANGES_WARNING") ||
          "You have unsaved changes in your profile. Do you want to proceed without saving?",
      );
      if (proceed) {
        setUploadMessage(null);
        setIsModalOpen(true);
        setHasUnsavedChanges(false);
      }
    } else {
      setUploadMessage(null);
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
          {photoLoadError && (
            <p className="text-red-600 text-xs px-2 pb-1" role="alert">
              {photoLoadError}
            </p>
          )}
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
          uploadMessage={uploadMessage}
          handlePhotoChange={handlePhotoChange}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
          handleDeleteClick={handleDeleteClick}
          isSaving={photoLoading}
        />
      )}
    </div>
  );
}

export default Profile;
