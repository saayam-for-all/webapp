import { useCallback } from 'react';
import { initializeGoogleSignIn, fetchFileFromDrive } from '../utils/googleDriveUtils';

export const useGoogleDrive = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Replace with your Client ID

  const initGoogleDrive = useCallback(() => {
    initializeGoogleSignIn(clientId);
  }, [clientId]);

  const handleGoogleDriveFileSelection = async (token, fileId) => {
    try {
      const fileBlob = await fetchFileFromDrive(fileId, token);
      return fileBlob;
    } catch (err) {
      throw new Error('Failed to fetch file from Google Drive');
    }
  };

  return { initGoogleDrive, handleGoogleDriveFileSelection };
};