import { checkAuthStatus, logout } from "./authActions";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutSuccess,
} from "./authSlice";

// Mock all external dependencies
jest.mock("aws-amplify/auth", () => ({
  getCurrentUser: jest.fn(),
  fetchUserAttributes: jest.fn(),
  fetchAuthSession: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("../../../services/requestServices", () => ({
  getEnums: jest.fn(),
  getCategories: jest.fn(),
  getEnvironment: jest.fn(),
  getMetadata: jest.fn(),
}));

jest.mock("../../../services/volunteerServices", () => ({
  getUserId: jest.fn(),
}));

jest.mock("../../../common/i18n/utils", () => ({
  changeUiLanguage: jest.fn(),
  returnDefaultLanguage: jest.fn(),
}));

jest.mock("../../../services/authService", () => ({
  setToken: jest.fn(),
  clearToken: jest.fn(),
}));

jest.mock("../help_request/requestActions", () => ({
  loadCategories: jest.fn((categories) => ({
    type: "LOAD_CATEGORIES",
    payload: categories,
  })),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("authActions", () => {
  let dispatch;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
  });

  describe("checkAuthStatus", () => {
    const mockUserAttributes = {
      email: "test@example.com",
      family_name: "Doe",
      given_name: "John",
      phone_number: "+1234567890",
      "custom:Country": "US",
    };

    const mockSession = {
      tokens: {
        accessToken: {
          payload: {
            "cognito:groups": ["users"],
          },
        },
        idToken: {
          toString: () => "mock-id-token",
        },
      },
    };

    beforeEach(() => {
      const {
        getCurrentUser,
        fetchUserAttributes,
        fetchAuthSession,
      } = require("aws-amplify/auth");
      const {
        getEnums,
        getCategories,
        getEnvironment,
        getMetadata,
      } = require("../../../services/requestServices");

      getCurrentUser.mockResolvedValue({ userId: "user-123" });
      fetchUserAttributes.mockResolvedValue(mockUserAttributes);
      fetchAuthSession.mockResolvedValue(mockSession);
      getEnums.mockResolvedValue({ enum1: "value1" });
      getCategories.mockResolvedValue([{ catId: "1", catName: "Category 1" }]);
      getEnvironment.mockResolvedValue({ environment: "test" });
      getMetadata.mockResolvedValue({ body: { key: "value" } });
    });

    it("stores userDbId in localStorage when getUserId returns valid id", async () => {
      const { getUserId } = require("../../../services/volunteerServices");
      getUserId.mockResolvedValue({ data: { id: "SID-00-000-001" } });

      await checkAuthStatus()(dispatch);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "userDbId",
        "SID-00-000-001",
      );
    });

    it("does not store userDbId in localStorage when getUserId returns null", async () => {
      const { getUserId } = require("../../../services/volunteerServices");
      getUserId.mockResolvedValue({ data: { id: null } });

      await checkAuthStatus()(dispatch);

      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        "userDbId",
        expect.anything(),
      );
    });

    it("does not store userDbId when getUserId throws error", async () => {
      const { getUserId } = require("../../../services/volunteerServices");
      getUserId.mockRejectedValue(new Error("User not found"));

      await checkAuthStatus()(dispatch);

      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        "userDbId",
        expect.anything(),
      );
      // Should still dispatch loginSuccess
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: loginSuccess.type,
        }),
      );
    });

    it("dispatches loginRequest at start", async () => {
      const { getUserId } = require("../../../services/volunteerServices");
      getUserId.mockResolvedValue({ data: { id: "SID-00-000-001" } });

      await checkAuthStatus()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(loginRequest());
    });
  });

  describe("logout", () => {
    beforeEach(() => {
      const { signOut } = require("aws-amplify/auth");
      signOut.mockResolvedValue({});
    });

    it("removes userDbId from localStorage on logout", async () => {
      await logout()(dispatch);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("userDbId");
    });

    it("dispatches logoutSuccess after successful logout", async () => {
      await logout()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(logoutSuccess());
    });

    it("dispatches loginFailure when logout throws error", async () => {
      const { signOut } = require("aws-amplify/auth");
      signOut.mockRejectedValue(new Error("Logout failed"));

      await logout()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(loginFailure("Logout failed"));
    });
  });
});
