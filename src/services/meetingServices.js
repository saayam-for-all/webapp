import api from "./api";

// Create a Zoom meeting and notify selected volunteers
export const createZoomMeeting = async ({ emails, date, time }) => {
  // This should call your backend endpoint that handles Zoom meeting creation and email sending
  // Replace '/v1/meeting/create' with your actual backend endpoint
  const response = await api.post("/v1/meeting/create", {
    emails,
    date,
    time,
  });
  return response.data;
};

// Store meeting details in the database
export const storeMeetingDetails = async (meetingDetails) => {
  // Replace '/v1/meeting/store' with your actual backend endpoint
  const response = await api.post("/v1/meeting/store", meetingDetails);
  return response.data;
};
