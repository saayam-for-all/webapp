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
  convertUserAvailabilityTimezone,
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
  convertUserAvailabilityTimezone: jest.fn(),
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

    // Issue #51 FR-14: the error is shown in the form with a Retry button
    expect(await screen.findByText("SAVE_ERROR")).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "SAVE" })).toBeInTheDocument();

    updateUserAvailability.mockResolvedValue(apiResponse("UTC", []));
    fireEvent.click(screen.getByRole("button", { name: "RETRY" }));
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("AVAILABILITY_UPDATED_SUCCESS"),
    );
    expect(updateUserAvailability).toHaveBeenCalledTimes(2);
    console.error.mockRestore();
  });

  it("Cancel restores the values loaded from the API", async () => {
    fetchUserAvailability.mockResolvedValue(
      apiResponse("America/Chicago", [
        { id: 6, frequency: "Weekdays", startTime: "09:00", endTime: "17:00" },
      ]),
    );
    renderAvailability();
    // Issue #51 FR-12: Cancel now asks before discarding; the user agrees.
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    fireEvent.click(screen.getByRole("button", { name: "REMOVE_TIME_SLOT" }));
    fireEvent.click(screen.getByRole("button", { name: "CANCEL" }));
    expect(confirmSpy).toHaveBeenCalledWith("DISCARD_CHANGES_CONFIRM");
    confirmSpy.mockRestore();

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

describe("Profile Availability BRD fixes (issue #51)", () => {
  const DETECTED = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // A saved timezone guaranteed to differ from the test machine's timezone
  const OTHER_TZ = DETECTED === "Asia/Tokyo" ? "America/Chicago" : "Asia/Tokyo";

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("FR-16: shows a loading message while availability is being fetched", async () => {
    let resolveFetch;
    fetchUserAvailability.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );
    renderAvailability();

    expect(screen.getByText("LOADING_AVAILABILITY")).toBeInTheDocument();
    expect(screen.queryByText("NO_AVAILABILITY_SLOTS")).not.toBeInTheDocument();

    resolveFetch(apiResponse("UTC", []));
    expect(
      await screen.findByText("NO_AVAILABILITY_SLOTS"),
    ).toBeInTheDocument();
    expect(screen.queryByText("LOADING_AVAILABILITY")).not.toBeInTheDocument();
  });

  it("FR-17: shows when availability was last updated", async () => {
    fetchUserAvailability.mockResolvedValue({
      ...apiResponse(DETECTED, []),
      data: {
        userId: USER_ID,
        timezone: DETECTED,
        slots: [],
        lastUpdatedAt: "2026-11-20T18:30:00Z",
      },
    });
    renderAvailability();

    expect(await screen.findByText(/LAST_UPDATED:/)).toBeInTheDocument();
  });

  it("FR-17: hides last updated when the API has no date", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse("UTC", []));
    renderAvailability();

    await screen.findByText("NO_AVAILABILITY_SLOTS");
    expect(screen.queryByText(/LAST_UPDATED/)).not.toBeInTheDocument();
  });

  it("FR-18: shows the timezone next to each slot and logs no console error", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    fetchUserAvailability.mockResolvedValue(
      apiResponse("America/Chicago", [
        { id: 6, frequency: "Weekdays", startTime: "09:00", endTime: "17:00" },
      ]),
    );
    renderAvailability();

    const slotText = await screen.findByText(/WEEKDAYS/);
    expect(slotText.closest("p").textContent).toMatch(/\(.+\)/);
    expect(slotText.closest("p").textContent).toMatch(/AM|PM/i);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("FR-13: rejects an end time before the start time (no overnight slots)", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse("UTC", []));
    const { container } = renderAvailability();

    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    fireEvent.click(screen.getByText("ADD_TIME_SLOT"));
    const [start, end] = container.querySelectorAll('input[type="time"]');
    fireEvent.change(start, { target: { value: "22:00" } });
    fireEvent.change(end, { target: { value: "02:00" } });
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    expect(
      await screen.findByText("END_TIME_MUST_BE_AFTER_START_TIME"),
    ).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
    expect(updateUserAvailability).not.toHaveBeenCalled();
  });

  it("FR-13: shows missing-field errors inline instead of a pop-up", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse("UTC", []));
    renderAvailability();

    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    fireEvent.click(screen.getByText("ADD_TIME_SLOT"));
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    expect(
      await screen.findByText("AVAILABILITY_VALIDATION_ERROR"),
    ).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
    expect(updateUserAvailability).not.toHaveBeenCalled();
  });

  it("FR-12: Cancel with no changes does not ask", async () => {
    const confirmSpy = jest.spyOn(window, "confirm");
    fetchUserAvailability.mockResolvedValue(apiResponse("UTC", []));
    renderAvailability();

    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    fireEvent.click(screen.getByRole("button", { name: "CANCEL" }));

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "EDIT" })).toBeInTheDocument();
  });

  it("FR-12: keeps the changes when the user says no to discarding", async () => {
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);
    fetchUserAvailability.mockResolvedValue(apiResponse("UTC", []));
    renderAvailability();

    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    fireEvent.click(screen.getByText("ADD_TIME_SLOT"));
    fireEvent.click(screen.getByRole("button", { name: "CANCEL" }));

    expect(confirmSpy).toHaveBeenCalledWith("DISCARD_CHANGES_CONFIRM");
    // Still in edit mode with the new slot
    expect(screen.getByRole("button", { name: "SAVE" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "REMOVE_TIME_SLOT" }),
    ).toBeInTheDocument();
  });

  it("FR-07: Cancel does not reset the timezone to UTC when none was saved", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    fetchUserAvailability.mockResolvedValue(apiResponse("UTC", []));
    renderAvailability();

    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    fireEvent.click(screen.getByText("ADD_TIME_SLOT"));
    fireEvent.click(screen.getByRole("button", { name: "CANCEL" }));
    fireEvent.click(screen.getByRole("button", { name: "EDIT" }));

    expect(screen.getByLabelText("TIMEZONE")).toHaveValue(DETECTED);
  });

  it("FR-19: offers to switch when the saved timezone is not the current one", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse(OTHER_TZ, []));
    renderAvailability();

    expect(
      await screen.findByText("TIMEZONE_MISMATCH_NOTICE"),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "USE_CURRENT_TIMEZONE" }),
    );

    // Opens the edit form with the detected timezone selected
    expect(screen.getByLabelText("TIMEZONE")).toHaveValue(DETECTED);
    expect(screen.getByRole("button", { name: "SAVE" })).toBeInTheDocument();
  });

  it("FR-19: no notice when the saved timezone matches the current one", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse(DETECTED, []));
    renderAvailability();

    await screen.findByText("NO_AVAILABILITY_SLOTS");
    expect(
      screen.queryByText("TIMEZONE_MISMATCH_NOTICE"),
    ).not.toBeInTheDocument();
  });
});

