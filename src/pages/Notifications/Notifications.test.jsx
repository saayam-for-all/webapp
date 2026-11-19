import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotificationUI from "./Notifications";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock("react-redux", () => ({
  useSelector: () => ({ user: {} }),
}));

jest.mock("../../context/NotificationContext", () => ({
  useNotifications: () => ({
    dispatch: jest.fn(),
    state: { notifications: [] },
  }),
  NotificationProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../common/components/Pagination/Pagination", () => () => (
  <div data-testid="pagination" />
));

const mockUpdateNotificationSettings = jest.fn(() => Promise.resolve({}));
jest.mock("../../services/volunteerServices", () => ({
  updateNotificationSettings: (...args) =>
    mockUpdateNotificationSettings(...args),
}));

describe("NotificationUI", () => {
  beforeEach(() => {
    mockUpdateNotificationSettings.mockClear();
  });

  it("renders the notifications page title", () => {
    render(<NotificationUI />);

    expect(
      screen.getByRole("heading", { level: 1, name: "NOTIFICATIONS" }),
    ).toBeInTheDocument();
  });

  it("shows settings view when gear icon is clicked", () => {
    render(<NotificationUI />);

    fireEvent.click(screen.getByRole("button", { name: "" }));

    expect(
      screen.getByRole("heading", { level: 1, name: "NOTIFICATION_SETTINGS" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("NOTIFICATION_SETTINGS_DESCRIPTION"),
    ).toBeInTheDocument();
    expect(screen.getByText("EMAIL_NOTIFICATIONS")).toBeInTheDocument();
  });

  it("navigates back from settings to notifications list", () => {
    render(<NotificationUI />);

    fireEvent.click(screen.getByRole("button", { name: "" }));
    expect(screen.getByText("NOTIFICATION_SETTINGS")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(
      screen.getByRole("heading", { level: 1, name: "NOTIFICATIONS" }),
    ).toBeInTheDocument();
  });

  it("toggles email notification switch", () => {
    render(<NotificationUI />);

    fireEvent.click(screen.getByRole("button", { name: "" }));

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("calls API when save button is clicked", async () => {
    render(<NotificationUI />);

    fireEvent.click(screen.getByRole("button", { name: "" }));

    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);

    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    await waitFor(() => {
      expect(mockUpdateNotificationSettings).toHaveBeenCalledWith({
        emailNotifications: true,
      });
    });
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

    fireEvent.click(screen.getByRole("button", { name: "" }));
    fireEvent.click(screen.getByRole("button", { name: "SAVE" }));

    expect(screen.getByRole("button", { name: "SAVING" })).toBeDisabled();

    resolvePromise({});

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "SAVE" })).not.toBeDisabled();
    });
  });
});
