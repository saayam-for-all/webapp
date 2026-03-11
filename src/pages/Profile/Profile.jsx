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

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert blob to data URL"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });

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

  // When we have userDbId, fetch profile image from backend; otherwise fall back to localStorage
  useEffect(() => {
    if (userDbId) {
      let cancelled = false;
      const savedProfilePhoto = localStorage.getItem("profilePhoto");
      if (savedProfilePhoto) {
        setProfilePhoto(savedProfilePhoto);
        setTempProfilePhoto(savedProfilePhoto);
      }
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
            blobToDataUrl(blob)
              .then((dataUrl) => {
                localStorage.setItem("profilePhoto", dataUrl);
              })
              .catch(() => {});
          } else {
            setProfilePhoto(DEFAULT_PROFILE_ICON);
            setTempProfilePhoto(DEFAULT_PROFILE_ICON);
            localStorage.removeItem("profilePhoto");
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
            localStorage.removeItem("profilePhoto");
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
    if (userDbId && pendingFileRef.current) {
      setPhotoLoading(true);
      setPhotoLoadError(null);
      try {
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
          const dataUrl = await blobToDataUrl(blob);
          localStorage.setItem("profilePhoto", dataUrl);
        } else {
          setProfilePhoto(DEFAULT_PROFILE_ICON);
          setTempProfilePhoto(DEFAULT_PROFILE_ICON);
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
    setTempProfilePhoto(profilePhoto);
    setUploadMessage(null);
    setIsModalOpen(false);
  };

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the picture?",
    );
    if (!confirmed) return;

    if (userDbId) {
      setPhotoLoading(true);
      setPhotoLoadError(null);
      try {
        await deleteProfileImage(userDbId);
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
      setPhotoLoading(false);
    }

    if (profileImageObjectUrlRef.current) {
      URL.revokeObjectURL(profileImageObjectUrlRef.current);
      profileImageObjectUrlRef.current = null;
    }
    pendingFileRef.current = null;
    setProfilePhoto(DEFAULT_PROFILE_ICON);
    setTempProfilePhoto(DEFAULT_PROFILE_ICON);
    localStorage.removeItem("profilePhoto");
    window.dispatchEvent(new Event("profile-photo-updated"));
    setUploadMessage(null);
    setIsModalOpen(false);
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
    <div className="flex flex-col p-3 md:p-6 min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-30 blur-3xl" />
      </div>

      {/* Back Button */}
      <div className="relative w-full mb-4">
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
          className="group inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium text-base transition-all duration-200"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm group-hover:shadow-md group-hover:bg-blue-50 transition-all duration-200">
            <span className="text-lg">&larr;</span>
          </span>
          <span>{t("BACK_TO_DASHBOARD") || "Back to Dashboard"}</span>
        </button>
      </div>

      {/* Dropdown Menu Button - Only visible on mobile */}
      <div className="relative w-full mb-4 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200"
          aria-label="Open profile menu"
        >
          <FaBars className="text-lg text-blue-600" />
          <span className="font-medium">{getTabDisplayName(activeTab)}</span>
        </button>
      </div>

      {/* Main Profile Layout */}
      <div className="relative flex flex-col md:flex-row w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        {/* Desktop Sidebar */}
        <div className="hidden md:block border-r border-gray-100">
          {photoLoadError && (
            <p
              className="text-red-600 text-xs px-4 py-2 bg-red-50"
              role="alert"
            >
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
        <div className="flex-1 w-full md:w-3/4 p-4 md:p-8 bg-gradient-to-br from-white to-gray-50/50">
          {renderTabContent()}
        </div>
      </div>

      {/* Mobile Sliding Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sliding Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-2xl transform transition-transform duration-300 ease-out rounded-r-2xl">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-700">
              <h2 className="font-semibold text-white">
                {t("YOUR_PROFILE") || "Profile Menu"}
              </h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                aria-label="Close profile menu"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="h-full overflow-y-auto pb-20">
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
