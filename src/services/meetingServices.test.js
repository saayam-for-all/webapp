import { createZoomMeeting, storeMeetingDetails } from "./meetingServices";
import api from "./api";

jest.mock("./api", () => ({
  post: jest.fn(),
}));

describe("meetingServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createZoomMeeting returns data on success", async () => {
    const mockData = { message: "Meeting created successfully" };
    api.post.mockResolvedValueOnce({ data: mockData });
    const payload = {
      emails: ["test@example.com"],
      date: "2026-03-10",
      time: "12:00",
    };
    const result = await createZoomMeeting(payload);
    expect(api.post).toHaveBeenCalledWith("/0.0.1/meetings", {
      topic: "Volunteer Coordination Meeting",
      startTime: new Date("2026-03-10T12:00:00").toISOString(),
      durationMinutes: 30,
      hostUserId: "test-host-123",
      attendeeEmails: ["test@example.com"],
    });
    expect(result).toEqual(mockData);
  });

  it("storeMeetingDetails returns meeting details unchanged", async () => {
    const mockDetails = { meetingId: "id", zoomLink: "link" };
    const result = await storeMeetingDetails(mockDetails);
    expect(result).toEqual(mockDetails);
  });
});
