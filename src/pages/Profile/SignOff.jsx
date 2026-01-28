import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { deleteUser } from "aws-amplify/auth";
import { signOffUser } from "../../services/requestServices";
import { getUserId } from "../../services/volunteerServices";

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
      localStorage.clear();
      window.location.href = "/";
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <FaTrash className="text-orange-500 text-2xl mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">
            {t("SIGN_OFF") || "Sign Off"}
          </h2>
        </div>

        <div className="mb-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <FaExclamationTriangle className="text-orange-500 text-xl mr-3 flex-shrink-0" />
              <h3 className="text-orange-800 font-semibold">
                {t("ACCOUNT_DELETION_WARNING_TITLE") || "Account Deletion"}
              </h3>
            </div>
            <p className="text-orange-700 text-sm">
              {t("ACCOUNT_DELETION_WARNING_TEXT") ||
                "This action will permanently delete your account and all associated data. This action cannot be undone. Please ensure you have backed up any important information before proceeding."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <label
                htmlFor="reasonForLeaving"
                className="block text-sm font-medium text-gray-700"
              >
                {"Reason for leaving (Optional)"}
              </label>
              <textarea
                id="reasonForLeaving"
                value={reasonForLeaving}
                onChange={handleReasonChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 resize-none"
                rows="3"
                maxLength="500"
              />
              <div className="text-xs text-gray-500 text-right">
                {reasonForLeaving.length}/500 characters
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="deleteAccount"
                checked={isDeleteChecked}
                onChange={handleCheckboxChange}
                className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label
                htmlFor="deleteAccount"
                className="ml-3 text-sm text-gray-700"
              >
                <span className="font-medium text-orange-600">
                  {t("I_WANT_TO_DELETE_MY_ACCOUNT") ||
                    "I want to delete my account"}
                </span>
                <p className="text-gray-500 mt-1">
                  {t("ACCOUNT_DELETION_CONFIRMATION_TEXT") ||
                    "By checking this box, you acknowledge that you understand the consequences of deleting your account."}
                </p>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancelClick}
            className="px-6 py-2 rounded-lg font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200"
          >
            {t("CANCEL") || "Cancel"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isDeleteChecked}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isDeleteChecked
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {t("SUBMIT") || "Submit"}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
              <h3 className="text-xl font-bold text-gray-800">
                {t("CONFIRM_ACCOUNT_DELETION") || "Confirm Account Deletion"}
              </h3>
            </div>

            <p className="text-gray-700 mb-6">
              {t("CONFIRM_ACCOUNT_DELETION_TEXT") ||
                "Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              >
                {t("CANCEL") || "Cancel"}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isDeleting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
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
