import { useState, useRef } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

const VolunteerCourse = ({ selectedFile, setSelectedFile, setIsUploaded }) => {
  const { t } = useTranslation("identity");

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [source, setSource] = useState("device");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setSelectedFile(uploadedFile);

    if (uploadedFile) {
      console.log("File name:", uploadedFile.name);
      console.log("File type:", uploadedFile.type);
      console.log("File size:", uploadedFile.size);

      if (uploadedFile.size > 5 * 1024 * 1024) {
        setError(t("FILE_SIZE_ERROR"));
        setFile(null);
        setPreview("");
        setIsUploaded(false);
        setSelectedFile(null);
        return;
      }

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
        allowedTypes.includes(uploadedFile.type),
      );

      const isValidMimeType = allowedTypes.includes(uploadedFile.type);
      const fileExtension = uploadedFile.name
        .toLowerCase()
        .substring(uploadedFile.name.lastIndexOf("."));
      const isValidExtension = allowedExtensions.includes(fileExtension);

      console.log("File extension:", fileExtension);
      console.log("Is valid extension:", isValidExtension);

      if (!isValidMimeType && !isValidExtension) {
        setError(
          t("FILE_TYPE_ERROR", {
            fileType: uploadedFile.type,
            extension: fileExtension,
          }),
        );
        setFile(null);
        setPreview("");
        setIsUploaded(false);
        setSelectedFile(null);
        return;
      }

      setError("");
      setSelectedFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
      setIsUploaded(true);
    }
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
    setSelectedFile(null);
    setPreview("");
    setError("");
    setIsUploaded(false);
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
        console.log("File uploaded successfully");
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {t("UPLOAD_GOVERNMENT_ID")}
      </h2>

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
          onChange={handleSourceChange}
        >
          <option value="device">{t("DEVICE")}</option>
          <option value="drive">{t("GOOGLE_DRIVE")}</option>
          <option value="dropbox">{t("DROPBOX")}</option>
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
              {selectedFile ? selectedFile.name : t("NO_FILE_CHOSEN")}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {t("FILE_TYPE_REQUIREMENT")}
          </p>
        </div>
      )}

      {/* File Preview */}
      {selectedFile && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">
            {t("FILE")}: {selectedFile.name}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Upload and Remove Buttons */}
      <div className="flex gap-3 items-center">
        {selectedFile && (
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

export default VolunteerCourse;
