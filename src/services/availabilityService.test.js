import api from "./api";
import { fetchAvailability, saveAvailability } from "./availabilityService";
jest.mock("./api", () => ({ post: jest.fn(), put: jest.fn() }));

const saved = {
  userId: "u1",
  timezone: "UTC",
  slots: [],
  lastUpdatedAt: "2026-10-23T12:00:00Z",
};
beforeEach(() => jest.clearAllMocks());

test("loads only the requested user's availability", async () => {
  api.post.mockResolvedValue({ data: { success: true, data: saved } });
  expect(await fetchAvailability("u1")).toEqual(saved);
  expect(api.post).toHaveBeenCalledWith("v1/volunteer/availability", {
    userId: "u1",
  });
});
test("sends identity in the body and excludes browser-only IDs and draft version fields", async () => {
  api.put.mockResolvedValue({ data: { success: true, data: saved } });
  await saveAvailability("u1", {
    ...saved,
    vacationMode: false,
    slots: [
      { id: 72, frequency: "Monday", startTime: "09:00", endTime: "10:00" },
    ],
  });
  expect(api.put).toHaveBeenCalledWith("v1/volunteer/availability", {
    userId: "u1",
    timezone: "UTC",
    vacationMode: false,
    vacationStartDate: "",
    vacationEndDate: "",
    slots: [{ frequency: "Monday", startTime: "09:00", endTime: "10:00" }],
  });
});
test.each([
  { success: false, data: saved },
  { success: true, data: {} },
  {
    success: true,
    data: {
      ...saved,
      slots: [{ frequency: "Monday", startTime: "99:00", endTime: "10:00" }],
    },
  },
])("rejects failed or malformed responses", async (body) => {
  api.post.mockResolvedValue({ data: body });
  await expect(fetchAvailability("u1")).rejects.toThrow();
});
test("preserves HTTP conflicts for the UI to handle", async () => {
  const error = { response: { status: 409 } };
  api.put.mockRejectedValue(error);
  await expect(saveAvailability("u1", saved)).rejects.toBe(error);
});

test("rejects a response for a different account", async () => {
  api.post.mockResolvedValue({
    data: { success: true, data: { ...saved, userId: "u2" } },
  });
  await expect(fetchAvailability("u1")).rejects.toThrow("another user");
});

test("accepts the backend's empty state with no lastUpdatedAt", async () => {
  api.post.mockResolvedValue({
    data: { success: true, data: { ...saved, lastUpdatedAt: null } },
  });
  expect((await fetchAvailability("u1")).slots).toEqual([]);
});
