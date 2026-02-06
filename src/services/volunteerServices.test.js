import api from "./api";
import { getUserId } from "./volunteerServices";

jest.mock("./api");

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
