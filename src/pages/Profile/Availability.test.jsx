import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import Availability from "./Availability";
import {
  fetchUserAvailability,
  updateUserAvailability,
} from "../../services/volunteerServices";

const USER_ID = "SID-00-000-000-000-000-260";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en-US" },
  }),
}));

jest.mock("react-redux", () => ({
  useSelector: (selector) =>
    selector({ auth: { user: { userDbId: "SID-00-000-000-000-000-260" } } }),
}));

jest.mock("../../services/volunteerServices", () => ({
  fetchUserAvailability: jest.fn(),
  updateUserAvailability: jest.fn(),
}));

jest.mock("../../common/components/Loading/Loading", () => {
  const MockLoading = () => <div>loading</div>;
  return MockLoading;
});

const apiResponse = (timezone, slots) => ({
  success: true,
  statusCode: 200,
  data: { userId: USER_ID, timezone, slots, lastUpdatedAt: null },
});

const renderAvailability = () =>
  render(<Availability setHasUnsavedChanges={jest.fn()} />);

describe("Profile Availability (issue #2020)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  it("calls Get Availability with the user id and shows the empty state", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse("UTC", []));
    renderAvailability();

    expect(
      await screen.findByText("NO_AVAILABILITY_SLOTS"),
    ).toBeInTheDocument();
    expect(fetchUserAvailability).toHaveBeenCalledWith(USER_ID);
    expect(screen.getByRole("button", { name: "EDIT" })).toBeEnabled();
  });

  it("shows the saved slots returned by the API", async () => {
    fetchUserAvailability.mockResolvedValue(
      apiResponse("America/Chicago", [
        { id: 6, frequency: "Weekdays", startTime: "09:00", endTime: "17:00" },
      ]),
    );
    renderAvailability();

    expect(
      await screen.findByText("YOUR_AVAILABLE_TIME_SLOTS"),
    ).toBeInTheDocument();
    expect(screen.getByText(/WEEKDAYS/)).toBeInTheDocument();
    expect(screen.queryByText("NO_AVAILABILITY_SLOTS")).not.toBeInTheDocument();
  });

  it("saves with an IANA timezone, slots without ids, and empty vacation values", async () => {
    fetchUserAvailability.mockResolvedValue(
      apiResponse("America/Chicago", [
        { id: 6, frequency: "Weekdays", startTime: "09:00", endTime: "17:00" },
      ]),
    );
    updateUserAvailability.mockResolvedValue(
      apiResponse("America/Chicago", [
        { id: 6, frequency: "Weekdays", startTime: "09:00", endTime: "18:00" },
      ]),
    );
    const { container } = renderAvailability();

    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    const endTimeInputs = container.querySelectorAll('input[type="time"]');
    fireEvent.change(endTimeInputs[1], { target: { value: "18:00" } });
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("AVAILABILITY_UPDATED_SUCCESS"),
    );
    expect(updateUserAvailability).toHaveBeenCalledWith(
      USER_ID,
      "America/Chicago",
      [{ frequency: "Weekdays", startTime: "09:00", endTime: "18:00" }],
    );
    // Back in view mode
    expect(screen.getByRole("button", { name: "EDIT" })).toBeInTheDocument();
  });

  it("adds a new slot and sends it in the payload", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse("UTC", []));
    updateUserAvailability.mockResolvedValue(apiResponse("UTC", []));
    const { container } = renderAvailability();

    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    fireEvent.click(screen.getByText("ADD_TIME_SLOT"));
    const [start, end] = container.querySelectorAll('input[type="time"]');
    fireEvent.change(start, { target: { value: "10:00" } });
    fireEvent.change(end, { target: { value: "12:00" } });
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    await waitFor(() => expect(updateUserAvailability).toHaveBeenCalled());
    const [, timezone, slots] = updateUserAvailability.mock.calls[0];
    expect(timezone).not.toMatch(/^(GMT|EST|PST)/);
    expect(slots).toEqual([
      { frequency: "Everyday", startTime: "10:00", endTime: "12:00" },
    ]);
  });

  it("shows an error and stays in edit mode when saving fails", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse("UTC", []));
    updateUserAvailability.mockRejectedValue(new Error("500"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    renderAvailability();

    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("SAVE_ERROR"),
    );
    expect(screen.getByRole("button", { name: "SAVE" })).toBeInTheDocument();
    console.error.mockRestore();
  });

  it("Cancel restores the values loaded from the API", async () => {
    fetchUserAvailability.mockResolvedValue(
      apiResponse("America/Chicago", [
        { id: 6, frequency: "Weekdays", startTime: "09:00", endTime: "17:00" },
      ]),
    );
    renderAvailability();

    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    fireEvent.click(screen.getByRole("button", { name: "REMOVE_TIME_SLOT" }));
    fireEvent.click(screen.getByRole("button", { name: "CANCEL" }));

    const slotsSection = await screen.findByText("YOUR_AVAILABLE_TIME_SLOTS");
    expect(
      within(slotsSection.parentElement).getByText(/WEEKDAYS/),
    ).toBeInTheDocument();
    expect(updateUserAvailability).not.toHaveBeenCalled();
  });

  it("still shows the page if Get Availability fails", async () => {
    fetchUserAvailability.mockRejectedValue(new Error("404"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    renderAvailability();

    expect(
      await screen.findByText("NO_AVAILABILITY_SLOTS"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EDIT" })).toBeEnabled();
    console.error.mockRestore();
  });
});
