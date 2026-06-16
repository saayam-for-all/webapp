import { renderHook, act } from "@testing-library/react";
import useScrollableData from "./useScrollableData";
import * as requestServices from "../services/requestServices";

// Mock the request services
jest.mock("../services/requestServices");

describe("useScrollableData", () => {
  const mockResponse = {
    body: [
      { id: "1", name: "Request 1", status: "Open" },
      { id: "2", name: "Request 2", status: "Closed" },
    ],
    totalCount: 2,
    hasMore: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    requestServices.getMyRequests.mockResolvedValue(mockResponse);
    requestServices.getOthersRequests.mockResolvedValue(mockResponse);
    requestServices.getManagedRequests.mockResolvedValue(mockResponse);
    requestServices.getAllRequests.mockResolvedValue(mockResponse);
  });

  it("uses getAllRequests for admin users", async () => {
    const userGroups = ["SystemAdmins"];
    const activeTab = "myRequests";

    const { result } = renderHook(() =>
      useScrollableData(userGroups, activeTab),
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(requestServices.getAllRequests).toHaveBeenCalledWith(1, 50);
  });

  it("uses getManagedRequests for volunteers on managedRequests tab", async () => {
    const userGroups = ["Volunteers"];
    const activeTab = "managedRequests";

    const { result } = renderHook(() =>
      useScrollableData(userGroups, activeTab),
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(requestServices.getManagedRequests).toHaveBeenCalledWith(1, 50);
  });

  it("loads initial data on mount", async () => {
    const userGroups = ["Volunteers"];
    const activeTab = "myRequests";

    const { result } = renderHook(() =>
      useScrollableData(userGroups, activeTab),
    );

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse.body);
  });

  it("handles API errors gracefully", async () => {
    const userGroups = ["Volunteers"];
    const activeTab = "myRequests";
    const errorMessage = "API Error";

    requestServices.getMyRequests.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() =>
      useScrollableData(userGroups, activeTab),
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isLoading).toBe(false);
  });
});
