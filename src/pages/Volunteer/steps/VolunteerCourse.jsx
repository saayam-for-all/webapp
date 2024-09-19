import React, { useState, useEffect } from 'react';
import { useGoogleDrive } from '../../../hooks/useGoogleDrive';
import { useFileUpload } from '../../../hooks/useFileUpload';
import FileSourceSelector from './components/FileSourceSelector';
import FileUploader from './components/FileUploader';
import GoogleDrivePicker from './components/GoogleDrivePicker';
import ErrorMessage from './components/ErrorMessage';
import UploadButton from './components/UploadButton';

const VolunteerCourse = () => {
  const [source, setSource] = useState('device');
  const { initGoogleDrive, handleGoogleDriveFileSelection } = useGoogleDrive();
  const { file, error, isLoading, handleFileChange, handleUpload } = useFileUpload();

  useEffect(() => {
    initGoogleDrive();
  }, [initGoogleDrive]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Government ID</h2>

      <FileSourceSelector source={source} onSourceChange={setSource} />

      {source === 'device' && (
        <FileUploader onFileChange={handleFileChange} />
      )}

      {source === 'drive' && (
        <GoogleDrivePicker onFileSelect={handleGoogleDriveFileSelection} />
      )}

      <ErrorMessage message={error} />

      {file && (
        <UploadButton onUpload={handleUpload} isLoading={isLoading} />
      )}
    </div>
  );
};

export default VolunteerCourse;