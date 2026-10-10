import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import NotificationUI from "./Notifications";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock("react-redux", () => ({
  useSelector: () => ({ user: {} }),
}));

const mockState = { notifications: [] };

jest.mock("../../context/NotificationContext", () => ({
  useNotifications: () => ({
    dispatch: jest.fn(),
    state: mockState,
  }),
  NotificationProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../common/components/Pagination/Pagination", () => () => (
  <div data-testid="pagination" />
));

const volunteerNote = {
  id: "1",
  type: "Volunteer",
  titleKey: "NEW_MATCH_REQUEST",
  message: "You have a new volunteer match request",
  date: "Mar 15, 2023, 10:30 AM",
};

const helpRequestNote = {
  id: "2",
  type: "helpRequest",
  titleKey: "EDUCATIONAL_HELP",
  message: "Need help with tutoring",
  date: "Dec 16, 2023, 10:30 AM",
};

beforeEach(() => {
  mockState.notifications = [];
});

describe("NotificationUI", () => {
  it("renders the notifications page title", () => {
    render(<NotificationUI />);

    expect(
      screen.getByRole("heading", { level: 1, name: "NOTIFICATIONS" }),
    ).toBeInTheDocument();
  });

  // ba#39 FR-08 / AC-03
  it("shows the All, Volunteer Match and Help Request filters", () => {
    render(<NotificationUI />);

    expect(screen.getByRole("button", { name: "ALL" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "VOLUNTEER_MATCH" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "HELP_REQUEST_BUTTON" }),
    ).toBeInTheDocument();
  });

  // ba#39 FR-03 / AC-04
  it("shows the empty state when a filter has no records", () => {
    render(<NotificationUI />);

    expect(screen.getByText("NO_NOTIFICATIONS_FOUND")).toBeInTheDocument();
  });

  // ba#39 FR-04 / AC-05: centred in the list area, not pinned to the top of it
  it("vertically centres the empty state in the list area", () => {
    render(<NotificationUI />);

    const box = screen.getByText("NO_NOTIFICATIONS_FOUND").parentElement;
    expect(box).toHaveClass("flex");
    expect(box).toHaveClass("items-center");
    expect(box).toHaveClass("justify-center");
    expect(box.className).toMatch(/min-h-/);
  });

  // ba#39 FR-03 / AC-04, on each applicable filter
  it.each(["ALL", "VOLUNTEER_MATCH", "HELP_REQUEST_BUTTON"])(
    "shows the empty state on the %s filter",
    (label) => {
      render(<NotificationUI />);

      fireEvent.click(screen.getByRole("button", { name: label }));

      expect(screen.getByText("NO_NOTIFICATIONS_FOUND")).toBeInTheDocument();
    },
  );

  // ba#39 FR-06 / AC-07, AC-08: switching filters must never flash "Loading..."
  it("does not render loading text when switching between filters", () => {
    mockState.notifications = [volunteerNote, helpRequestNote];
    render(<NotificationUI />);

    [
      "HELP_REQUEST_BUTTON",
      "VOLUNTEER_MATCH",
      "ALL",
      "HELP_REQUEST_BUTTON",
    ].forEach((label) => {
      fireEvent.click(screen.getByRole("button", { name: label }));
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  // ba#39 FR-07 / AC-09: the destination filter still renders its content
  it("renders the destination filter's records after a switch", () => {
    mockState.notifications = [volunteerNote, helpRequestNote];
    render(<NotificationUI />);

    fireEvent.click(screen.getByRole("button", { name: "VOLUNTEER_MATCH" }));

    expect(
      screen.getByText("You have a new volunteer match request"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("NO_NOTIFICATIONS_FOUND"),
    ).not.toBeInTheDocument();
  });

  // ba#39 FR-09 / AC-10: Accept and Deny survive this change
  it("keeps Accept and Deny available on a new match request", () => {
    mockState.notifications = [volunteerNote];
    render(<NotificationUI />);

    expect(screen.getByRole("button", { name: "ACCEPT" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "DENY" })).toBeInTheDocument();
  });

  // ba#39 FR-10 / AC-13: pagination still renders, including over the empty state
  it("keeps pagination mounted when a filter is empty", () => {
    render(<NotificationUI />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });
});
