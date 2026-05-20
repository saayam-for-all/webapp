import api from "./api";
import {
  moreInformationChat,
  moreInformation,
  generateSubject,
  getAllPaginatedRequests,
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

    it("propagates errors from api", async () => {
      api.get.mockRejectedValue(new Error("Network error"));

      await expect(getAllPaginatedRequests()).rejects.toThrow("Network error");
    });
  });
});
