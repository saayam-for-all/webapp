import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import YourProfile from "./YourProfile";
import { updateUserAttributes } from "aws-amplify/auth";
import { updateUserProfile } from "../../redux/features/authentication/authActions";

// Mock dependencies
jest.mock("aws-amplify/auth", () => ({
  updateUserAttributes: jest.fn(),
}));

jest.mock("../../redux/features/authentication/authActions", () => ({
  updateUserProfile: jest.fn(),
}));

jest.mock("./CallModal.jsx", () => {
  return function CallModal({ isOpen, onClose, callType }) {
    return isOpen ? (
      <div data-testid="call-modal">
        <div>Call Type: {callType}</div>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  };
});

jest.mock("../../common/components/Loading/Loading", () => {
  return function LoadingIndicator({ size, className }) {
    return (
      <div data-testid="loading-indicator" className={className}>
        Loading...
      </div>
    );
  };
});

jest.mock("react-select-country-list", () => {
  return function CountryList() {
    return {
      getData: () => [
        { value: "US", label: "United States" },
        { value: "CA", label: "Canada" },
        { value: "GB", label: "United Kingdom" },
      ],
    };
  };
});

jest.mock("../../utils/utils", () => ({
  getPhoneCodeslist: jest.fn(() => [
    { code: "US", country: "United States", dialCode: "+1" },
    { code: "CA", country: "Canada", dialCode: "+1" },
    { code: "GB", country: "United Kingdom", dialCode: "+44" },
  ]),
}));

jest.mock("../../utils/phone-codes-en", () => ({
  US: { primary: "United States", secondary: "+1" },
  CA: { primary: "Canada", secondary: "+1" },
  GB: { primary: "United Kingdom", secondary: "+44" },
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Setup i18n for testing
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        FIRST_NAME: "First Name",
        LAST_NAME: "Last Name",
        EMAIL: "Email",
        PHONE_NUMBER: "Phone Number",
        COUNTRY: "Country",
        SELECT_COUNTRY: "Select Country",
        EDIT: "Edit",
        SAVE: "Save",
        SAVING: "Saving",
        CANCEL: "Cancel",
        PROFILE_UPDATE_SUCCESS: "Profile updated successfully",
        PROFILE_UPDATE_FAILED: "Profile update failed",
        EMAIL_VERIFICATION_REQUIRED:
          "Email verification will be required for this change",
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

// Create a mock store
const createMockStore = (initialState = {}) => {
  const defaultState = {
    auth: {
      user: {
        given_name: "John",
        family_name: "Doe",
        email: "john.doe@example.com",
        phone_number: "+1234567890",
        zoneinfo: "United States",
      },
    },
    ...initialState,
  };

  return configureStore({
    reducer: {
      auth: (state = defaultState.auth) => state,
    },
    preloadedState: defaultState,
  });
};

// Test wrapper component
const TestWrapper = ({ children, store = createMockStore() }) => (
  <Provider store={store}>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </BrowserRouter>
  </Provider>
);

describe("YourProfile Component", () => {
  let mockSetHasUnsavedChanges;

  beforeEach(() => {
    mockSetHasUnsavedChanges = jest.fn();
    jest.clearAllMocks();
    // Mock window.alert
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Initial Rendering", () => {
    test("renders profile information correctly", () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    test("renders with empty user data", () => {
      const storeWithNoUser = createMockStore({ auth: { user: null } });

      render(
        <TestWrapper store={storeWithNoUser}>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    test("extracts phone number correctly from user data", () => {
      const storeWithPhone = createMockStore({
        auth: {
          user: {
            given_name: "John",
            family_name: "Doe",
            email: "john.doe@example.com",
            phone_number: "+1234567890",
            zoneinfo: "United States",
          },
        },
      });

      render(
        <TestWrapper store={storeWithPhone}>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      expect(screen.getByText(/234567890/)).toBeInTheDocument();
    });
  });

  describe("Edit Mode", () => {
    test("enters edit mode when edit button is clicked", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        expect(screen.getByDisplayValue("John")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
        expect(
          screen.getByDisplayValue("john.doe@example.com"),
        ).toBeInTheDocument();
        expect(screen.getByText("Save")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
      });
    });

    test("updates form fields and calls setHasUnsavedChanges", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue("John");
        fireEvent.change(firstNameInput, { target: { value: "Jane" } });
      });

      expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
    });

    test("shows email verification message when email is changed", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue("john.doe@example.com");
        fireEvent.change(emailInput, {
          target: { value: "jane.doe@example.com" },
        });
      });

      expect(
        screen.getByText("Email verification will be required for this change"),
      ).toBeInTheDocument();
    });

    test("formats phone number input correctly", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const phoneInput = screen.getByPlaceholderText("1234567890");
        fireEvent.change(phoneInput, { target: { value: "abc123def456ghi" } });
      });

      // Should only keep digits
      expect(screen.getByDisplayValue("123456")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    test("shows error for empty first name", async () => {
      updateUserProfile.mockResolvedValue({
        success: false,
        error: "First and last name are required",
      });

      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue("John");
        fireEvent.change(firstNameInput, { target: { value: "" } });
        fireEvent.click(screen.getByText("Save"));
      });

      await waitFor(() => {
        expect(
          screen.getByText("First and last name are required"),
        ).toBeInTheDocument();
      });
    });

    test("shows error for empty last name", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const lastNameInput = screen.getByDisplayValue("Doe");
        fireEvent.change(lastNameInput, { target: { value: "" } });
        fireEvent.click(screen.getByText("Save"));
      });

      await waitFor(() => {
        expect(
          screen.getByText("First and last name are required"),
        ).toBeInTheDocument();
      });
    });

    test("shows error for empty email", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue("john.doe@example.com");
        fireEvent.change(emailInput, { target: { value: "" } });
        fireEvent.click(screen.getByText("Save"));
      });

      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
      });
    });

    test("shows error for invalid phone number", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const phoneInput = screen.getByPlaceholderText("1234567890");
        fireEvent.change(phoneInput, { target: { value: "invalid" } });
        fireEvent.click(screen.getByText("Save"));
      });

      await waitFor(() => {
        expect(
          screen.getByText("Phone number must contain only digits"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Save Functionality", () => {
    test("saves profile successfully without email change", async () => {
      updateUserProfile.mockResolvedValue({ success: true });

      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue("John");
        fireEvent.change(firstNameInput, { target: { value: "Jane" } });
        fireEvent.click(screen.getByText("Save"));
      });

      await waitFor(() => {
        expect(updateUserProfile).toHaveBeenCalledWith({
          firstName: "Jane",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "+1234567890",
          country: "United States",
        });
        expect(global.alert).toHaveBeenCalledWith(
          "Profile updated successfully",
        );
      });
    });

    test("handles email change with verification", async () => {
      updateUserAttributes.mockResolvedValue(true);

      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue("john.doe@example.com");
        fireEvent.change(emailInput, {
          target: { value: "jane.doe@example.com" },
        });
        fireEvent.click(screen.getByText("Save"));
      });

      await waitFor(() => {
        expect(updateUserAttributes).toHaveBeenCalledWith({
          userAttributes: {
            email: "jane.doe@example.com",
          },
        });
        expect(mockNavigate).toHaveBeenCalledWith("/verify-otp", {
          state: {
            email: "jane.doe@example.com",
            isEmailUpdate: true,
            pendingProfileData: expect.any(Object),
          },
        });
      });
    });

    test("shows loading state during save", async () => {
      updateUserProfile.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true }), 100),
          ),
      );

      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        fireEvent.click(screen.getByText("Save"));
      });

      expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
      expect(screen.getByText("Saving")).toBeInTheDocument();
    });

    test("handles save error", async () => {
      updateUserProfile.mockRejectedValue(new Error("Network error"));

      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        fireEvent.click(screen.getByText("Save"));
      });

      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });
    });
  });

  describe("Cancel Functionality", () => {
    test("cancels editing and resets form", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue("John");
        fireEvent.change(firstNameInput, { target: { value: "Jane" } });
        fireEvent.click(screen.getByText("Cancel"));
      });

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
    });
  });

  describe("Call Functionality", () => {
    test("opens audio call modal", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      const phoneIcon =
        screen.getByRole("button", { name: /phone/i }) ||
        document.querySelector('[data-testid*="phone"]');
      if (phoneIcon) {
        fireEvent.click(phoneIcon);
      } else {
        // Alternative: find by class or other identifier
        const phoneElement = document.querySelector(".fi-phone-call");
        if (phoneElement) {
          fireEvent.click(phoneElement);
        }
      }

      await waitFor(() => {
        expect(screen.getByTestId("call-modal")).toBeInTheDocument();
        expect(screen.getByText("Call Type: audio")).toBeInTheDocument();
      });
    });

    test("opens video call modal", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      const videoIcon =
        screen.getByRole("button", { name: /video/i }) ||
        document.querySelector('[data-testid*="video"]');
      if (videoIcon) {
        fireEvent.click(videoIcon);
      } else {
        // Alternative: find by class or other identifier
        const videoElement = document.querySelector(".fi-video");
        if (videoElement) {
          fireEvent.click(videoElement);
        }
      }

      await waitFor(() => {
        expect(screen.getByTestId("call-modal")).toBeInTheDocument();
        expect(screen.getByText("Call Type: video")).toBeInTheDocument();
      });
    });

    test("closes call modal", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      // Simulate opening modal first
      const phoneElement = document.querySelector(".fi-phone-call");
      if (phoneElement) {
        fireEvent.click(phoneElement);
      }

      await waitFor(() => {
        const closeButton = screen.getByText("Close");
        fireEvent.click(closeButton);
      });

      expect(screen.queryByTestId("call-modal")).not.toBeInTheDocument();
    });
  });

  describe("Phone Number Parsing", () => {
    test("handles phone number without country code", () => {
      const storeWithoutCountryCode = createMockStore({
        auth: {
          user: {
            given_name: "John",
            family_name: "Doe",
            email: "john.doe@example.com",
            phone_number: "1234567890",
            zoneinfo: "United States",
          },
        },
      });

      render(
        <TestWrapper store={storeWithoutCountryCode}>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      expect(screen.getByText("1234567890")).toBeInTheDocument();
    });

    test("handles complex phone number parsing", () => {
      const storeWithComplexPhone = createMockStore({
        auth: {
          user: {
            given_name: "John",
            family_name: "Doe",
            email: "john.doe@example.com",
            phone_number: "+44234567890",
            zoneinfo: "United Kingdom",
          },
        },
      });

      render(
        <TestWrapper store={storeWithComplexPhone}>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      // Should extract phone number correctly
      expect(screen.getByText(/234567890/)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("focuses first name input when entering edit mode", async () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue("John");
        expect(firstNameInput).toHaveFocus();
      });
    });

    test("has proper labels for form fields", () => {
      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
      expect(screen.getByLabelText("Country")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    test("handles AWS Amplify errors", async () => {
      updateUserAttributes.mockRejectedValue(new Error("AWS Error"));

      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue("john.doe@example.com");
        fireEvent.change(emailInput, { target: { value: "new@example.com" } });
        fireEvent.click(screen.getByText("Save"));
      });

      await waitFor(() => {
        expect(
          screen.getByText("Failed to send verification email"),
        ).toBeInTheDocument();
      });
    });

    test("handles Redux action errors", async () => {
      updateUserProfile.mockRejectedValue(new Error("Redux Error"));

      render(
        <TestWrapper>
          <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByText("Edit"));

      await waitFor(() => {
        fireEvent.click(screen.getByText("Save"));
      });

      await waitFor(() => {
        expect(screen.getByText("Redux Error")).toBeInTheDocument();
      });
    });
  });
});
