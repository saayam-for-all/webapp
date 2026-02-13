import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "#utils/test-utils.jsx";

jest.mock("../../redux/features/authentication/authActions", () => ({
  checkAuthStatus: jest.fn(),
  logout: jest.fn(),
  updateUserProfile: jest.fn(),
}));

jest.mock("../../services/volunteerServices", () => ({
  fetchProfileImage: jest.fn(() => Promise.resolve(null)),
  uploadProfileImage: jest.fn(() => Promise.resolve()),
  deleteProfileImage: jest.fn(() => Promise.resolve()),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key, i18n: {} }),
  initReactI18next: { init: () => {} },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
}));

import Profile from "./Profile";

describe("Profile page profile photo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = jest.fn();
  });

  it("renders Back to Dashboard and profile menu", () => {
    renderWithProviders(<Profile />, {
      preloadedState: { auth: { user: null } },
    });
    expect(screen.getByText("BACK_TO_DASHBOARD")).toBeInTheDocument();
  });

  it("calls fetchProfileImage when userDbId is present", async () => {
    const { fetchProfileImage } = require("../../services/volunteerServices");
    fetchProfileImage.mockResolvedValue(null);

    renderWithProviders(<Profile />, {
      preloadedState: {
        auth: { user: { userDbId: "SID-123", userId: "u1" } },
      },
    });

    await waitFor(() => {
      expect(fetchProfileImage).toHaveBeenCalledWith("SID-123");
    });
  });

  it("does not call fetchProfileImage when userDbId is missing", async () => {
    const { fetchProfileImage } = require("../../services/volunteerServices");

    renderWithProviders(<Profile />, {
      preloadedState: { auth: { user: { userId: "u1" } } },
    });

    await waitFor(() => {
      expect(screen.getByText("BACK_TO_DASHBOARD")).toBeInTheDocument();
    });
    expect(fetchProfileImage).not.toHaveBeenCalled();
  });

  it("opens profile photo modal when profile image is clicked", async () => {
    const { fetchProfileImage } = require("../../services/volunteerServices");
    fetchProfileImage.mockResolvedValue(null);

    renderWithProviders(<Profile />, {
      preloadedState: {
        auth: { user: { userDbId: "SID-1", userId: "u1" } },
      },
    });

    await waitFor(() => {
      expect(fetchProfileImage).toHaveBeenCalledWith("SID-1");
    });

    const profileImg = screen.getByRole("img", { name: /profile/i });
    fireEvent.click(profileImg);

    expect(screen.getByText("PROFILE_PHOTO")).toBeInTheDocument();
    expect(screen.getByText("SAVE")).toBeInTheDocument();
    expect(screen.getByText("DELETE")).toBeInTheDocument();
  });
});
