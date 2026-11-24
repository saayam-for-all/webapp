import api from "./api";

// Create a Zoom meeting and notify selected volunteers
export const createZoomMeeting = async ({
  emails,
  date,
  time,
  hostUserId,
  topic,
}) => {
  const startTime = new Date(`${date}T${time}:00`).toISOString();
  const response = await api.post("/0.0.1/meetings", {
    topic: topic || "Volunteer Coordination Meeting",
    startTime,
    durationMinutes: 30,
    hostUserId: hostUserId || "test-host-123",
    attendeeEmails: emails,
  });
  return response.data;
};

// Store meeting details in the database
// Note: not needed separately — backend's /0.0.1/meetings endpoint
// already persists the meeting record as part of creation.
export const storeMeetingDetails = async (meetingDetails) => {
  return meetingDetails;
};
