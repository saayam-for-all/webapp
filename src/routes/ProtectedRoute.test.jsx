import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/authentication/authSlice";
import ProtectedRoute from "./ProtectedRoute";

const mockNavigateFn = jest.fn();

jest.mock("react-router-dom", () => ({
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
  Outlet: () => <div data-testid="outlet" />,
  useLocation: () => ({ pathname: "/dashboard" }),
}));

jest.mock("../common/components/InactivityTimer/InactivityTimer", () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

jest.mock("../common/components/Loader/MainLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="main-loader" />,
}));

jest.mock("../services/volunteerLocationTracker", () => ({
  startVolunteerLocationTracking: jest.fn(),
  stopVolunteerLocationTracking: jest.fn(),
  syncVolunteerLocationNow: jest.fn(),
}));

const renderWithStore = (preloadedState) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });
  return render(
    <Provider store={store}>
      <ProtectedRoute />
    </Provider>,
  );
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockNavigateFn.mockClear();
  });

  it("shows loader while auth check is in progress (loading: true)", () => {
    renderWithStore({ auth: { loading: true, user: null } });
    expect(screen.getByTestId("main-loader")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
    expect(screen.queryByTestId("outlet")).not.toBeInTheDocument();
  });

  it("redirects to / when auth resolves with no user", () => {
    renderWithStore({ auth: { loading: false, user: null } });
    const nav = screen.getByTestId("navigate");
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("data-to", "/");
    expect(screen.queryByTestId("main-loader")).not.toBeInTheDocument();
    expect(screen.queryByTestId("outlet")).not.toBeInTheDocument();
  });

  it("renders protected content when auth resolves with a user", () => {
    const mockUser = { userId: "u1", email: "test@example.com", groups: [] };
    renderWithStore({ auth: { loading: false, user: mockUser } });
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.queryByTestId("main-loader")).not.toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });

  it("does not redirect to / during loading even with no user (prevents premature redirect on /dashboard)", () => {
    renderWithStore({ auth: { loading: true, user: null } });
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
    expect(screen.getByTestId("main-loader")).toBeInTheDocument();
  });
});
