import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { deleteUser } from "aws-amplify/auth";
import { signOffUser, getUserId } from "../../services/volunteerServices";

function SignOff({ setHasUnsavedChanges }) {
  const { t } = useTranslation("profile");
  const userDbId = useSelector((state) => state.auth.user?.userDbId);
  const userEmail = useSelector((state) => state.auth.user?.email);
  const [isDeleteChecked, setIsDeleteChecked] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reasonForLeaving, setReasonForLeaving] = useState("");

  const handleCheckboxChange = (e) => {
    setIsDeleteChecked(e.target.checked);
    setHasUnsavedChanges(e.target.checked);
  };

  const handleReasonChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setReasonForLeaving(value);
      setHasUnsavedChanges(true);
    }
  };

  const handleSubmit = () => {
    if (isDeleteChecked) {
      setShowConfirmationModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Step 1: Get userDbId - try Redux first, then localStorage, then API
      let userId = userDbId;
      let userExistsInDb = true;

      // Try localStorage if Redux doesn't have it
      if (!userId) {
        userId = localStorage.getItem("userDbId");
        if (userId) {
          console.log("Got user ID from localStorage:", userId);
        }
      }

      // If still not found, try to fetch via API
      if (!userId) {
        if (!userEmail) {
          throw new Error(
            "User information not found. Please try logging in again.",
          );
        }
        console.log("Fetching user ID from database using email...");
        try {
          const userIdResponse = await getUserId(userEmail);
          userId = userIdResponse?.data?.id;
        } catch (fetchError) {
          // User not found in database - this is okay, we'll skip DB deletion
          console.log(
            "User not found in database, will skip DB deletion:",
            fetchError.message,
          );
          userExistsInDb = false;
        }
      }

      // Step 2: Delete user from database (if they exist)
      if (userExistsInDb && userId) {
        console.log("Deleting user from database...", userId);
        const dbResponse = await signOffUser(userId, reasonForLeaving);
        console.log("Database deletion response:", dbResponse);

        if (!dbResponse.success) {
          throw new Error(
            dbResponse.message || "Failed to delete user from database.",
          );
        }
      } else {
        console.log("Skipping database deletion - user not found in database");
      }

      // Step 3: Delete user from AWS Cognito
      console.log("Deleting user from Cognito...");
      try {
        await deleteUser();
        console.log("Cognito user deleted successfully");
      } catch (cognitoError) {
        // Log Cognito error but proceed since DB deletion was successful (or skipped)
        console.error("Error deleting user from Cognito:", cognitoError);
      }

      // Clear local storage and redirect to home
      setHasUnsavedChanges(false);
      // Dispatch event to notify NavigationGuard that there are no unsaved changes
      window.dispatchEvent(
        new CustomEvent("unsaved-changes", {
          detail: { hasUnsavedChanges: false },
        }),
      );
      localStorage.clear();
      alert(
        t("ACCOUNT_DELETED_SUCCESS") ||
          "Your account has been successfully deleted.",
      );
      // Use setTimeout to allow React state to update before redirect
      setTimeout(() => {
        window.location.href = "/";
      }, 0);
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(
        t("ACCOUNT_DELETION_ERROR") ||
          error.message ||
          "An error occurred while deleting your account. Please try again.",
      );
    } finally {
      setIsDeleting(false);
      setShowConfirmationModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
  };

  const handleCancelClick = () => {
    setIsDeleteChecked(false);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
            <FaTrash className="text-rose-600 text-lg" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("SIGN_OFF") || "Sign Off"}
          </h2>
        </div>
        <p className="text-gray-500 text-sm">
          {t("SIGN_OFF_DESCRIPTION") ||
            "Permanently remove your account from our system"}
        </p>
      </div>

      {/* Warning Card */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <FaExclamationTriangle className="text-orange-600" />
          </div>
          <div>
            <h3 className="text-orange-800 font-semibold mb-1">
              {t("ACCOUNT_DELETION_WARNING_TITLE") || "Account Deletion"}
            </h3>
            <p className="text-orange-700 text-sm leading-relaxed">
              {t("ACCOUNT_DELETION_WARNING_TEXT") ||
                "This action will permanently delete your account and all associated data. This action cannot be undone. Please ensure you have backed up any important information before proceeding."}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/* Reason for leaving */}
        <div className="mb-6 space-y-2">
          <label
            htmlFor="reasonForLeaving"
            className="flex items-center text-sm font-semibold text-gray-700"
          >
            {t("REASON_FOR_LEAVING") || "Reason for leaving"}{" "}
            <span className="ml-1 text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="reasonForLeaving"
            value={reasonForLeaving}
            onChange={handleReasonChange}
            className="w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
            rows="3"
            maxLength="500"
            placeholder={
              t("REASON_PLACEHOLDER") || "Tell us why you're leaving..."
            }
          />
          <div className="text-xs text-gray-400 text-right">
            {reasonForLeaving.length}/500 characters
          </div>
        </div>

        {/* Checkbox confirmation */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              id="deleteAccount"
              checked={isDeleteChecked}
              onChange={handleCheckboxChange}
              className="mt-1 h-5 w-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
            />
            <div>
              <span className="font-semibold text-rose-600 group-hover:text-rose-700 transition-colors">
                {t("I_WANT_TO_DELETE_MY_ACCOUNT") ||
                  "I want to delete my account"}
              </span>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                {t("ACCOUNT_DELETION_CONFIRMATION_TEXT") ||
                  "By checking this box, you acknowledge that you understand the consequences of deleting your account."}
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleCancelClick}
            className="inline-flex items-center gap-2 py-2.5 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
          >
            {t("CANCEL") || "Cancel"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isDeleteChecked}
            className={`inline-flex items-center gap-2 py-2.5 px-6 rounded-xl font-medium transition-all duration-200 ${
              isDeleteChecked
                ? "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {t("SUBMIT") || "Submit"}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {t("CONFIRM_ACCOUNT_DELETION") || "Confirm Account Deletion"}
              </h3>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {t("CONFIRM_ACCOUNT_DELETION_TEXT") ||
                "Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
              >
                {t("CANCEL") || "Cancel"}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  isDeleting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-lg shadow-rose-500/25"
                }`}
              >
                {isDeleting
                  ? t("DELETING") || "Deleting..."
                  : t("DELETE_ACCOUNT") || "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignOff;
