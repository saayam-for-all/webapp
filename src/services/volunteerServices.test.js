import api from "./api";
import {
  uploadProfileImage,
  deleteProfileImage,
  fetchProfileImage,
  signOffUser,
  getUserId,
  getVolunteerOrgsList,
  getVolunteerSkills,
  createVolunteer,
  updateVolunteer,
  getVolunteersData,
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

describe("getVolunteerSkills", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls GET and returns response.data", async () => {
    const mockSkills = ["cooking", "driving", "tutoring"];
    api.get.mockResolvedValue({ data: mockSkills });

    const result = await getVolunteerSkills();

    expect(api.get).toHaveBeenCalledWith("v1/volunteer/skills");
    expect(result).toEqual(mockSkills);
  });

  it("throws error when API call fails", async () => {
    api.get.mockRejectedValue(new Error("Network error"));

    await expect(getVolunteerSkills()).rejects.toThrow("Network error");
  });
});

describe("createVolunteer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls POST with volunteer data and returns response.data", async () => {
    const volunteerData = { name: "John", email: "john@test.com" };
    const mockResponse = { success: true, id: "V-123" };
    api.post.mockResolvedValue({ data: mockResponse });

    const result = await createVolunteer(volunteerData);

    expect(api.post).toHaveBeenCalledWith(
      "v1/volunteer/createNewVolunteer",
      volunteerData,
    );
    expect(result).toEqual(mockResponse);
  });

  it("throws error when API call fails", async () => {
    api.post.mockRejectedValue(new Error("Create failed"));

    await expect(createVolunteer({})).rejects.toThrow("Create failed");
  });
});

describe("updateVolunteer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls PUT with volunteer data and returns response.data", async () => {
    const volunteerData = { id: "V-123", name: "John Updated" };
    const mockResponse = { success: true };
    api.put.mockResolvedValue({ data: mockResponse });

    const result = await updateVolunteer(volunteerData);

    expect(api.put).toHaveBeenCalledWith(
      "v1/volunteer/updateVolunteer",
      volunteerData,
    );
    expect(result).toEqual(mockResponse);
  });

  it("throws error when API call fails", async () => {
    api.put.mockRejectedValue(new Error("Update failed"));

    await expect(updateVolunteer({})).rejects.toThrow("Update failed");
  });
});

describe("getVolunteersData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns body array when data.body is array", async () => {
    const mockBody = [{ id: 1 }, { id: 2 }];
    api.get.mockResolvedValue({ data: { body: mockBody } });

    const result = await getVolunteersData();

    expect(api.get).toHaveBeenCalledWith("v1/volunteer/getVolunteersData");
    expect(result).toEqual(mockBody);
  });

  it("returns data directly when data is array", async () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    api.get.mockResolvedValue({ data: mockData });

    const result = await getVolunteersData();

    expect(result).toEqual(mockData);
  });

  it("returns empty array when data is not array", async () => {
    api.get.mockResolvedValue({ data: { something: "else" } });

    const result = await getVolunteersData();

    expect(result).toEqual([]);
  });

  it("throws error when API call fails", async () => {
    api.get.mockRejectedValue(new Error("Fetch failed"));

    await expect(getVolunteersData()).rejects.toThrow("Fetch failed");
  });
});

describe("getVolunteerOrgsList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls POST with the provided payload", async () => {
    const mockResponse = { data: { body: [] } };
    api.post.mockResolvedValue(mockResponse);

    const payload = {
      category: "Food",
      subject: "Food Assistance",
      description: "Need food help",
      location: "Tampa, FL",
    };

    await getVolunteerOrgsList(payload);

    expect(api.post).toHaveBeenCalledWith("v1/ml/orgAggregatorList", payload);
  });

  it("returns response.data directly", async () => {
    const mockData = {
      statusCode: 200,
      body: [
        { name: "Org 1", location: "FL", db_or_ai: "db" },
        { name: "Org 2", location: "CA", db_or_ai: "ai" },
      ],
    };
    api.post.mockResolvedValue({ data: mockData });

    const result = await getVolunteerOrgsList({ category: "Food" });

    expect(result).toEqual(mockData);
  });

  it("throws error when API call fails", async () => {
    api.post.mockRejectedValue(new Error("Network error"));

    await expect(getVolunteerOrgsList({ category: "Food" })).rejects.toThrow(
      "Network error",
    );
  });

  it("handles empty payload", async () => {
    const mockResponse = { data: { body: [] } };
    api.post.mockResolvedValue(mockResponse);

    const result = await getVolunteerOrgsList({});

    expect(api.post).toHaveBeenCalledWith("v1/ml/orgAggregatorList", {});
    expect(result).toEqual({ body: [] });
  });
});
