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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h3 className="text-lg font-bold text-white text-center">
            {t("PROFILE_PHOTO") || "Profile Photo"}
          </h3>
          <button
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
            onClick={handleCancelClick}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Photo Preview */}
          <div className="relative mb-6 flex justify-center">
            <div className="relative">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={t("PROFILE_IMAGE_ALT") || "Profile"}
                  className="rounded-full w-36 h-36 object-cover ring-4 ring-gray-100 shadow-lg"
                />
              ) : (
                <div className="w-36 h-36 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center ring-4 ring-gray-100">
                  <span className="text-gray-400 text-sm">
                    {t("NO_PHOTO") || "No Photo"}
                  </span>
                </div>
              )}
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full ring-2 ring-blue-500/20 ring-offset-4" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mb-4">
            <label className="group flex flex-col items-center cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-200">
                <FaCamera className="text-xl text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600 mt-2 group-hover:text-blue-600 transition-colors">
                {t("UPLOAD") || "Upload"}
              </span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>

            <button
              onClick={handleDeleteClick}
              className="group flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 group-hover:scale-105 transition-all duration-200">
                <FaTrashAlt className="text-xl text-red-500" />
              </div>
              <span className="text-sm font-medium text-gray-600 mt-2 group-hover:text-red-500 transition-colors">
                {t("DELETE") || "Delete"}
              </span>
            </button>
          </div>

          {/* Upload Message */}
          {uploadMessage && (
            <div
              role="alert"
              className={`mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
                uploadMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  uploadMessage.type === "success"
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />
              {uploadMessage.text}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCancelClick}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
            >
              <FaTimes className="w-4 h-4" />
              <span>{t("CANCEL") || "Cancel"}</span>
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
            >
              <FaSave className="w-4 h-4" />
              <span>
                {isSaving ? t("SAVING") || "Saving..." : t("SAVE") || "Save"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
