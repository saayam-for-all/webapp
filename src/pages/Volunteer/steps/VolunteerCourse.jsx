import { useState, useRef } from "react";
import React from "react"; //added for testing

const VolunteerCourse = ({ selectedFile, setSelectedFile }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [source, setSource] = useState("device");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null); // Reference to the file input

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);

    if (selectedFile) {
      // Validate file size (2MB = 2 * 1024 * 1024 bytes)
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError("File size should not exceed 2MB");
        setFile(null);
        setPreview("");
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpg", "image/jpeg", "application/pdf"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Only JPEG, JPG, and PDF files are allowed");
        setFile(null);
        setPreview("");
        return;
      }

      setError("");
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
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
    setFile(null);
    setPreview("");
    setError("");
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
            accept=".jpeg,.jpg,.pdf"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            onChange={handleFileChange}
            ref={fileInputRef} // Reference the input
          />
          <p className="mt-1 text-sm text-gray-500">
            Only JPEG, JPG, or PDF files. Max size: 2MB.
          </p>
        </div>
      )}

      {/* File Preview */}
      {file && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">File: {file.name}</p>
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
          {isLoading ? "Uploading..." : "Upload"}
        </button>
        {file && (
          <button
            onClick={handleRemoveFile}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default VolunteerCourse;
