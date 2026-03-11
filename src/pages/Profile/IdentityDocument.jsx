import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiUploadCloud, FiTrash2, FiFile, FiImage } from "react-icons/fi";

const IdentityDocument = ({ setHasUnsavedChanges }) => {
  const { t } = useTranslation("identity");
  const { t: tProfile } = useTranslation("profile");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [source, setSource] = useState("device");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Debug: Log file information
    console.log("File name:", selectedFile.name);
    console.log("File type:", selectedFile.type);
    console.log("File size:", selectedFile.size);

    // Validate file size (2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
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

  const handleSourceChange = (e) => {
    const selectedSource = e.target.value;
    setSource(selectedSource);

    if (selectedSource === "drive") {
      loadGoogleDrivePicker();
    } else if (selectedSource === "dropbox") {
      loadDropboxChooser();
    }
  };

  const loadGoogleDrivePicker = () => {
    window.gapi.load("picker", () => {
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .setOAuthToken("YOUR_GOOGLE_OAUTH_TOKEN")
        .setDeveloperKey("YOUR_DEVELOPER_KEY")
        .setCallback((data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const fileId = data.docs[0].id;
            const fileName = data.docs[0].name;
            setFile({ id: fileId, name: fileName });
            setPreview("");
            setHasUnsavedChanges(true);
          }
        })
        .build();
      picker.setVisible(true);
    });
  };

  const loadDropboxChooser = () => {
    const options = {
      success: (files) => {
        const selectedFile = files[0];
        setFile({ id: selectedFile.id, name: selectedFile.name });
        setPreview("");
        setHasUnsavedChanges(true);
      },
      cancel: () => {
        console.log("Dropbox chooser closed");
      },
      linkType: "direct",
      multiselect: false,
      extensions: [".jpeg", ".pdf"],
    };
    window.Dropbox.choose(options);
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

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {tProfile("IDENTITY_DOCUMENT")}
        </h2>
        <p className="text-gray-500 text-sm">
          {tProfile("IDENTITY_DOCUMENT_DESCRIPTION") ||
            "Upload your government-issued identification"}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("UPLOAD_GOVERNMENT_ID")}
        </h3>

        {/* Source Selection Dropdown */}
        <div className="mb-6 space-y-2">
          <label
            htmlFor="source"
            className="text-sm font-semibold text-gray-700"
          >
            {t("SELECT_SOURCE")}
          </label>
          <select
            id="source"
            className="w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            value={source}
            onChange={handleSourceChange}
          >
            <option value="device">{t("DEVICE")}</option>
            <option value="drive">{t("GOOGLE_DRIVE")}</option>
            <option value="dropbox">{t("DROPBOX")}</option>
          </select>
        </div>

        {/* File Upload Input (visible only if 'Device' is selected) */}
        {source === "device" && (
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              {t("UPLOAD_FILE")}
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".jpeg,.jpg,.png,.pdf"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all duration-200"
              >
                <FiUploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 font-medium">
                  {t("CLICK_TO_UPLOAD") || "Click to upload or drag and drop"}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {t("FILE_TYPE_REQUIREMENT")}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* File Preview */}
        {file && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              {preview ? (
                <FiImage className="w-8 h-8 text-blue-500" />
              ) : (
                <FiFile className="w-8 h-8 text-blue-500" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {file.name || file.id}
                </p>
                <p className="text-xs text-gray-500">
                  {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ""}
                </p>
              </div>
            </div>
            {preview && (
              <img
                src={preview}
                alt={t("FILE_PREVIEW")}
                className="mt-4 max-h-48 rounded-lg mx-auto"
              />
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          {file && (
            <button
              onClick={handleRemoveFile}
              className="inline-flex items-center gap-2 py-2.5 px-6 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all duration-200"
            >
              <FiTrash2 className="w-4 h-4" />
              {t("REMOVE")}
            </button>
          )}
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="inline-flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? t("UPLOADING") : t("UPLOAD")}
          </button>
        </div>
      </div>
    </div>
  );
};

import PropTypes from "prop-types";

IdentityDocument.propTypes = {
  setHasUnsavedChanges: PropTypes.func.isRequired,
};

export default IdentityDocument;
