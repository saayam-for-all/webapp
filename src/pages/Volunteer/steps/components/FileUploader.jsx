import React from 'react';

const FileUploader = ({ onFileChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
      <input
        type="file"
        accept=".jpeg,.jpg,.pdf"
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        onChange={onFileChange}
      />
      <p className="mt-1 text-sm text-gray-500">Only JPEG, JPG, or PDF files. Max size: 2MB.</p>
    </div>
  );
};

export default FileUploader;