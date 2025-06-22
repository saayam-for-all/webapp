import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import YourProfile from "./YourProfile";

// Mock the external dependencies
const mockUpdateUserAttributes = jest.fn();
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock("aws-amplify/auth", () => ({
  updateUserAttributes: mockUpdateUserAttributes,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

jest.mock("./CallModal.jsx", () => {
  return function CallModal({ isOpen, onClose, callType }) {
    return isOpen ? (
      <div data-testid="call-modal">
        <span>CallModal - {callType}</span>
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
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
  return jest.fn(() => ({
    getData: () => [
      { value: "US", label: "United States" },
      { value: "CA", label: "Canada" },
      { value: "GB", label: "United Kingdom" },
      { value: "FR", label: "France" },
    ],
  }));
});

jest.mock("react-icons/fi", () => ({
  FiPhoneCall: ({ onClick, className }) => (
    <button
      data-testid="phone-call-icon"
      onClick={onClick}
      className={className}
    >
      📞
    </button>
  ),
  FiVideo: ({ onClick, className }) => (
    <button
      data-testid="video-call-icon"
      onClick={onClick}
      className={className}
    >
      📹
    </button>
  ),
}));

// Mock the phone codes utility
jest.mock("../../utils/phone-codes-en", () => ({
  US: { primary: "United States", secondary: "+1", dialCode: "+1" },
  CA: { primary: "Canada", secondary: "+1", dialCode: "+1" },
  GB: { primary: "United Kingdom", secondary: "+44", dialCode: "+44" },
  FR: { primary: "France", secondary: "+33", dialCode: "+33" },
}));

jest.mock("../../utils/utils", () => ({
  getPhoneCodeslist: (phoneCodesEn) =>
    Object.entries(phoneCodesEn).map(([code, data]) => ({
      code,
      country: data.primary,
      dialCode: data.secondary,
    })),
}));

// Mock the auth actions
const mockUpdateUserProfile = jest.fn();
jest.mock("../../redux/features/authentication/authActions", () => ({
  updateUserProfile: mockUpdateUserProfile,
}));

// Mock window.alert
global.alert = jest.fn();

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = initialState.auth || {}, action) => state,
    },
    preloadedState: initialState,
  });
};

const mockUser = {
  given_name: "John",
  family_name: "Doe",
  email: "john@example.com",
  phone_number: "+1234567890",
  zoneinfo: "United States",
};

const defaultStore = createMockStore({
  auth: {
    user: mockUser,
  },
});

const renderWithProvider = (component, store = defaultStore) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

