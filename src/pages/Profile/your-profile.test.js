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

jest.mock("aws-amplify/auth", () => ({
  updateUserAttributes: mockUpdateUserAttributes,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key, // Return fallback or key
    i18n: { changeLanguage: jest.fn() },
  }),
}));

jest.mock("./CallModal.jsx", () => {
  return function CallModal({ isOpen, onClose, callType }) {
    return isOpen ? (
      <div data-testid="call-modal">CallModal - {callType}</div>
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
      { value: "UK", label: "United Kingdom" },
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
  UK: { primary: "United Kingdom", secondary: "+44", dialCode: "+44" },
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

describe("YourProfile", () => {
  const mockSetHasUnsavedChanges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateUserProfile.mockReturnValue(Promise.resolve({ success: true }));
  });

  it("renders basic user info", () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders form labels correctly", () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    expect(screen.getByText("FIRST_NAME")).toBeInTheDocument();
    expect(screen.getByText("LAST_NAME")).toBeInTheDocument();
    expect(screen.getByText("EMAIL")).toBeInTheDocument();
    expect(screen.getByText("PHONE_NUMBER")).toBeInTheDocument();
    expect(screen.getByText("COUNTRY")).toBeInTheDocument();
  });

  it("shows edit button when not in editing mode", () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    expect(screen.getByText("EDIT")).toBeInTheDocument();
    expect(screen.queryByText("SAVE")).not.toBeInTheDocument();
    expect(screen.queryByText("CANCEL")).not.toBeInTheDocument();
  });

  it("enters edit mode when edit button is clicked", async () => {
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
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    });
  });

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
        screen.getByText("Email verification will be required for this change"),
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

  it("saves profile normally when email is not changed", async () => {
    mockUpdateUserProfile.mockResolvedValue({ success: true });

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

  it("validates required fields", async () => {
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

  it("validates email field", async () => {
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
      fireEvent.change(phoneInput, { target: { value: "abc123" } });
    });

    const saveButton = screen.getByText("SAVE");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Phone number must contain only digits"),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during save", async () => {
    mockUpdateUserProfile.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    const editButton = screen.getByText("EDIT");
    fireEvent.click(editButton);

    await waitFor(() => {
      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
      expect(screen.getByText("SAVING")).toBeInTheDocument();
    });
  });

  it("opens call modal when phone icon is clicked", () => {
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

  it("cancels editing and resets form", async () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    // Enter edit mode
    const editButton = screen.getByText("EDIT");
    fireEvent.click(editButton);

    await waitFor(() => {
      // Change a field
      const firstNameInput = screen.getByDisplayValue("John");
      fireEvent.change(firstNameInput, { target: { value: "Jane" } });

      // Cancel editing
      const cancelButton = screen.getByText("CANCEL");
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.getByText("EDIT")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument(); // Should be reset
      expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
    });
  });

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

  it("handles profile update failure", async () => {
    mockUpdateUserProfile.mockResolvedValue({
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

  it("disables buttons during loading", async () => {
    mockUpdateUserProfile.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    const editButton = screen.getByText("EDIT");
    fireEvent.click(editButton);

    await waitFor(() => {
      const saveButton = screen.getByText("SAVE");
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByText("SAVING")).toBeDisabled();
      expect(screen.getByText("CANCEL")).toBeDisabled();
    });
  });

  it("clears errors when resetting form", async () => {
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

  it("matches snapshot", () => {
    const { asFragment } = renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
