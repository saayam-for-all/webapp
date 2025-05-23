import React, { useState, useEffect } from "react";
import axios from "axios";

const IdentityDocuments = () => {
  const [source, setSource] = useState("Device");
  const [file, setFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);

  useEffect(() => {
    axios
      .get("/api/identity-document")
      .then((res) => setExistingFile(res.data))
      .catch(() => setExistingFile(null));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("idDocument", file);

    try {
      const res = await axios.post("/api/identity-document", formData);
      setExistingFile(res.data);
      setFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("/api/identity-document");
      setExistingFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Government ID</h2>

      <label className="block mb-2 font-medium">Select Source</label>
      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="Device">Device</option>
        <option value="Google Drive" disabled>
          Google Drive (Coming soon)
        </option>
        <option value="Dropbox" disabled>
          Dropbox (Coming soon)
        </option>
      </select>

      <label className="block mb-2 font-medium">Upload File</label>
      <input
        type="file"
        accept=".jpg,.jpeg,.pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      {file && (
        <div className="mb-4 text-sm text-gray-600">
          Selected file: {file.name}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file}
        className={`w-full p-2 rounded text-white ${file ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Upload
      </button>

      {existingFile && (
        <div className="mt-6">
          <p className="font-medium">Uploaded ID:</p>
          <a
            href={existingFile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View ID
          </a>
          <button
            onClick={handleDelete}
            className="ml-4 text-red-500 underline"
          >
            Remove
          </button>
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500">
        Only JPEG, JPG, or PDF files. Max size: 2MB.
      </p>
    </div>
  );
};

export default IdentityDocuments;
