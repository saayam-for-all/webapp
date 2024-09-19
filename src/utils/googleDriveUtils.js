export const loadGooglePickerApi = () => {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js?onload=onApiLoad';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);

  window.onApiLoad = () => {
    window.gapi.load('picker');
  };
};

export const initializeGoogleSignIn = (clientId) => {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);

  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse
    });
  };
};

function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);
  // You can send this token to your server for verification
}

export const fetchFileFromDrive = async (fileId, accessToken) => {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch file from Google Drive');
  }

  return response.blob();
};