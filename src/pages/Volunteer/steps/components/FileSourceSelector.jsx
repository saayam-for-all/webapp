import React from 'react';

const FileSourceSelector = ({ source, onSourceChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
        Select Source
      </label>
      <select
        id="source"
        className="w-full border border-gray-300 rounded-md p-2"
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
      >
        <option value="device">Device</option>
        <option value="drive">Google Drive</option>
      </select>
    </div>
  );
};

export default FileSourceSelector;