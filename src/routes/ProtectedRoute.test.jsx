import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import authReducer from "../redux/features/authentication/authSlice";
import ProtectedRoute from "./ProtectedRoute";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

jest.mock("../common/components/InactivityTimer/InactivityTimer", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="timer">{children}</div>,
}));

jest.mock("../common/components/Loading/Loading", () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}));

const mockStartVolunteerLocationTracking = jest.fn();
const mockStopVolunteerLocationTracking = jest.fn();
const mockSyncVolunteerLocationNow = jest.fn();

jest.mock("../services/volunteerLocationTracker", () => ({
  startVolunteerLocationTracking: (...args) =>
    mockStartVolunteerLocationTracking(...args),
  stopVolunteerLocationTracking: (...args) =>
    mockStopVolunteerLocationTracking(...args),
  syncVolunteerLocationNow: (...args) => mockSyncVolunteerLocationNow(...args),
}));

const renderProtectedRoute = (authState, initialEntries = ["/dashboard"]) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: authState,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<div>Landing</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a loading indicator while auth is initializing", () => {
    renderProtectedRoute({
      loading: true,
      user: null,
      success: false,
      error: null,
    });

    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("redirects unauthenticated users to the landing page", async () => {
    renderProtectedRoute({
      loading: false,
      user: null,
      success: false,
      error: null,
    });

    await waitFor(() => {
      expect(screen.getByText("Landing")).toBeTruthy();
    });
  });

  it("renders protected content for authenticated users", async () => {
    renderProtectedRoute({
      loading: false,
      user: {
        userId: "user-123",
        email: "test@example.com",
      },
      success: false,
      error: null,
    });

    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeTruthy();
    });
  });

  it("starts volunteer tracking only for volunteer users with a database id", async () => {
    renderProtectedRoute({
      loading: false,
      user: {
        userId: "user-123",
        userDbId: "SID-00-000-001",
        groups: ["Volunteer"],
      },
      success: false,
      error: null,
    });

    await waitFor(() => {
      expect(mockStartVolunteerLocationTracking).toHaveBeenCalledWith({
        intervalMs: 5 * 60 * 1000,
      });
    });

    expect(mockStopVolunteerLocationTracking).not.toHaveBeenCalled();
  });

  it("does not start volunteer tracking for non-volunteer users", async () => {
    renderProtectedRoute({
      loading: false,
      user: {
        userId: "user-123",
        userDbId: "SID-00-000-001",
        groups: ["Users"],
      },
      success: false,
      error: null,
    });

    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeTruthy();
    });

    expect(mockStartVolunteerLocationTracking).not.toHaveBeenCalled();
    expect(mockStopVolunteerLocationTracking).toHaveBeenCalled();
  });
});