describe("Profile Availability timezone change (ba #51, volunteer #235)", () => {
  const DETECTED = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const SAVED_TZ =
    DETECTED === "America/New_York" ? "Asia/Tokyo" : "America/New_York";
  const NEW_TZ =
    DETECTED === "America/Chicago" ? "Asia/Tokyo" : "America/Chicago";
  const savedSlots = [
    { id: 3, frequency: "Monday", startTime: "21:00", endTime: "23:00" },
  ];

  const openEditAndPickTimezone = async (tz) => {
    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    fireEvent.change(screen.getByLabelText("TIMEZONE"), {
      target: { value: tz },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sends only userId and timezone and shows the converted slots", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse(SAVED_TZ, savedSlots));
    convertUserAvailabilityTimezone.mockResolvedValue(
      apiResponse(NEW_TZ, [
        { id: 3, frequency: "Monday", startTime: "20:00", endTime: "22:00" },
      ]),
    );
    renderAvailability();

    await openEditAndPickTimezone(NEW_TZ);
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("TIMEZONE_CONVERTED_SUCCESS"),
    );
    expect(convertUserAvailabilityTimezone).toHaveBeenCalledWith(
      USER_ID,
      NEW_TZ,
    );
    expect(updateUserAvailability).not.toHaveBeenCalled();
    // Converted hours from the API are shown in the read view
    const slotText = screen.getByText(/MONDAY/).closest("p").textContent;
    expect(slotText).toMatch(/08:00\s?PM/i);
    expect(slotText).toMatch(/10:00\s?PM/i);
  });

  it("does not send a new timezone together with edited slots", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse(SAVED_TZ, savedSlots));
    const { container } = renderAvailability();

    await openEditAndPickTimezone(NEW_TZ);
    const endTimeInputs = container.querySelectorAll('input[type="time"]');
    fireEvent.change(endTimeInputs[1], { target: { value: "23:30" } });
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    expect(
      await screen.findByText("TIMEZONE_CHANGE_SAVE_SEPARATELY"),
    ).toBeInTheDocument();
    expect(convertUserAvailabilityTimezone).not.toHaveBeenCalled();
    expect(updateUserAvailability).not.toHaveBeenCalled();
    // Edits are kept
    expect(endTimeInputs[1]).toHaveValue("23:30");
  });

  it("allows clearing all slots while changing timezone in one save", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse(SAVED_TZ, savedSlots));
    updateUserAvailability.mockResolvedValue(apiResponse(NEW_TZ, []));
    renderAvailability();

    await openEditAndPickTimezone(NEW_TZ);
    fireEvent.click(screen.getByRole("button", { name: "REMOVE_TIME_SLOT" }));
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    await waitFor(() =>
      expect(updateUserAvailability).toHaveBeenCalledWith(USER_ID, NEW_TZ, []),
    );
    expect(convertUserAvailabilityTimezone).not.toHaveBeenCalled();
  });

  it("shows the review dialog when the conversion would cross midnight", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse(SAVED_TZ, savedSlots));
    convertUserAvailabilityTimezone.mockRejectedValue({
      response: {
        status: 400,
        data: {
          message:
            "timezone: converted availability crosses midnight or reverses clock times; review the schedule before changing timezone",
        },
      },
    });
    renderAvailability();

    await openEditAndPickTimezone(NEW_TZ);
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    expect(
      screen.getByText("SLOTS_NEED_ATTENTION_MESSAGE"),
    ).toBeInTheDocument();

    // "Edit slots" goes back to the saved timezone, still in edit mode,
    // with the saved slots unchanged
    fireEvent.click(screen.getByRole("button", { name: "EDIT_SLOTS" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("TIMEZONE")).toHaveValue(SAVED_TZ);
    expect(screen.getByRole("button", { name: "SAVE" })).toBeInTheDocument();
    expect(updateUserAvailability).not.toHaveBeenCalled();
  });

  it("shows the API validation message, keeps edits and offers no retry for a 400", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse(SAVED_TZ, savedSlots));
    updateUserAvailability.mockRejectedValue({
      response: {
        status: 400,
        data: { message: "slots[0] and slots[1] overlap on MONDAY" },
      },
    });
    const { container } = renderAvailability();

    fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
    fireEvent.click(screen.getByText("ADD_TIME_SLOT"));
    const inputs = container.querySelectorAll('input[type="time"]');
    fireEvent.change(inputs[2], { target: { value: "22:00" } });
    fireEvent.change(inputs[3], { target: { value: "22:30" } });
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    expect(
      await screen.findByText("slots[0] and slots[1] overlap on MONDAY"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "RETRY" }),
    ).not.toBeInTheDocument();
    expect(inputs[2]).toHaveValue("22:00");
    expect(screen.getByRole("button", { name: "SAVE" })).toBeInTheDocument();
  });

  it("the timezone notice button converts the saved schedule", async () => {
    fetchUserAvailability.mockResolvedValue(apiResponse(SAVED_TZ, savedSlots));
    convertUserAvailabilityTimezone.mockResolvedValue(
      apiResponse(DETECTED, savedSlots),
    );
    renderAvailability();

    fireEvent.click(
      await screen.findByRole("button", { name: "USE_CURRENT_TIMEZONE" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    await waitFor(() =>
      expect(convertUserAvailabilityTimezone).toHaveBeenCalledWith(
        USER_ID,
        DETECTED,
      ),
    );
    expect(updateUserAvailability).not.toHaveBeenCalled();
  });
});
