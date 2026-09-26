import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import NotificationUI from "./Notifications";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock("react-redux", () => ({
  useSelector: () => ({ user: {} }),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockState = { notifications: [] };

jest.mock("../../context/NotificationContext", () => ({
  useNotifications: () => ({
    dispatch: jest.fn(),
    state: mockState,
  }),
  // Imported by the page but never rendered here, so a stub is enough.
  NotificationProvider: jest.fn(),
}));

// Real Pagination, so the rows-per-view control is exercised end to end.
jest.unmock("../../common/components/Pagination/Pagination");

const helpRequest = (id, message) => ({
  id: String(id),
  type: "helpRequest",
  titleKey: "EDUCATIONAL_HELP",
  message,
  date: `Dec ${id}, 2023, 10:30 AM`,
});

const volunteerMatch = (id, message) => ({
  id: String(id),
  type: "Volunteer",
  titleKey: "NEW_MATCH_REQUEST",
  message,
  date: `Mar ${id}, 2023, 10:30 AM`,
});

beforeEach(() => {
  mockState.notifications = [];
  mockNavigate.mockClear();
});

describe("Help Request notifications (ba#41)", () => {
  // TC_NOTIF_HR_001 - the selected tab is dark blue with white text
  it("highlights the Help Request tab when it is selected", () => {
    render(<NotificationUI />);

    const helpTab = screen.getByRole("button", { name: "HELP_REQUEST_BUTTON" });
    expect(helpTab).not.toHaveClass("bg-blue-600");

    fireEvent.click(helpTab);

    expect(helpTab).toHaveClass("bg-blue-600");
    expect(helpTab).toHaveClass("text-white");
  });

  // TC_NOTIF_HR_002 - only Help Request rows appear; Volunteer Match is excluded
  it("shows only help request notifications under the Help Request tab", () => {
    mockState.notifications = [
      helpRequest(1, "Need help with tutoring"),
      volunteerMatch(2, "You have a new volunteer match request"),
      helpRequest(3, "Need a ride to the clinic"),
    ];
    render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "HELP_REQUEST_BUTTON" }),
    );

    expect(screen.getByText("Need help with tutoring")).toBeInTheDocument();
    expect(screen.getByText("Need a ride to the clinic")).toBeInTheDocument();
    expect(
      screen.queryByText("You have a new volunteer match request"),
    ).not.toBeInTheDocument();
  });

  // TC_NOTIF_HR_002 - an unrecognised type must not leak into Help Request.
  // The old rule was "anything that is not a Volunteer match", which would.
  it("does not show unrecognised notification types under Help Request", () => {
    mockState.notifications = [
      helpRequest(1, "Need help with tutoring"),
      { ...helpRequest(2, "Some future category"), type: "systemAnnouncement" },
    ];
    render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "HELP_REQUEST_BUTTON" }),
    );

    expect(screen.getByText("Need help with tutoring")).toBeInTheDocument();
    expect(screen.queryByText("Some future category")).not.toBeInTheDocument();
  });

  // TC_NOTIF_HR_002 - the Volunteer Match tab is unchanged by the above
  it("still shows volunteer matches under the Volunteer Match tab", () => {
    mockState.notifications = [
      helpRequest(1, "Need help with tutoring"),
      volunteerMatch(2, "You have a new volunteer match request"),
    ];
    render(<NotificationUI />);

    fireEvent.click(screen.getByRole("button", { name: "VOLUNTEER_MATCH" }));

    expect(
      screen.getByText("You have a new volunteer match request"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Need help with tutoring"),
    ).not.toBeInTheDocument();
  });

  // TC_NOTIF_HR_003 - empty Help Request tab reports zero entries, no stray rows
  it("reports zero entries when the Help Request tab is empty", () => {
    mockState.notifications = [
      volunteerMatch(1, "You have a new volunteer match request"),
    ];
    render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "HELP_REQUEST_BUTTON" }),
    );

    expect(screen.getByText(/Showing data .*of 0 entries/)).toBeInTheDocument();
    expect(
      screen.queryByText("You have a new volunteer match request"),
    ).not.toBeInTheDocument();
  });

  // TC_NOTIF_HR_004 - rows per view changes how many rows render
  it("honours the rows per view selection", () => {
    mockState.notifications = Array.from({ length: 15 }, (_, i) =>
      helpRequest(i + 1, `Help request ${i + 1}`),
    );
    render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "HELP_REQUEST_BUTTON" }),
    );

    expect(
      screen.getByText(/Showing data 1-5 of 15 entries/),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Rows per view:"), {
      target: { value: "10" },
    });

    expect(
      screen.getByText(/Showing data 1-10 of 15 entries/),
    ).toBeInTheDocument();
  });

  // TC_NOTIF_HR_006 - the gear opens notification preferences
  it("opens notification preferences from the settings gear", () => {
    render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "NOTIFICATION_SETTINGS" }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/profile", {
      state: { tab: "preferences" },
    });
  });

  // TC_NOTIF_HR_007 - a notification arriving in context shows without a reload
  it("renders a newly arrived help request without a remount", () => {
    mockState.notifications = [];
    const { rerender } = render(<NotificationUI />);

    fireEvent.click(
      screen.getByRole("button", { name: "HELP_REQUEST_BUTTON" }),
    );
    expect(screen.getByText(/Showing data .*of 0 entries/)).toBeInTheDocument();

    // The Navbar poll writes into the shared NotificationContext; the page
    // re-renders from that same state rather than refetching on its own.
    mockState.notifications = [helpRequest(1, "Need a ride to the clinic")];
    rerender(<NotificationUI />);

    expect(screen.getByText("Need a ride to the clinic")).toBeInTheDocument();
    expect(
      screen.getByText(/Showing data 1-1 of 1 entries/),
    ).toBeInTheDocument();
  });
});
