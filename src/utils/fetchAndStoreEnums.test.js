import { fetchAndStoreEnums } from "./fetchAndStoreEnums";
import { getEnums } from "../services/requestServices";

jest.mock("../services/requestServices", () => ({
  getEnums: jest.fn(),
}));

describe("fetchAndStoreEnums", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("does not call getEnums when no token exists in localStorage", async () => {
    await fetchAndStoreEnums();
    expect(getEnums).not.toHaveBeenCalled();
  });

  it("does not store anything in localStorage when no token exists", async () => {
    await fetchAndStoreEnums();
    expect(localStorage.getItem("enums")).toBeNull();
  });

  it("calls getEnums and stores result in localStorage when token exists", async () => {
    localStorage.setItem("token", "fake-token");
    const mockEnumsData = { requestStatus: ["CREATED", "RESOLVED"] };
    getEnums.mockResolvedValue(mockEnumsData);

    await fetchAndStoreEnums();

    expect(getEnums).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("enums")).toBe(JSON.stringify(mockEnumsData));
  });

  it("logs an error and does not throw when getEnums fails", async () => {
    localStorage.setItem("token", "fake-token");
    getEnums.mockRejectedValue(new Error("Network error"));
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(fetchAndStoreEnums()).resolves.not.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to fetch enums:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });

  it("does not store anything in localStorage when getEnums fails", async () => {
    localStorage.setItem("token", "fake-token");
    getEnums.mockRejectedValue(new Error("Network error"));
    jest.spyOn(console, "error").mockImplementation(() => {});

    await fetchAndStoreEnums();

    expect(localStorage.getItem("enums")).toBeNull();
  });
});
