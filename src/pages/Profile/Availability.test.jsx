import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Availability from "./Availability";
import {
  fetchAvailability,
  saveAvailability,
} from "../../services/availabilityService";

jest.mock("../../services/availabilityService", () => ({
  fetchAvailability: jest.fn(),
  saveAvailability: jest.fn(),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) =>
      (options?.defaultValue || key).replace(
        "{{number}}",
        options?.number || "",
      ),
    i18n: { language: "en-US" },
  }),
}));
const empty = {
  userId: "u1",
  timezone: "UTC",
  slots: [],
  lastUpdatedAt: null,
};
const persisted = {
  ...empty,
  timezone: "UTC",
  slots: [{ frequency: "Monday", startTime: "18:00", endTime: "20:00" }],
};
function mount() {
  const store = configureStore({
    reducer: {
      auth: (state = { user: { userDbId: "u1" } }, action) =>
        action.type === "switch"
          ? { user: { userDbId: action.payload } }
          : state,
    },
  });
  const view = render(
    <Provider store={store}>
      <Availability setHasUnsavedChanges={jest.fn()} />
    </Provider>,
  );
  return { store, ...view };
}
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  fetchAvailability.mockResolvedValue(empty);
  saveAvailability.mockResolvedValue({ ...empty, timezone: "UTC", version: 0 });
  jest.spyOn(window, "confirm").mockReturnValue(true);
});
afterEach(() => jest.restoreAllMocks());
async function edit() {
  fireEvent.click(await screen.findByRole("button", { name: "EDIT" }));
}

test("loads from the API and ignores a previous account's browser storage", async () => {
  localStorage.setItem(
    "availabilityData",
    JSON.stringify({ slots: [{ frequency: "PRIVATE-OTHER-USER" }] }),
  );
  mount();
  expect(await screen.findByText("NO_AVAILABILITY_SLOTS")).toBeInTheDocument();
  expect(fetchAvailability).toHaveBeenCalledWith("u1");
  expect(screen.queryByText("PRIVATE-OTHER-USER")).not.toBeInTheDocument();
});
test("preserves explicit UTC and saved times in edit mode", async () => {
  fetchAvailability.mockResolvedValue(persisted);
  mount();
  await edit();
  expect(screen.getByLabelText("TIMEZONE")).toHaveValue("UTC");
  expect(screen.getByLabelText("Slot 1 start time")).toHaveValue("18:00");
});
test("awaits the server before showing save success", async () => {
  let resolve;
  saveAvailability.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  mount();
  await edit();
  fireEvent.click(screen.getByText("SAVE"));
  expect(screen.getByRole("button", { name: /SAVE/ })).toBeDisabled();
  expect(
    screen.queryByText("AVAILABILITY_UPDATED_SUCCESS"),
  ).not.toBeInTheDocument();
  await act(async () => resolve({ ...empty, timezone: "UTC", version: 0 }));
  expect(
    await screen.findByText("AVAILABILITY_UPDATED_SUCCESS"),
  ).toBeInTheDocument();
});
test("failed save retains edits and allows retry", async () => {
  saveAvailability.mockRejectedValueOnce(new Error("offline"));
  fetchAvailability.mockResolvedValue(persisted);
  mount();
  await edit();
  fireEvent.change(screen.getByLabelText("Slot 1 start time"), {
    target: { value: "17:00" },
  });
  fireEvent.click(screen.getByText("SAVE"));
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(screen.getByLabelText("Slot 1 start time")).toHaveValue("17:00");
  fireEvent.click(screen.getByText("SAVE"));
  await waitFor(() => expect(saveAvailability).toHaveBeenCalledTimes(2));
});
test("cancel restores the server snapshot and makes no write", async () => {
  fetchAvailability.mockResolvedValue(persisted);
  mount();
  await edit();
  fireEvent.click(screen.getByLabelText("REMOVE_TIME_SLOT"));
  fireEvent.click(screen.getByText("CANCEL"));
  expect(window.confirm).toHaveBeenCalled();
  expect(saveAvailability).not.toHaveBeenCalled();
  await edit();
  expect(screen.getByLabelText("Slot 1 start time")).toHaveValue("18:00");
});
test("allows an overnight slot and sends it to the backend", async () => {
  fetchAvailability.mockResolvedValue(persisted);
  mount();
  await edit();
  fireEvent.change(screen.getByLabelText("Slot 1 end time"), {
    target: { value: "17:00" },
  });
  fireEvent.click(screen.getByText("SAVE"));
  await waitFor(() =>
    expect(saveAvailability).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({
        slots: [
          expect.objectContaining({ startTime: "18:00", endTime: "17:00" }),
        ],
      }),
    ),
  );
});
test("disables vacation settings rather than claiming they are persisted", async () => {
  mount();
  await edit();
  expect(screen.getByRole("checkbox")).toBeDisabled();
  expect(
    screen.getByText(/Vacation settings are not available yet/),
  ).toBeInTheDocument();
  expect(saveAvailability).not.toHaveBeenCalled();
});
test("load failures allow retry without presenting an editable empty schedule", async () => {
  fetchAvailability.mockRejectedValueOnce(new Error("offline"));
  mount();
  fireEvent.click(await screen.findByText("Retry"));
  expect(await screen.findByText("NO_AVAILABILITY_SLOTS")).toBeInTheDocument();
  expect(fetchAvailability).toHaveBeenCalledTimes(2);
});
test("switching accounts hides the old schedule while loading", async () => {
  fetchAvailability
    .mockResolvedValueOnce(persisted)
    .mockImplementationOnce(() => new Promise(() => {}));
  const { store } = mount();
  await edit();
  act(() => store.dispatch({ type: "switch", payload: "u2" }));
  expect(screen.queryByLabelText("Slot 1 start time")).not.toBeInTheDocument();
  expect(screen.getByText("Loading availability...")).toBeInTheDocument();
});
test("conflict keeps edits and offers an explicit reload", async () => {
  saveAvailability.mockRejectedValue({ response: { status: 409 } });
  mount();
  await edit();
  fireEvent.click(screen.getByText("SAVE"));
  expect(await screen.findByText("Reload")).toBeInTheDocument();
  expect(screen.getByText("SAVE")).toBeInTheDocument();
});

