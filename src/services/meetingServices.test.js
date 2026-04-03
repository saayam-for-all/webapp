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
    const mockData = { zoomLink: "link", meetingId: "id" };
    api.post.mockResolvedValueOnce({ data: mockData });
    const payload = {
      emails: ["test@example.com"],
      date: "2026-03-10",
      time: "12:00",
    };
    const result = await createZoomMeeting(payload);
    expect(api.post).toHaveBeenCalledWith("/v1/meeting/create", payload);
    expect(result).toEqual(mockData);
  });

  it("storeMeetingDetails returns data on success", async () => {
    const mockDetails = { meetingId: "id", zoomLink: "link" };
    api.post.mockResolvedValueOnce({ data: mockDetails });
    const result = await storeMeetingDetails(mockDetails);
    expect(api.post).toHaveBeenCalledWith("/v1/meeting/store", mockDetails);
    expect(result).toEqual(mockDetails);
  });
});
