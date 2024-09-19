import { useState } from 'react';

export const useFileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateFile = (selectedFile) => {
    if (selectedFile.size > 2 * 1024 * 1024) {
      setError('File size should not exceed 2MB');
      return false;
    }
    const allowedTypes = ['image/jpg', 'image/jpeg', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only JPEG, JPG, and PDF files are allowed');
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setError('');
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const response = await fetch('/your-backend-api-endpoint', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'File upload failed');
      }
    } catch (err) {
      setError('An error occurred during file upload');
    } finally {
      setIsLoading(false);
    }
  };

  return { file, error, isLoading, handleFileChange, handleUpload };
};