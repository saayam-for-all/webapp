import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { useSelector } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import {
  startVolunteerLocationTracking,
  stopVolunteerLocationTracking,
  syncVolunteerLocationNow,
} from "../services/volunteerLocationTracker";

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
  };
});

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("../common/components/InactivityTimer/InactivityTimer", () => ({
  __esModule: true,
  default: ({ children }) => (
    <div data-testid="inactivity-timer">{children}</div>
  ),
}));

jest.mock("../services/volunteerLocationTracker", () => ({
  startVolunteerLocationTracking: jest.fn(),
  stopVolunteerLocationTracking: jest.fn(),
  syncVolunteerLocationNow: jest.fn(),
}));

describe("ProtectedRoute", () => {
  const renderRoute = (initialPath = "/dashboard") =>
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<div>Login Page</div>} />
          <Route path="/login" element={<div>Login Route</div>} />
          <Route path="/signup" element={<div>Signup Route</div>} />
          <Route path="/forgot-password" element={<div>Forgot Password</div>} />
          <Route path="/verify-otp" element={<div>Verify OTP</div>} />
          <Route path="/verify-account" element={<div>Verify Account</div>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            <Route path="/profile" element={<div>Profile Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it("redirects to / when user is not logged in", () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: null,
        },
      }),
    );

    renderRoute("/dashboard");

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(startVolunteerLocationTracking).not.toHaveBeenCalled();
    expect(stopVolunteerLocationTracking).toHaveBeenCalled();
  });

  it("renders protected content inside InactivityLogoutTimer for authenticated user", () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      }),
    );

    renderRoute("/dashboard");

    expect(screen.getByTestId("inactivity-timer")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
  });

  it("starts volunteer location tracking for volunteer user with userDbId", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      }),
    );

    renderRoute("/dashboard");

    await waitFor(() => {
      expect(startVolunteerLocationTracking).toHaveBeenCalledTimes(1);
    });

    expect(stopVolunteerLocationTracking).not.toHaveBeenCalled();
  });

  it("also treats Volunteer singular group as volunteer", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            userDbId: "SID-123",
            group: "Volunteer",
          },
        },
      }),
    );

    renderRoute("/dashboard");

    await waitFor(() => {
      expect(startVolunteerLocationTracking).toHaveBeenCalledTimes(1);
    });
  });

  it("supports cognito:groups volunteer membership", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            userDbId: "SID-123",
            "cognito:groups": ["Volunteers"],
          },
        },
      }),
    );

    renderRoute("/dashboard");

    await waitFor(() => {
      expect(startVolunteerLocationTracking).toHaveBeenCalledTimes(1);
    });
  });

  it("supports cognitoGroups volunteer membership", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            userDbId: "SID-123",
            cognitoGroups: ["Volunteers"],
          },
        },
      }),
    );

    renderRoute("/dashboard");

    await waitFor(() => {
      expect(startVolunteerLocationTracking).toHaveBeenCalledTimes(1);
    });
  });

  it("does not start tracking and stops tracking for non-volunteer user", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Users"],
          },
        },
      }),
    );

    renderRoute("/dashboard");

    await waitFor(() => {
      expect(stopVolunteerLocationTracking).toHaveBeenCalledTimes(1);
    });

    expect(startVolunteerLocationTracking).not.toHaveBeenCalled();
  });

  it("does not start tracking and stops tracking when userDbId is missing", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            userDbId: "",
            groups: ["Volunteers"],
          },
        },
      }),
    );

    renderRoute("/dashboard");

    await waitFor(() => {
      expect(stopVolunteerLocationTracking).toHaveBeenCalledTimes(1);
    });

    expect(startVolunteerLocationTracking).not.toHaveBeenCalled();
  });

  it("listens for personal-info-updated and triggers immediate sync", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      }),
    );

    renderRoute("/dashboard");

    window.dispatchEvent(new Event("personal-info-updated"));

    await waitFor(() => {
      expect(syncVolunteerLocationNow).toHaveBeenCalledTimes(1);
    });
  });

  it("stops tracking on cleanup/unmount", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      }),
    );

    const { unmount } = renderRoute("/dashboard");
    unmount();

    await waitFor(() => {
      expect(stopVolunteerLocationTracking).toHaveBeenCalled();
    });
  });

  it("removes personal-info-updated listener on cleanup", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: {
            userDbId: "SID-123",
            groups: ["Volunteers"],
          },
        },
      }),
    );

    const { unmount } = renderRoute("/dashboard");

    await waitFor(() => {
      expect(startVolunteerLocationTracking).toHaveBeenCalledTimes(1);
    });

    unmount();

    window.dispatchEvent(new Event("personal-info-updated"));

    expect(syncVolunteerLocationNow).toHaveBeenCalledTimes(0);
  });

  it("stops tracking when user becomes unauthenticated after being authenticated", async () => {
    let mockState = {
      auth: {
        user: {
          userDbId: "SID-123",
          groups: ["Volunteers"],
        },
      },
    };

    useSelector.mockImplementation((selector) => selector(mockState));

    const { rerender } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(startVolunteerLocationTracking).toHaveBeenCalledTimes(1);
    });

    mockState = {
      auth: {
        user: null,
      },
    };

    rerender(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(stopVolunteerLocationTracking).toHaveBeenCalled();
    });
  });
});
