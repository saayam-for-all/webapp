import { useState, useRef } from "react";
import React from "react"; //added for testing

const VolunteerCourse = ({
  selectedFile,
  setSelectedFile,
  setIsUploaded,
  onSaveFile,
}) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [source, setSource] = useState("device");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null); // Reference to the file input

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setSelectedFile(uploadedFile);

    if (uploadedFile) {
      // Debug: Log file information
      console.log("File name:", uploadedFile.name);
      console.log("File type:", uploadedFile.type);
      console.log("File size:", uploadedFile.size);

      // Validate file size (2MB = 2 * 1024 * 1024 bytes)
      if (uploadedFile.size > 2 * 1024 * 1024) {
        setError("File size should not exceed 2MB");
        setFile(null);
        setPreview("");
        setIsUploaded(false);
        setSelectedFile(null);
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
        allowedTypes.includes(uploadedFile.type),
      );

      // Check MIME type first, then fallback to file extension
      const isValidMimeType = allowedTypes.includes(uploadedFile.type);
      const fileExtension = uploadedFile.name
        .toLowerCase()
        .substring(uploadedFile.name.lastIndexOf("."));
      const isValidExtension = allowedExtensions.includes(fileExtension);

      console.log("File extension:", fileExtension);
      console.log("Is valid extension:", isValidExtension);

      if (!isValidMimeType && !isValidExtension) {
        setError(
          `Only JPEG, JPG, PNG, and PDF files are allowed. File type detected: ${uploadedFile.type}, extension: ${fileExtension}`,
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
        .setOAuthToken("YOUR_GOOGLE_OAUTH_TOKEN") // Provide OAuth token
        .setDeveloperKey("YOUR_DEVELOPER_KEY") // Provide your Developer Key
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
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const timestamp = new Date().toISOString(); // Get the current timestamp
    const formData = new FormData();

    formData.append("file", file);
    formData.append("timestamp", timestamp);

    try {
      setIsLoading(true); // Show loading state if needed

      const response = await fetch("/your-backend-api-endpoint", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle successful response
        console.log("File uploaded successfully");
      } else {
        // Handle errors
        const errorData = await response.json();
        setError(errorData.message || "File upload failed");
      }
    } catch (err) {
      setError("An error occurred during file upload");
      console.error(err);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Government ID</h2>

      {/* Source Selection Dropdown */}
      <div className="mb-4">
        <label
          htmlFor="source"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Source
        </label>
        <select
          id="source"
          className="w-full border border-gray-300 rounded-md p-2"
          value={source}
          onChange={handleSourceChange}
        >
          <option value="device">Device</option>
          <option value="drive">Google Drive</option>
          <option value="dropbox">Dropbox</option>
        </select>
      </div>

      {/* File Upload Input (visible only if 'Device' is selected) */}
      {source === "device" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload File
          </label>
          <input
            type="file"
            accept=".jpeg,.jpg,.png,.pdf"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            onChange={handleFileChange}
            ref={fileInputRef} // Reference the input
          />
          <p className="mt-1 text-sm text-gray-500">
            Only JPEG, JPG, PNG, or PDF files. Max size: 2MB.
          </p>
        </div>
      )}

      {/* File Preview */}
      {selectedFile && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">
            File: {selectedFile.name}
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
            Remove
          </button>
        )}
        <button
          onClick={onSaveFile}
          disabled={!selectedFile}
          className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default VolunteerCourse;
