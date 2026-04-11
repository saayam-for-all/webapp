import React from "react";
import { useTranslation } from "react-i18next";
import { FaCamera, FaSave, FaTimes, FaTrashAlt } from "react-icons/fa";

function Modal({
  profilePhoto,
  uploadMessage,
  handlePhotoChange,
  handleSaveClick,
  handleCancelClick,
  handleDeleteClick,
  isSaving = false,
}) {
  const { t } = useTranslation("profile");

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
        <h3 className="text-lg font-bold mb-4 text-center">
          {t("PROFILE_PHOTO") || "Profile Photo"}
        </h3>

        <div className="relative mb-4 flex justify-center">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={t("PROFILE_IMAGE_ALT") || "Profile"}
              className="rounded-full w-32 h-32 object-cover"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              {t("NO_PHOTO") || "No Photo"}
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4 mb-2">
          <label className="flex flex-col items-center cursor-pointer">
            <FaCamera className="text-2xl text-gray-600" />
            <span className="text-blue-600">{t("UPLOAD") || "Upload"}</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>

          <button
            onClick={handleDeleteClick}
            className="flex flex-col items-center text-red-500"
          >
            <FaTrashAlt className="text-2xl" />
            <span>{t("DELETE") || "Delete"}</span>
          </button>
        </div>

        {uploadMessage && (
          <div
            role="alert"
            className={`mb-4 px-3 py-2 rounded-md text-sm ${
              uploadMessage.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {uploadMessage.text}
          </div>
        )}

        <div className="flex justify-center space-x-6 mt-4">
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            <span>
              {isSaving ? t("SAVING") || "Saving..." : t("SAVE") || "Save"}
            </span>
          </button>
          <button
            onClick={handleCancelClick}
            className="flex items-center space-x-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            <FaTimes />
            <span>{t("CANCEL") || "Cancel"}</span>
          </button>
        </div>

        <div
          className="absolute top-2 right-2 cursor-pointer text-gray-600"
          onClick={handleCancelClick}
        >
          &times;
        </div>
      </div>
    </div>
  );
}

export default Modal;