test("shows backend overlap validation without discarding the edits", async () => {
  saveAvailability.mockRejectedValueOnce({
    response: {
      status: 400,
      data: { message: "slots[0] and slots[1] overlap on Monday" },
    },
  });
  fetchAvailability.mockResolvedValue({
    ...persisted,
    slots: [
      { frequency: "Weekdays", startTime: "09:00", endTime: "11:00" },
      { frequency: "Monday", startTime: "10:00", endTime: "12:00" },
    ],
  });
  mount();
  await edit();
  fireEvent.click(screen.getByText("SAVE"));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "overlap on Monday",
  );
  expect(saveAvailability).toHaveBeenCalledTimes(1);
  expect(screen.getByText("SAVE")).toBeInTheDocument();
});

test("clearing slots sends an empty list", async () => {
  fetchAvailability.mockResolvedValue(persisted);
  mount();
  await edit();
  fireEvent.click(screen.getByLabelText("REMOVE_TIME_SLOT"));
  fireEvent.click(screen.getByText("SAVE"));
  await waitFor(() =>
    expect(saveAvailability).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ slots: [] }),
    ),
  );
});

test.each([
  ["", "AVAILABILITY_VALIDATION_ERROR"],
  ["20:00", "START_END_TIMES_MUST_BE_DIFFERENT"],
])(
  "blocks invalid slot start %s without calling the API",
  async (startTime, message) => {
    fetchAvailability.mockResolvedValue(persisted);
    mount();
    await edit();
    fireEvent.change(screen.getByLabelText("Slot 1 start time"), {
      target: { value: startTime },
    });
    fireEvent.click(screen.getByText("SAVE"));
    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    expect(saveAvailability).not.toHaveBeenCalled();
    expect(screen.getByText("SAVE")).toBeEnabled();
  },
);

test("adds a slot and rejects more than twenty slots without writing", async () => {
  mount();
  await edit();
  for (let i = 0; i < 21; i++)
    fireEvent.click(screen.getByText("ADD_TIME_SLOT"));
  expect(screen.getByLabelText("Slot 21 start time")).toBeInTheDocument();
  fireEvent.click(screen.getByText("SAVE"));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "You can save up to 20 time slots.",
  );
  expect(saveAvailability).not.toHaveBeenCalled();
});

test("declining Cancel preserves unsaved edits", async () => {
  window.confirm.mockReturnValue(false);
  fetchAvailability.mockResolvedValue(persisted);
  mount();
  await edit();
  fireEvent.change(screen.getByLabelText("Slot 1 start time"), {
    target: { value: "17:00" },
  });
  fireEvent.click(screen.getByText("CANCEL"));
  expect(screen.getByLabelText("Slot 1 start time")).toHaveValue("17:00");
  expect(saveAvailability).not.toHaveBeenCalled();
});

test("signing out shows a sign-in message without fetching another schedule", async () => {
  const { store } = mount();
  await edit();
  act(() => store.dispatch({ type: "switch", payload: null }));
  expect(screen.getByText("Sign in to view availability.")).toBeInTheDocument();
  expect(fetchAvailability).toHaveBeenCalledTimes(1);
});

test("uses the detected timezone when requested", async () => {
  mount();
  await edit();
  fireEvent.click(screen.getByText("USE_CURRENT_TIMEZONE"));
  expect(screen.getByLabelText("TIMEZONE")).toHaveValue(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
});
