import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const IdentityDocument = ({ setHasUnsavedChanges }) => {
  const { t } = useTranslation("identity");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [source] = useState("device");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const currentIdentityDoc = {
    name: "identity_doc.pdf",
    url: "/mock/passport_mock.pdf",
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Debug: Log file information
    console.log("File name:", selectedFile.name);
    console.log("File type:", selectedFile.type);
    console.log("File size:", selectedFile.size);

    // Validate file size (2MB)
    console.log("Selected file size:", selectedFile.size);
    console.log("5MB limit:", 5 * 1024 * 1024);
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(t("FILE_SIZE_ERROR"));
      setFile(null);
      setPreview("");
      setHasUnsavedChanges(false);
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
    console.log("Allowed types:", allowedTypes);
    console.log(
      "File type in allowed types:",
      allowedTypes.includes(selectedFile.type),
    );

    // Check MIME type first, then fallback to file extension
    const isValidMimeType = allowedTypes.includes(selectedFile.type);
    const fileExtension = selectedFile.name
      .toLowerCase()
      .substring(selectedFile.name.lastIndexOf("."));
    const isValidExtension = allowedExtensions.includes(fileExtension);

    console.log("File extension:", fileExtension);
    console.log("Is valid extension:", isValidExtension);

    if (!isValidMimeType && !isValidExtension) {
      setError(
        t("FILE_TYPE_ERROR", {
          fileType: selectedFile.type,
          extension: fileExtension,
        }),
      );
      setFile(null);
      setPreview("");
      setHasUnsavedChanges(false);
      return;
    }

    setError("");
    setFile(selectedFile);
    setPreview(
      selectedFile.type.startsWith("image/")
        ? URL.createObjectURL(selectedFile)
        : "",
    );
    setHasUnsavedChanges(true);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview("");
    setError("");
    setHasUnsavedChanges(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const timestamp = new Date().toISOString();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("timestamp", timestamp);

    try {
      setIsLoading(true);

      const response = await fetch("/your-backend-api-endpoint", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log(t("UPLOAD_SUCCESS"));
        setHasUnsavedChanges(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || t("UPLOAD_FAILED"));
      }
    } catch (err) {
      setError(t("UPLOAD_ERROR"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    window.open(currentIdentityDoc.url, "_blank");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {t("UPLOAD_GOVERNMENT_ID")}
      </h2>

      {/* Current Identity Document */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Identity Document
        </label>

        <div className="flex items-center justify-between border p-2 rounded-md">
          <span className="text-xs text-gray-600">
            {currentIdentityDoc.name}
          </span>

          <button
            onClick={handleDownload}
            className="text-blue-600 hover:text-blue-800"
          >
            ⬇️
          </button>
        </div>
      </div>

      {/* Source Selection Dropdown */}
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
          value={source}
          disabled
        >
          <option value="device">{t("DEVICE")}</option>
        </select>
      </div>

      {/* File Upload Input (visible only if 'Device' is selected) */}
      {source === "device" && (
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
              {file ? file.name : t("NO_FILE_CHOSEN")}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {t("FILE_TYPE_REQUIREMENT")}
          </p>
        </div>
      )}

      {/* File Preview */}
      {file && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">
            {t("FILE")}: {file.name || file.id}
          </p>
          {preview && (
            <img
              src={preview}
              alt={t("FILE_PREVIEW")}
              className="mt-2 max-h-40 rounded"
            />
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Upload and Remove Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? t("UPLOADING") : t("UPLOAD")}
        </button>
        {file && (
          <button
            onClick={handleRemoveFile}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            {t("REMOVE")}
          </button>
        )}
      </div>
    </div>
  );
};
IdentityDocument.propTypes = {
  setHasUnsavedChanges: PropTypes.func.isRequired,
};

export default IdentityDocument;
