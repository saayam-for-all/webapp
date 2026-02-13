import api from "./api";
import {
  uploadProfileImage,
  deleteProfileImage,
  fetchProfileImage,
} from "./volunteerServices";
import { getUserId } from "./volunteerServices";

jest.mock("./api");
jest.mock("../utils/fileToBase64", () => ({
  fileToBase64: jest.fn(() => Promise.resolve("data:image/jpeg;base64,abc")),
}));

describe("volunteerServices profile image", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadProfileImage", () => {
    it("calls POST with userId, contentType and base64", async () => {
      api.post.mockResolvedValue({});
      const file = new File(["x"], "a.jpg", { type: "image/jpeg" });
      await uploadProfileImage("SID-123", file);
      expect(api.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          userId: "SID-123",
          contentType: "image/jpeg",
          base64: "data:image/jpeg;base64,abc",
        }),
      );
    });

    it("throws when userId is missing", async () => {
      await expect(
        uploadProfileImage(
          "",
          new File(["x"], "a.jpg", { type: "image/jpeg" }),
        ),
      ).rejects.toThrow("User ID is required");
      await expect(
        uploadProfileImage(
          null,
          new File(["x"], "a.jpg", { type: "image/jpeg" }),
        ),
      ).rejects.toThrow("User ID is required");
    });
  });

  describe("deleteProfileImage", () => {
    it("calls DELETE with JSON body { userId }", async () => {
      api.delete.mockResolvedValue({});
      await deleteProfileImage("SID-456");
      expect(api.delete).toHaveBeenCalledWith(expect.any(String), {
        data: { userId: "SID-456" },
      });
    });

    it("throws when userId is missing", async () => {
      await expect(deleteProfileImage("")).rejects.toThrow(
        "User ID is required",
      );
      await expect(deleteProfileImage(null)).rejects.toThrow(
        "User ID is required",
      );
    });
  });

  describe("fetchProfileImage", () => {
    it("calls POST view endpoint with responseType blob and returns blob", async () => {
      const blob = new Blob(["binary"], { type: "image/jpeg" });
      api.post.mockResolvedValue({ data: blob });
      const result = await fetchProfileImage("SID-789");
      expect(api.post).toHaveBeenCalledWith(
        expect.any(String),
        { userId: "SID-789" },
        { responseType: "blob" },
      );
      expect(result).toBe(blob);
    });

    it("returns null on 404", async () => {
      api.post.mockRejectedValue({ response: { status: 404 } });
      const result = await fetchProfileImage("SID-404");
      expect(result).toBeNull();
    });

    it("throws on other errors", async () => {
      api.post.mockRejectedValue(new Error("Network error"));
      await expect(fetchProfileImage("SID-x")).rejects.toThrow("Network error");
    });

    it("throws when userId is missing", async () => {
      await expect(fetchProfileImage("")).rejects.toThrow(
        "User ID is required",
      );
    });
  });
});
describe("getUserId", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call api.post with correct endpoint and email in body", async () => {
    const mockResponse = { data: { data: { id: "123" } } };
    api.post.mockResolvedValue(mockResponse);

    const result = await getUserId("test@example.com");

    expect(api.post).toHaveBeenCalledWith("v1/volunteer/getUserIdByEmail", {
      email: "test@example.com",
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("should throw error with server message when API returns error response", async () => {
    api.post.mockRejectedValue({
      response: { data: { message: "User not found" } },
    });

    await expect(getUserId("bad@example.com")).rejects.toThrow(
      "User not found",
    );
  });

  it("should throw error with generic message when error has message", async () => {
    api.post.mockRejectedValue(new Error("Network Error"));

    await expect(getUserId("bad@example.com")).rejects.toThrow("Network Error");
  });

  it("should throw fallback message when error has no message", async () => {
    api.post.mockRejectedValue({});

    await expect(getUserId("bad@example.com")).rejects.toThrow(
      "Unknown error while fetching user ID",
    );
  });
});
