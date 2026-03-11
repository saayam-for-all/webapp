import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { updatePassword } from "aws-amplify/auth";
import LoadingIndicator from "../../common/components/Loading/Loading";

function ChangePassword({ setHasUnsavedChanges }) {
  const { t } = useTranslation("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const currentPasswordRef = useRef(null);

  const handleSaveClick = async () => {
    let valid = true;
    setErrorMessage("");
    setPasswordMatchError("");

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setErrorMessage(t("PASSWORD_REQUIREMENTS_ERROR"));
      valid = false;
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMatchError(t("PASSWORD_MISMATCH_ERROR"));
      valid = false;
      return;
    }

    if (valid) {
      setLoading(true);
      try {
        await updatePassword({
          oldPassword: currentPassword,
          newPassword,
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        alert(t("PASSWORD_CHANGE_SUCCESS"));
      } catch (error) {
        alert(error.message);
      } finally {
        setIsEditing(false);
        setHasUnsavedChanges(false);
        setLoading(false);
      }
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setErrorMessage("");
    setPasswordMatchError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setHasUnsavedChanges(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t("CHANGE_PASSWORD") || "Change Password"}
        </h2>
        <p className="text-gray-500 text-sm">
          {t("CHANGE_PASSWORD_DESCRIPTION") ||
            "Update your password to keep your account secure"}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/* Current Password */}
        <div className="mb-6 space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <span className="text-red-500 mr-1">*</span>
            {t("CURRENT_PASSWORD")}
          </label>
          <div className="relative">
            <input
              ref={currentPasswordRef}
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              placeholder={
                t("ENTER_CURRENT_PASSWORD") || "Enter current password"
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="mb-6 space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <span className="text-red-500 mr-1">*</span>
            {t("NEW_PASSWORD")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full bg-gray-50 text-gray-700 border rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errorMessage
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                  : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
              placeholder={t("ENTER_NEW_PASSWORD") || "Enter new password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          {errorMessage && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
              {errorMessage}
            </p>
          )}
          <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
            {t("PASSWORD_REQUIREMENTS")}
          </p>
        </div>

        {/* Confirm Password */}
        <div className="mb-6 space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <span className="text-red-500 mr-1">*</span>
            {t("CONFIRM_PASSWORD")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-gray-50 text-gray-700 border rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 transition-all duration-200 ${
                passwordMatchError
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                  : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
              placeholder={t("CONFIRM_NEW_PASSWORD") || "Confirm new password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          {passwordMatchError && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
              {passwordMatchError}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            disabled={loading}
            className="inline-flex items-center gap-2 py-2.5 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
            onClick={handleCancelClick}
          >
            {t("CANCEL")}
          </button>
          <button
            disabled={loading}
            className="inline-flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            onClick={handleSaveClick}
          >
            {loading ? (
              <>
                <LoadingIndicator size="20px" />
                {t("SAVING") || "Saving..."}
              </>
            ) : (
              t("SAVE")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
