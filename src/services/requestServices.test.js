import api from "./api";
import {
  moreInformationChat,
  moreInformation,
  generateSubject,
} from "./requestServices";

jest.mock("./api");

describe("requestServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
