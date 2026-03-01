import api from "./api";
import {
  uploadProfileImage,
  deleteProfileImage,
  fetchProfileImage,
  signOffUser,
  getUserId,
} from "./volunteerServices";

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
        {
          responseType: "blob",
          headers: { Accept: "image/jpeg, image/png" },
        },
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

describe("signOffUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends DELETE request with userId and reason", async () => {
    api.request.mockResolvedValue({
      data: { success: true, message: "User deleted" },
    });

    const result = await signOffUser("SID-00-000-001", "Leaving the platform");

    expect(api.request).toHaveBeenCalledWith({
      method: "DELETE",
      url: "v1/volunteer/signOffUser",
      data: {
        userId: "SID-00-000-001",
        reason: "Leaving the platform",
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(result).toEqual({ success: true, message: "User deleted" });
  });

  it("sends DELETE request with empty reason by default", async () => {
    api.request.mockResolvedValue({
      data: { success: true },
    });

    await signOffUser("SID-00-000-001");

    expect(api.request).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          userId: "SID-00-000-001",
          reason: "",
        },
      }),
    );
  });

  it("returns response data directly", async () => {
    const responseData = {
      success: true,
      statusCode: 200,
      saayamCode: "SAAAYAM-1205",
      message: "User deleted",
      data: { userId: "SID-00-000-002-558" },
      timestamp: 1770661776.66827198,
    };
    api.request.mockResolvedValue({ data: responseData });

    const result = await signOffUser("SID-00-000-002-558", "Test reason");

    expect(result).toEqual(responseData);
  });

  it("handles API error", async () => {
    api.request.mockRejectedValue(new Error("Network error"));

    await expect(signOffUser("SID-00-000-001")).rejects.toThrow(
      "Network error",
    );
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
