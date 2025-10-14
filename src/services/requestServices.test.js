import * as requestServices from "./requestServices";
import api from "./api";

// Mock the api module
jest.mock("./api");

describe("requestServices", () => {
  const mockResponse = {
    data: {
      body: [
        { id: "1", name: "Request 1", status: "Open" },
        { id: "2", name: "Request 2", status: "Closed" },
      ],
      totalCount: 2,
      hasMore: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue(mockResponse);
  });

  describe("getMyRequests", () => {
    it("calls API with default parameters", async () => {
      await requestServices.getMyRequests();

      expect(api.get).toHaveBeenCalledWith("/api/requests/my?page=1&limit=50");
    });

    it("calls API with custom parameters", async () => {
      await requestServices.getMyRequests(2, 25);

      expect(api.get).toHaveBeenCalledWith("/api/requests/my?page=2&limit=25");
    });

    it("returns response data", async () => {
      const result = await requestServices.getMyRequests();

      expect(result).toEqual(mockResponse.data);
    });

    it("handles API errors", async () => {
      const error = new Error("API Error");
      api.get.mockRejectedValue(error);

      await expect(requestServices.getMyRequests()).rejects.toThrow(
        "API Error",
      );
    });
  });

  describe("getOthersRequests", () => {
    it("calls API with default parameters", async () => {
      await requestServices.getOthersRequests();

      expect(api.get).toHaveBeenCalledWith(
        "/api/requests/others?page=1&limit=50",
      );
    });

    it("calls API with custom parameters", async () => {
      await requestServices.getOthersRequests(3, 100);

      expect(api.get).toHaveBeenCalledWith(
        "/api/requests/others?page=3&limit=100",
      );
    });

    it("returns response data", async () => {
      const result = await requestServices.getOthersRequests();

      expect(result).toEqual(mockResponse.data);
    });

    it("handles API errors", async () => {
      const error = new Error("API Error");
      api.get.mockRejectedValue(error);

      await expect(requestServices.getOthersRequests()).rejects.toThrow(
        "API Error",
      );
    });
  });

  describe("getManagedRequests", () => {
    it("calls API with default parameters", async () => {
      await requestServices.getManagedRequests();

      expect(api.get).toHaveBeenCalledWith(
        "/api/requests/managed?page=1&limit=50",
      );
    });

    it("calls API with custom parameters", async () => {
      await requestServices.getManagedRequests(4, 75);

      expect(api.get).toHaveBeenCalledWith(
        "/api/requests/managed?page=4&limit=75",
      );
    });

    it("returns response data", async () => {
      const result = await requestServices.getManagedRequests();

      expect(result).toEqual(mockResponse.data);
    });

    it("handles API errors", async () => {
      const error = new Error("API Error");
      api.get.mockRejectedValue(error);

      await expect(requestServices.getManagedRequests()).rejects.toThrow(
        "API Error",
      );
    });
  });

  describe("getAllRequests", () => {
    it("calls API with default parameters", async () => {
      await requestServices.getAllRequests();

      expect(api.get).toHaveBeenCalledWith(
        "/api/requests/my?page=1&limit=50&all=true",
      );
    });

    it("calls API with custom parameters", async () => {
      await requestServices.getAllRequests(5, 200);

      expect(api.get).toHaveBeenCalledWith(
        "/api/requests/my?page=5&limit=200&all=true",
      );
    });

    it("returns response data", async () => {
      const result = await requestServices.getAllRequests();

      expect(result).toEqual(mockResponse.data);
    });

    it("handles API errors", async () => {
      const error = new Error("API Error");
      api.get.mockRejectedValue(error);

      await expect(requestServices.getAllRequests()).rejects.toThrow(
        "API Error",
      );
    });
  });

  describe("Other service functions", () => {
    beforeEach(() => {
      api.post.mockResolvedValue({ data: { success: true } });
    });

    describe("getComments", () => {
      it("calls API and returns response", async () => {
        await requestServices.getComments();

        expect(api.get).toHaveBeenCalledWith("/api/requests/comments");
      });
    });

    describe("checkProfanity", () => {
      it("calls API with content and returns response", async () => {
        const content = "Test content";
        await requestServices.checkProfanity(content);

        expect(api.post).toHaveBeenCalledWith(
          "/api/requests/check-profanity",
          content,
        );
      });
    });

    describe("createRequest", () => {
      it("calls API with request data and returns response", async () => {
        const request = {
          name: "Test Request",
          description: "Test Description",
        };
        await requestServices.createRequest(request);

        expect(api.post).toHaveBeenCalledWith("/api/requests/create", request);
      });
    });

    describe("getEmergencyContactInfo", () => {
      it("calls API and returns response", async () => {
        await requestServices.getEmergencyContactInfo();

        expect(api.get).toHaveBeenCalledWith("/api/emergency-contact");
      });
    });

    describe("predictCategories", () => {
      it("calls API with request data and returns response", async () => {
        const request = { description: "Test description" };
        await requestServices.predictCategories(request);

        expect(api.post).toHaveBeenCalledWith(
          "/api/requests/predict-categories",
          request,
        );
      });
    });

    describe("GET_NOTIFICATIONS", () => {
      it("calls API and returns response", async () => {
        await requestServices.GET_NOTIFICATIONS();

        expect(api.get).toHaveBeenCalledWith("/api/notifications");
      });
    });

    describe("moreInformation", () => {
      it("calls API with request data and returns response", async () => {
        const request = { id: "1", question: "Test question" };
        await requestServices.moreInformation(request);

        expect(api.post).toHaveBeenCalledWith(
          "/api/requests/generate-answer",
          request,
        );
      });
    });
  });

  describe("Parameter validation", () => {
    it("handles zero page parameter", async () => {
      await requestServices.getMyRequests(0, 50);

      expect(api.get).toHaveBeenCalledWith("/api/requests/my?page=0&limit=50");
    });

    it("handles zero limit parameter", async () => {
      await requestServices.getMyRequests(1, 0);

      expect(api.get).toHaveBeenCalledWith("/api/requests/my?page=1&limit=0");
    });

    it("handles negative parameters", async () => {
      await requestServices.getMyRequests(-1, -50);

      expect(api.get).toHaveBeenCalledWith(
        "/api/requests/my?page=-1&limit=-50",
      );
    });

    it("handles very large parameters", async () => {
      await requestServices.getMyRequests(999999, 999999);

      expect(api.get).toHaveBeenCalledWith(
        "/api/requests/my?page=999999&limit=999999",
      );
    });
  });

  describe("Response structure validation", () => {
    it("handles missing body in response", async () => {
      const responseWithoutBody = {
        data: {
          totalCount: 0,
          hasMore: false,
        },
      };
      api.get.mockResolvedValue(responseWithoutBody);

      const result = await requestServices.getMyRequests();

      expect(result).toEqual(responseWithoutBody.data);
    });

    it("handles missing totalCount in response", async () => {
      const responseWithoutTotalCount = {
        data: {
          body: [],
          hasMore: false,
        },
      };
      api.get.mockResolvedValue(responseWithoutTotalCount);

      const result = await requestServices.getMyRequests();

      expect(result).toEqual(responseWithoutTotalCount.data);
    });

    it("handles missing hasMore in response", async () => {
      const responseWithoutHasMore = {
        data: {
          body: [],
          totalCount: 0,
        },
      };
      api.get.mockResolvedValue(responseWithoutHasMore);

      const result = await requestServices.getMyRequests();

      expect(result).toEqual(responseWithoutHasMore.data);
    });
  });
});