describe("YourProfile Component", () => {
  const mockSetHasUnsavedChanges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockImplementation((action) => {
      if (typeof action === "function") {
        return action(mockDispatch);
      }
      return Promise.resolve({ success: true });
    });
    mockUpdateUserProfile.mockReturnValue(() =>
      Promise.resolve({ success: true }),
    );
  });

  describe("Initial Rendering", () => {
    it("renders user profile information correctly", () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("United States")).toBeInTheDocument();
    });

    it("renders all form labels", () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      expect(screen.getByText("FIRST_NAME")).toBeInTheDocument();
      expect(screen.getByText("LAST_NAME")).toBeInTheDocument();
      expect(screen.getByText("EMAIL")).toBeInTheDocument();
      expect(screen.getByText("PHONE_NUMBER")).toBeInTheDocument();
      expect(screen.getByText("COUNTRY")).toBeInTheDocument();
    });

    it("shows Edit button when not in editing mode", () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      expect(screen.getByText("EDIT")).toBeInTheDocument();
      expect(screen.queryByText("SAVE")).not.toBeInTheDocument();
      expect(screen.queryByText("CANCEL")).not.toBeInTheDocument();
    });

    it("displays phone number with country code and call icons", () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      expect(screen.getByTestId("phone-call-icon")).toBeInTheDocument();
      expect(screen.getByTestId("video-call-icon")).toBeInTheDocument();
    });
  });

  describe("Edit Mode", () => {
    it("enters edit mode when Edit button is clicked", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByText("SAVE")).toBeInTheDocument();
        expect(screen.getByText("CANCEL")).toBeInTheDocument();
        expect(screen.queryByText("EDIT")).not.toBeInTheDocument();
      });
    });

    it("shows input fields in edit mode", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByDisplayValue("John")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
        expect(
          screen.getByDisplayValue("john@example.com"),
        ).toBeInTheDocument();
        expect(screen.getByDisplayValue("234567890")).toBeInTheDocument();
      });
    });

    it("focuses on first name input when entering edit mode", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue("John");
        expect(firstNameInput).toHaveFocus();
      });
    });

    it("shows country dropdown in edit mode", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const countrySelect = screen.getByDisplayValue("United States");
        expect(countrySelect).toBeInTheDocument();
      });
    });

    it("shows phone country code dropdown in edit mode", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const phoneCodeSelect = screen.getByDisplayValue("United States (+1)");
        expect(phoneCodeSelect).toBeInTheDocument();
      });
    });
  });

  describe("Form Interactions", () => {
    it("calls setHasUnsavedChanges when input changes", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue("John");
        fireEvent.change(firstNameInput, { target: { value: "Jane" } });

        expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
      });
    });

    it("filters non-numeric characters from phone input", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const phoneInput = screen.getByDisplayValue("234567890");
        fireEvent.change(phoneInput, { target: { value: "abc123def456" } });

        expect(phoneInput).toHaveValue("123456");
      });
    });

    it("cancels editing and resets form data", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue("John");
        fireEvent.change(firstNameInput, { target: { value: "Jane" } });
      });

      const cancelButton = screen.getByText("CANCEL");
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.getByText("EDIT")).toBeInTheDocument();
        expect(screen.getByText("John")).toBeInTheDocument();
        expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("Email Verification Flow", () => {
    it("shows email verification warning when email is changed", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue("john@example.com");
        fireEvent.change(emailInput, {
          target: { value: "newemail@example.com" },
        });

        expect(
          screen.getByText(
            "Email verification will be required for this change",
          ),
        ).toBeInTheDocument();
      });
    });

    it("does not show email verification warning when email is unchanged", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(
          screen.queryByText(
            "Email verification will be required for this change",
          ),
        ).not.toBeInTheDocument();
      });
    });

    it("navigates to OTP verification when email is changed and saved", async () => {
      mockUpdateUserAttributes.mockResolvedValue(true);

      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue("john@example.com");
        fireEvent.change(emailInput, {
          target: { value: "newemail@example.com" },
        });
      });

      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateUserAttributes).toHaveBeenCalledWith({
          userAttributes: {
            email: "newemail@example.com",
          },
        });
        expect(mockNavigate).toHaveBeenCalledWith("/verify-otp", {
          state: {
            email: "newemail@example.com",
            isEmailUpdate: true,
            pendingProfileData: {
              firstName: "John",
              lastName: "Doe",
              email: "newemail@example.com",
              phone: "+1234567890",
              country: "United States",
            },
          },
        });
      });
    });

    it("handles email verification failure", async () => {
      mockUpdateUserAttributes.mockRejectedValue(
        new Error("Verification failed"),
      );

      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue("john@example.com");
        fireEvent.change(emailInput, {
          target: { value: "newemail@example.com" },
        });
      });

      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to send verification email"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Profile Save", () => {
    it("saves profile successfully when email is not changed", async () => {
      const mockAction = jest.fn(() => Promise.resolve({ success: true }));
      mockUpdateUserProfile.mockReturnValue(mockAction);
      mockDispatch.mockResolvedValue({ success: true });

      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue("John");
        fireEvent.change(firstNameInput, { target: { value: "Jane" } });
      });

      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateUserProfile).toHaveBeenCalledWith({
          firstName: "Jane",
          lastName: "Doe",
          email: "john@example.com",
          phone: "+1234567890",
          country: "United States",
        });
        expect(global.alert).toHaveBeenCalledWith("PROFILE_UPDATE_SUCCESS");
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it("handles profile update failure", async () => {
      const mockAction = jest.fn(() =>
        Promise.resolve({ success: false, error: "Update failed" }),
      );
      mockUpdateUserProfile.mockReturnValue(mockAction);
      mockDispatch.mockResolvedValue({
        success: false,
        error: "Update failed",
      });

      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText("Update failed")).toBeInTheDocument();
      });
    });

    it("shows loading state during save", async () => {
      const mockAction = jest.fn(() => new Promise(() => {})); // Never resolves
      mockUpdateUserProfile.mockReturnValue(mockAction);

      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
        expect(screen.getByText("SAVING")).toBeInTheDocument();
        expect(screen.getByText("SAVING")).toBeDisabled();
        expect(screen.getByText("CANCEL")).toBeDisabled();
      });
    });
  });

  describe("Form Validation", () => {
    it("validates required first name", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue("John");
        fireEvent.change(firstNameInput, { target: { value: "" } });
      });

      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText("First and last name are required"),
        ).toBeInTheDocument();
      });
    });

    it("validates required last name", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const lastNameInput = screen.getByDisplayValue("Doe");
        fireEvent.change(lastNameInput, { target: { value: "" } });
      });

      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText("First and last name are required"),
        ).toBeInTheDocument();
      });
    });

    it("validates required email", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue("john@example.com");
        fireEvent.change(emailInput, { target: { value: "" } });
      });

      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
      });
    });

    it("validates phone number format", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const phoneInput = screen.getByDisplayValue("234567890");
        fireEvent.change(phoneInput, { target: { value: "abc" } });
      });

      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText("Phone number must contain only digits"),
        ).toBeInTheDocument();
      });
    });

    it("clears validation errors when form is reset", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue("John");
        fireEvent.change(firstNameInput, { target: { value: "" } });
      });

      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText("First and last name are required"),
        ).toBeInTheDocument();
      });

      const cancelButton = screen.getByText("CANCEL");
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByText("First and last name are required"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Call Functionality", () => {
    it("opens audio call modal when phone icon is clicked", () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const phoneIcon = screen.getByTestId("phone-call-icon");
      fireEvent.click(phoneIcon);

      expect(screen.getByTestId("call-modal")).toBeInTheDocument();
      expect(screen.getByText("CallModal - audio")).toBeInTheDocument();
    });

    it("opens video call modal when video icon is clicked", () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const videoIcon = screen.getByTestId("video-call-icon");
      fireEvent.click(videoIcon);

      expect(screen.getByTestId("call-modal")).toBeInTheDocument();
      expect(screen.getByText("CallModal - video")).toBeInTheDocument();
    });

    it("closes call modal when close button is clicked", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const phoneIcon = screen.getByTestId("phone-call-icon");
      fireEvent.click(phoneIcon);

      expect(screen.getByTestId("call-modal")).toBeInTheDocument();

      const closeButton = screen.getByTestId("close-modal");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("call-modal")).not.toBeInTheDocument();
      });
    });
  });

  describe("Phone Number Processing", () => {
    it("handles user with no phone number", () => {
      const storeWithoutPhone = createMockStore({
        auth: {
          user: {
            ...mockUser,
            phone_number: null,
          },
        },
      });

      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
        storeWithoutPhone,
      );

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Doe")).toBeInTheDocument();
    });

    it("handles phone number without country code", () => {
      const storeWithPlainPhone = createMockStore({
        auth: {
          user: {
            ...mockUser,
            phone_number: "234567890",
          },
        },
      });

      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
        storeWithPlainPhone,
      );

      expect(screen.getByText("John")).toBeInTheDocument();
    });

    it("processes international phone numbers correctly", () => {
      const storeWithUKPhone = createMockStore({
        auth: {
          user: {
            ...mockUser,
            phone_number: "+447911123456",
            zoneinfo: "United Kingdom",
          },
        },
      });

      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
        storeWithUKPhone,
      );

      expect(screen.getByText("John")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles missing user data gracefully", () => {
      const storeWithoutUser = createMockStore({
        auth: {
          user: null,
        },
      });

      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
        storeWithoutUser,
      );

      expect(screen.getByText("EDIT")).toBeInTheDocument();
    });

    it("handles user with minimal data", () => {
      const storeWithMinimalUser = createMockStore({
        auth: {
          user: {
            given_name: "John",
            email: "john@example.com",
          },
        },
      });

      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
        storeWithMinimalUser,
      );

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("handles Redux action throwing error", async () => {
      const mockAction = jest.fn(() =>
        Promise.reject(new Error("Redux error")),
      );
      mockUpdateUserProfile.mockReturnValue(mockAction);

      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText("Redux error")).toBeInTheDocument();
      });
    });
  });

  describe("Component Integration", () => {
    it("properly integrates with country selection", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const countrySelect = screen.getByDisplayValue("United States");
        fireEvent.change(countrySelect, { target: { value: "Canada" } });

        expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
      });
    });

    it("properly integrates with phone country code selection", async () => {
      renderWithProvider(
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      );

      const editButton = screen.getByText("EDIT");
      fireEvent.click(editButton);

      await waitFor(() => {
        const phoneCodeSelect = screen.getByDisplayValue("United States (+1)");
        fireEvent.change(phoneCodeSelect, { target: { value: "GB" } });

        expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
      });
    });
  });
});
