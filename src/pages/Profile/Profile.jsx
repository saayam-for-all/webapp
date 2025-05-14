import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import YourProfile from "./YourProfile";
import PersonalInformation from "./PersonalInformation";
import ChangePassword from "./ChangePassword";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import OrganizationDetails from "./OrganizationDetails";
import Skills from "./Skills";
import axios from "axios";
import DEFAULT_PROFILE_ICON from "../../assets/Landingpage_images/ProfileImage.jpg";
import { useSelector } from "react-redux";
import { setUserId } from "../../redux/features/user/userSlice";
import { setProfileImgUrl } from "../../redux/features/user/profileImgSlice.js";
function Profile() {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(DEFAULT_PROFILE_ICON);
  const [tempProfilePhoto, setTempProfilePhoto] =
    useState(DEFAULT_PROFILE_ICON);
  const [activeTab, setActiveTab] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [tempProfileFileName, setTempProfileFileName] = useState("");
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.auth.idToken);
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
      setTempProfileFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo = e.target.result;
        setTempProfilePhoto(photo);
      };
      reader.readAsDataURL(file);
    }
  };
  const UserProfileImg = async function (profileImg) {
    const formData = new FormData();
    formData.append("ProfileRequest", JSON.stringify({}));
    formData.append("profileImg", profileImg); // 'file' should match backend @RequestParam name

    try {
      const response = await axios({
        method: "PUT",
        url: `http://localhost:8080/0.0.1/users/profile/${userId}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Ensure token is available in the scope
        },
      });
      if (response.status === 200) {
        return response.data; // Axios automatically parses the response as JSON
      } else {
        console.error("Failed to update profile Image", error.response.status);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error); // Log any errors that occur
    }
  };
  function base64ToFile(base64String, filename) {
    const arr = base64String.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  const handleSaveClick = async () => {
    const file = base64ToFile(
      tempProfilePhoto,
      tempProfileFileName || "default.jpg",
    );
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB. Please choose a smaller file.");
      return;
    }

    await UserProfileImg(file);
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
      case "password":
        return <ChangePassword setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "organization":
        return (
          <OrganizationDetails setHasUnsavedChanges={setHasUnsavedChanges} />
        );
      case "skills":
        return <Skills setHasUnsavedChanges={setHasUnsavedChanges} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      {/* ✅ Back Button */}
      <div className="w-full max-w-6xl mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
        >
          <span className="text-2xl mr-2">&lt;</span> Back to Home
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
