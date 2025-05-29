import { useState, useRef } from "react";
import React from "react"; //added for testing
import * as pdfjsLib from "pdfjs-dist";
import { OPS } from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const VolunteerCourse = ({
  selectedFile,
  setSelectedFile,
  setIsUploaded,
  ack,
  setAck,
  error,
  setError,
  preview,
  setPreview,
  fileInputRef,
}) => {
  // const [file, setFile] = useState(null);
  // const [error, setError] = useState("");
  // const [ack, setAck] = useState("");
  // const [preview, setPreview] = useState("");
  const [source, setSource] = useState("device");
  const [isLoading, setIsLoading] = useState(false);
  //const fileInputRef = useRef(null); // Reference to the file input

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setSelectedFile(uploadedFile);

    if (uploadedFile) {
      // Validate file size (2MB = 2 * 1024 * 1024 bytes)
      if (uploadedFile.size > 2 * 1024 * 1024) {
        setError("File size should not exceed 2MB");
        // setFile(null);
        setSelectedFile(null);
        setPreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpg", "image/jpeg", "application/pdf"];
      if (!allowedTypes.includes(uploadedFile.type)) {
        setError("Only JPEG, JPG, and PDF files are allowed");
        //setFile(null);
        setSelectedFile(null);
        setPreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setError("");
      //setFile(uploadedFile);
      setSelectedFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
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
    //setFile(null);
    setSelectedFile(null);
    setPreview("");
    setError("");
    setIsUploaded(false);
    setAck("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (
      selectedFile.type === "image/jpg" ||
      selectedFile.type === "image/jpeg"
    ) {
      setIsUploaded(true);
      setAck("Image Uploaded Successfully");
    } else {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const opList = await page.getOperatorList();
        const hasImage = opList.fnArray.some(
          (fn) =>
            fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject,
        );
        if (hasImage) {
          setIsUploaded(true);
          setError("");
          setAck("PDF File Uploaded Successfully");
        } else {
          setIsUploaded(false);
          setError("Please upload a Valid PDF");
        }
      }
    }
  };
  // const timestamp = new Date().toISOString(); // Get the current timestamp
  // const formData = new FormData();

  // formData.append("file", file);
  // formData.append("timestamp", timestamp);

  // try {
  //   setIsLoading(true); // Show loading state if needed

  //   const response = await fetch("/your-backend-api-endpoint", {
  //     method: "POST",
  //     body: formData,
  //   });

  //   if (response.ok) {
  //     // Handle successful response
  //     console.log("File uploaded successfully");
  //   } else {
  //     // Handle errors
  //     const errorData = await response.json();
  //     setError(errorData.message || "File upload failed");
  //   }
  // } catch (err) {
  //   setError("An error occurred during file upload");
  //   console.error(err);
  // } finally {
  //   setIsLoading(false); // Hide loading state
  // }
  // };

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
      {selectedFile && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">
            File: {selectedFile.name}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {ack && <p className="text-sm text-green-600">{ack}</p>}

      {/* Upload and Remove Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
        {selectedFile && (
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
