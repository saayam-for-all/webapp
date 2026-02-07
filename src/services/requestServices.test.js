import { signOffUser } from "./requestServices";
import api from "./api";

// Mock the api module
jest.mock("./api");

describe("requestServices", () => {
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

    it("parses AWS Lambda response format with stringified body", async () => {
      const lambdaResponse = {
        data: {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: "User deleted successfully",
            data: { userId: "SID-00-000-001" },
          }),
        },
      };
      api.request.mockResolvedValue(lambdaResponse);

      const result = await signOffUser("SID-00-000-001", "Test reason");

      expect(result).toEqual({
        success: true,
        message: "User deleted successfully",
        data: { userId: "SID-00-000-001" },
      });
    });

    it("returns data directly when body is not a string", async () => {
      const directResponse = {
        data: {
          success: true,
          message: "Deleted",
        },
      };
      api.request.mockResolvedValue(directResponse);

      const result = await signOffUser("SID-00-000-001");

      expect(result).toEqual({ success: true, message: "Deleted" });
    });

    it("handles API error", async () => {
      api.request.mockRejectedValue(new Error("Network error"));

      await expect(signOffUser("SID-00-000-001")).rejects.toThrow(
        "Network error",
      );
    });
  });
});
