import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
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

describe("NotificationUI", () => {
  it("renders the notifications page title", () => {
    render(<NotificationUI />);

    expect(
      screen.getByRole("heading", { level: 1, name: "NOTIFICATIONS" }),
    ).toBeInTheDocument();
  });
});
