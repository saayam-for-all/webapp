import React from 'react';

const UploadButton = ({ onUpload, isLoading }) => {
  return (
    <button
      onClick={onUpload}
      disabled={isLoading}
      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-green-300"
    >
      {isLoading ? 'Uploading...' : 'Upload'}
    </button>
  );
};

export default UploadButton;