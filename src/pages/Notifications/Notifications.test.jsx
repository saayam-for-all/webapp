import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotificationUI from "./Notifications";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock("react-redux", () => ({
  useSelector: (select) => select({ auth: { userDBId: "SID-123" } }),
}));

jest.mock("../../context/NotificationContext", () => ({
  useNotifications: () => ({
    dispatch: jest.fn(),
    state: { notifications: [] },
  }),
}));

jest.mock("../../common/components/Pagination/Pagination", () => {
  return function MockPagination() {
    return <div data-testid="pagination" />;
  };
});

const mockGetNotificationSettings = jest.fn();
const mockUpdateNotificationSettings = jest.fn(() => Promise.resolve({}));
jest.mock("../../services/volunteerServices", () => ({
  getNotificationSettings: (...args) => mockGetNotificationSettings(...args),
  updateNotificationSettings: (...args) =>
    mockUpdateNotificationSettings(...args),
}));

describe("NotificationUI", () => {
  beforeEach(() => {
    mockGetNotificationSettings.mockReset().mockResolvedValue(null);
    mockUpdateNotificationSettings.mockReset().mockResolvedValue({});
  });

  it("renders the notifications page title", () => {
    render(<NotificationUI />);

    expect(
      screen.getByRole("heading", { level: 1, name: "NOTIFICATIONS" }),
    ).toBeInTheDocument();
  });

  it("shows settings view when gear icon is clicked", async () => {
    render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "NOTIFICATION_SETTINGS" }),
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "NOTIFICATION_SETTINGS" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("NOTIFICATION_SETTINGS_DESCRIPTION"),
    ).toBeInTheDocument();
    expect(screen.getByText("EMAIL_NOTIFICATIONS")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("switch")).toBeEnabled());
  });

  it("navigates back from settings to notifications list", () => {
    render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "NOTIFICATION_SETTINGS" }),
    );
    expect(screen.getByText("NOTIFICATION_SETTINGS")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "BACK" }));

    expect(
      screen.getByRole("heading", { level: 1, name: "NOTIFICATIONS" }),
    ).toBeInTheDocument();
  });

  it("toggles email notification switch", async () => {
    render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "NOTIFICATION_SETTINGS" }),
    );

    const toggle = screen.getByRole("switch");
    await waitFor(() => expect(toggle).toBeEnabled());
    expect(toggle).toHaveAttribute("aria-checked", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it.each([
    [null, "email"],
    ["email", null],
  ])("loads %p and saves the toggled preference %p", async (saved, updated) => {
    mockGetNotificationSettings.mockResolvedValue(saved);
    render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "NOTIFICATION_SETTINGS" }),
    );
    expect(mockGetNotificationSettings).toHaveBeenCalledWith("SID-123");

    const toggle = screen.getByRole("switch");
    expect(toggle).toBeDisabled();
    await waitFor(() => expect(toggle).toBeEnabled());
    expect(toggle).toHaveAttribute("aria-checked", String(saved === "email"));

    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    expect(mockUpdateNotificationSettings).toHaveBeenCalledWith(
      "SID-123",
      updated,
    );
    expect(
      await screen.findByText("NOTIFICATION_SETTINGS_SAVED"),
    ).toBeInTheDocument();
  });

  it("prevents saving when the preference could not be loaded", async () => {
    mockGetNotificationSettings.mockRejectedValue(new Error("Request failed"));
    render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "NOTIFICATION_SETTINGS" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "NOTIFICATION_SETTINGS_LOAD_ERROR",
    );
    expect(screen.getByRole("button", { name: "SAVE" })).toBeDisabled();
  });

  it("shows saving state on save button while request is in progress", async () => {
    let resolvePromise;
    mockUpdateNotificationSettings.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "NOTIFICATION_SETTINGS" }),
    );
    const save = screen.getByRole("button", { name: "SAVE" });
    await waitFor(() => expect(save).toBeEnabled());
    fireEvent.click(save);

    expect(screen.getByRole("button", { name: "SAVING" })).toBeDisabled();

    resolvePromise({});

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "SAVE" })).not.toBeDisabled();
    });
  });
});
