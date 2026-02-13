import { signOffUser } from "./volunteerServices";
import api from "./api";

// Mock the api module
jest.mock("./api");

describe("volunteerServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signOffUser", () => {
    it("sends DELETE request with userId and reason", async () => {
      api.request.mockResolvedValue({
        data: { success: true, message: "User deleted" },
      });

      const result = await signOffUser(
        "SID-00-000-001",
        "Leaving the platform",
      );

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
});
