import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { validateIdentityFile } from "./validateIdentityFile";

const VolunteerCourse = ({
  selectedFile,
  setSelectedFile,
  setIsUploaded,
  expiryDate,
  setExpiryDate,
  expiryDateOption,
  setExpiryDateOption,
}) => {
  const { t } = useTranslation("identity");

  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const validationRequestRef = useRef(0);

  const getToday = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = getToday();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minimumExpiryDate = [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, "0"),
    String(tomorrow.getDate()).padStart(2, "0"),
  ].join("-");
  const isInvalidExpiryDate = Boolean(expiryDate && expiryDate <= today);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const uploadedFile = event.target.files?.[0];
    const requestId = ++validationRequestRef.current;

    // Clear the previous upload before validating a replacement.
    setSelectedFile(null);
    setIsUploaded(false);
    setError("");

    if (!uploadedFile) return;

    const validationError = await validateIdentityFile(uploadedFile);

    // Ignore results from older file selections.
    if (requestId !== validationRequestRef.current) return;

    if (validationError) {
      const errorKeys = {
        empty: "FILE_EMPTY_ERROR",
        size: "FILE_SIZE_ERROR",
        type: "FILE_TYPE_ERROR",
        content: "FILE_CONTENT_ERROR",
      };

      setError(t(errorKeys[validationError]));
      event.target.value = "";
      return;
    }

    setSelectedFile(uploadedFile);
    setIsUploaded(true);
  };

  const handleRemoveFile = () => {
    // Cancel any pending validation result.
    validationRequestRef.current += 1;
    setSelectedFile(null);
    setError("");
    setIsUploaded(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {t("UPLOAD_GOVERNMENT_ID")}
      </h2>

      {/* Source Selection */}
      <div className="mb-4">
        <label
          htmlFor="source"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("SELECT_SOURCE")}
        </label>

        <select
          id="source"
          className="w-full border border-gray-300 rounded-md p-2"
          value="device"
          disabled
        >
          <option value="device">{t("DEVICE")}</option>
        </select>
      </div>

      {/* Device File Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 after:ml-1 after:text-red-600 after:content-['*']">
          {t("UPLOAD_FILE")}
        </label>

        <input
          type="file"
          accept=".jpeg,.jpg,.png,.pdf"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-2 bg-gray-50">
          <button
            type="button"
            onClick={handleButtonClick}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 active:scale-95 duration-150"
          >
            {t("CHOOSE_FILE")}
          </button>

          <span className="text-gray-600 text-sm truncate max-w-xs">
            {selectedFile ? selectedFile.name : t("NO_FILE_CHOSEN")}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          {t("FILE_TYPE_REQUIREMENT")}
        </p>
      </div>

      {/* Document Expiry Date */}
      <div className="mb-4">
        <label
          htmlFor="document-expiry-date"
          id="document-expiry-date-label"
          className="block text-sm font-medium text-gray-700 mb-1 after:ml-1 after:text-red-600 after:content-['*']"
        >
          {t("DOCUMENT_EXPIRY_DATE")}
        </label>
        <div
          role="radiogroup"
          aria-labelledby="document-expiry-date-label"
          className="mb-2 flex flex-col gap-2"
        >
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="document-expiry-option"
              value="expiryDate"
              checked={expiryDateOption === "expiryDate"}
              onChange={() => setExpiryDateOption("expiryDate")}
            />
            {t("EXPIRY_DATE_OPTION")}
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="document-expiry-option"
              value="noExpiryDate"
              checked={expiryDateOption === "noExpiryDate"}
              onChange={() => {
                setExpiryDateOption("noExpiryDate");
                setExpiryDate("");
              }}
            />
            {t("NO_EXPIRY_DATE")}
          </label>
        </div>
        <input
          id="document-expiry-date"
          type="date"
          value={expiryDate}
          min={minimumExpiryDate}
          onChange={(event) => {
            setExpiryDate(event.target.value);
            if (event.target.value) setExpiryDateOption("expiryDate");
          }}
          disabled={expiryDateOption === "noExpiryDate"}
          aria-invalid={isInvalidExpiryDate}
          aria-describedby={
            isInvalidExpiryDate ? "document-expiry-error" : undefined
          }
          className="w-full border border-gray-300 rounded-md p-2"
        />
        {isInvalidExpiryDate && (
          <p
            id="document-expiry-error"
            role="alert"
            className="mt-1 text-sm text-red-600"
          >
            {t("DOCUMENT_EXPIRED_ERROR")}
          </p>
        )}
      </div>

      {/* Selected File */}
      {selectedFile && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">
            {t("FILE")}: {selectedFile.name}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {/* Remove Button */}
      {selectedFile && (
        <div className="flex gap-3 items-center">
          <button
            type="button"
            onClick={handleRemoveFile}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            {t("REMOVE")}
          </button>
        </div>
      )}
    </div>
  );
};

VolunteerCourse.propTypes = {
  selectedFile: PropTypes.object,
  setSelectedFile: PropTypes.func.isRequired,
  setIsUploaded: PropTypes.func.isRequired,
  expiryDate: PropTypes.string.isRequired,
  setExpiryDate: PropTypes.func.isRequired,
  expiryDateOption: PropTypes.string.isRequired,
  setExpiryDateOption: PropTypes.func.isRequired,
};

VolunteerCourse.defaultProps = {
  selectedFile: null,
};

export default VolunteerCourse;
