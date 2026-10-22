import api from "./api";
import {
  moreInformationChat,
  moreInformation,
  generateSubject,
  getAdditionalFields,
  getAllPaginatedRequests,
  getMyRequests,
  updateRequest,
} from "./requestServices";

jest.mock("./api");

describe("requestServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateRequest", () => {
    it("calls PUT to UPDATE_HELP_REQUEST with payload and returns data", async () => {
      const mockData = { success: true };
      api.put.mockResolvedValue({ data: mockData });

      const payload = { id: "123", requestSubject: "Help" };
      const result = await updateRequest(payload);

      expect(api.put).toHaveBeenCalledWith(
        "v1/request/updateHelpRequest",
        payload,
      );
      expect(result).toEqual(mockData);
    });

    it("propagates errors from api", async () => {
      api.put.mockRejectedValue(new Error("Network error"));
      await expect(updateRequest({})).rejects.toThrow("Network error");
    });
  });

  describe("getAdditionalFields", () => {
    it("posts the request and requester IDs and returns the response data", async () => {
      const mockData = {
        success: true,
        data: { "1.1.C": "4" },
      };
      api.post.mockResolvedValue({ data: mockData });

      const payload = {
        requestId: "REQ-00-000-000-0467",
        requesterId: "SID-00-000-003-161",
      };
      const result = await getAdditionalFields(payload);

      expect(api.post).toHaveBeenCalledWith(
        "v1/request/getAdditionalFields",
        payload,
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("moreInformationChat", () => {
    it("calls POST to GENERATE_ANSWER_API with payload and returns data", async () => {
      const mockData = { body: { answer: "Here is your answer." } };
      api.post.mockResolvedValue({ data: mockData });

      const payload = {
        category_id: "6.5",
        subject: "Test",
        description: "Test description",
      };
      const result = await moreInformationChat(payload);

      expect(api.post).toHaveBeenCalledWith(
        "v1/genai/generate_answer_api",
        payload,
      );
      expect(result).toEqual(mockData);
    });

    it("propagates errors from api", async () => {
      api.post.mockRejectedValue(new Error("Network error"));

      await expect(moreInformationChat({ category_id: "1.1" })).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("generateSubject", () => {
    it("calls POST to generate_subject_api with description and returns data", async () => {
      const mockData = {
        body: {
          subject: "Grocery Pickup Help",
          max_length: 70,
          description_length: 60,
        },
      };
      api.post.mockResolvedValue({ data: mockData });

      const result = await generateSubject(
        "I need help picking up groceries from the store.",
      );

      expect(api.post).toHaveBeenCalledWith("v1/genai/generate_subject_api", {
        description: "I need help picking up groceries from the store.",
      });
      expect(result).toEqual(mockData);
    });

    it("propagates errors from api", async () => {
      api.post.mockRejectedValue(new Error("Network error"));
      await expect(generateSubject("some description")).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("moreInformation", () => {
    it("calls POST to GENERATE_ANSWER with request and returns data", async () => {
      const mockData = { body: { answer: "Initial response." } };
      api.post.mockResolvedValue({ data: mockData });

      const request = { subject: "Test" };
      const result = await moreInformation(request);

      expect(api.post).toHaveBeenCalledWith(
        "v1/genai/generate_answer",
        request,
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("getMyRequests", () => {
    it("calls POST to help-requests with userId, page, and size", async () => {
      const mockData = {
        data: { content: [{ requestId: "REQ-1" }], totalPages: 1 },
      };
      api.post.mockResolvedValue({ data: mockData });

      const payload = { userId: "SID-00-000-003-016", page: 0, size: 10 };
      const result = await getMyRequests(payload);

      expect(api.post).toHaveBeenCalledWith(
        "v1/request/help-requests",
        payload,
      );
      expect(result).toEqual(mockData);
    });

    it("propagates errors from api", async () => {
      api.post.mockRejectedValue(new Error("Network error"));

      await expect(
        getMyRequests({ userId: "SID-1", page: 0, size: 5 }),
      ).rejects.toThrow("Network error");
    });
  });

  describe("getAllPaginatedRequests", () => {
    it("calls GET with default params (page=0, size=10) and returns data", async () => {
      const mockData = { body: { requests: [{ id: 1 }] } };
      api.get.mockResolvedValue({ data: mockData });

      const result = await getAllPaginatedRequests();

      expect(api.get).toHaveBeenCalledWith("v1/request/help-requests", {
        params: { page: 0, size: 10 },
      });
      expect(result).toEqual(mockData);
    });

    it("calls GET with custom page/size params", async () => {
      const mockData = { body: { requests: [{ id: 2 }] } };
      api.get.mockResolvedValue({ data: mockData });

      const result = await getAllPaginatedRequests({ page: 3, size: 25 });

      expect(api.get).toHaveBeenCalledWith("v1/request/help-requests", {
        params: { page: 3, size: 25 },
      });
      expect(result).toEqual(mockData);
    });

    it("shares an in-flight request for the same page and size", async () => {
      const mockData = { data: { content: [{ requestId: "REQ-1" }] } };
      let resolveRequest;
      api.get.mockReturnValue(
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
      );

      const firstRequest = getAllPaginatedRequests({ page: 0, size: 5 });
      const secondRequest = getAllPaginatedRequests({ page: 0, size: 5 });

      expect(api.get).toHaveBeenCalledTimes(1);

      resolveRequest({ data: mockData });
      await expect(Promise.all([firstRequest, secondRequest])).resolves.toEqual(
        [mockData, mockData],
      );
    });

    it("propagates errors from api", async () => {
      api.get.mockRejectedValue(new Error("Network error"));

      await expect(getAllPaginatedRequests()).rejects.toThrow("Network error");
    });
  });
});
