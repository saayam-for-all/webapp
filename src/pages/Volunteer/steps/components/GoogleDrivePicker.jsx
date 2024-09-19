import { useEffect } from 'react';
import { loadGooglePickerApi } from '../../../../utils/googleDriveUtils';

const GoogleDrivePicker = ({ onFileSelect }) => {
  useEffect(() => {
    loadGooglePickerApi();
  }, []);

  const handleGoogleDrivePickerOpen = () => {
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            createPicker(tokenResponse.access_token);
          }
        },
      }).requestAccessToken();
    }
  };

  const createPicker = (accessToken) => {
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .setOAuthToken(accessToken)
      .setCallback((data) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const fileId = data.docs[0].id;
          onFileSelect(accessToken, fileId);
        }
      })
      .build();
    picker.setVisible(true);
  };

  return (
    <button
      onClick={handleGoogleDrivePickerOpen}
      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mb-4"
    >
      Select from Google Drive
    </button>
  );
};

export default GoogleDrivePicker;