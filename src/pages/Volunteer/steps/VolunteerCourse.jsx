import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const VolunteerCourse = ({ selectedFile, setSelectedFile, setIsUploaded }) => {
  const { t } = useTranslation("identity");

  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files?.[0];

    if (!uploadedFile) {
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    const allowedTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];

    const fileExtension = uploadedFile.name
      .toLowerCase()
      .substring(uploadedFile.name.lastIndexOf("."));

    const isValidMimeType = allowedTypes.includes(uploadedFile.type);
    const isValidExtension = allowedExtensions.includes(fileExtension);

    if (uploadedFile.size > maxFileSize) {
      setError(t("FILE_SIZE_ERROR"));
      setSelectedFile(null);
      setIsUploaded(false);
      event.target.value = "";
      return;
    }

    if (!isValidMimeType && !isValidExtension) {
      setError(
        t("FILE_TYPE_ERROR", {
          fileType: uploadedFile.type,
          extension: fileExtension,
        }),
      );

      setSelectedFile(null);
      setIsUploaded(false);
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(uploadedFile);
    setIsUploaded(true);
  };

  const handleRemoveFile = () => {
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
};

VolunteerCourse.defaultProps = {
  selectedFile: null,
};

export default VolunteerCourse;
