import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { updatePassword } from "aws-amplify/auth";
import LoadingIndicator from "../../common/components/Loading/Loading";

function ChangePassword({ setHasUnsavedChanges }) {
  const { t } = useTranslation();
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
    <div className="flex flex-col border p-6 rounded-lg w-full">
      <>
        <div className="mb-6">
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("CURRENT_PASSWORD")}
          </label>
          <div className="relative">
            <input
              ref={currentPasswordRef}
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("NEW_PASSWORD")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`appearance-none block w-full bg-white-200 text-gray-700 border ${
                errorMessage ? "border-red-500" : "border-gray-200"
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
          )}
          <p className="text-xs text-gray-500">{t("PASSWORD_REQUIREMENTS")}</p>
        </div>
        <div className="mb-6">
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("CONFIRM_PASSWORD")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`appearance-none block w-full bg-white-200 text-gray-700 border ${
                passwordMatchError ? "border-red-500" : "border-gray-200"
              } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </div>
          {passwordMatchError && (
            <p className="text-red-500 text-xs mt-1">{passwordMatchError}</p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            disabled={loading}
            className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600 flex items-center justify-center"
            onClick={handleSaveClick}
          >
            <span className={loading ? "mr-2" : ""}>{t("SAVE")}</span>
            {loading && <LoadingIndicator size="24px" />}
          </button>
          <button
            disabled={loading}
            className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={handleCancelClick}
          >
            {t("CANCEL")}
          </button>
        </div>
      </>
    </div>
  );
}

export default ChangePassword;