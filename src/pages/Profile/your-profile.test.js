import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import YourProfile from "./YourProfile";

// --- Mocks ---

// Amplify auth: mock both updateUserAttributes and fetchAuthSession (valid session)
jest.mock("aws-amplify/auth", () => ({
  updateUserAttributes: jest.fn().mockResolvedValue({}),
  fetchAuthSession: jest
    .fn()
    .mockResolvedValue({ tokens: { idToken: "valid" } }),
}));

// i18n: return fallback/keys
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

// Call modal: keep simple
jest.mock("./CallModal.jsx", () => {
  return function CallModal({ isOpen, callType }) {
    return isOpen ? (
      <div data-testid="call-modal">CallModal - {callType}</div>
    ) : null;
  };
});

// Loading spinner
jest.mock("../../common/components/Loading/Loading", () => {
  return function LoadingIndicator({ className }) {
    return (
      <div data-testid="loading-indicator" className={className}>
        Loading...
      </div>
    );
  };
});

// Country list
jest.mock("react-select-country-list", () => {
  return jest.fn(() => ({
    getData: () => [
      { value: "US", label: "United States" },
      { value: "CA", label: "Canada" },
      { value: "UK", label: "United Kingdom" },
    ],
  }));
});

// Icons -> buttons we can click
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

// Phone codes used by component
jest.mock("../../utils/phone-codes-en", () => ({
  US: { primary: "United States", secondary: "+1", dialCode: "+1" },
  CA: { primary: "Canada", secondary: "+1", dialCode: "+1" },
  UK: { primary: "United Kingdom", secondary: "+44", dialCode: "+44" },
}));

//react-phone-number-input: make validation pass *and* force country to US
jest.mock("react-phone-number-input", () => ({
  isValidPhoneNumber: jest.fn(() => true),
  parsePhoneNumber: jest.fn(() => ({
    isValid: () => true,
    country: "US",
  })),
}));

// Replace the complex phone input with a simple stub that sets a valid phone on mount
jest.mock("../../common/components/PhoneNumberInputWithCountry", () => {
  const React = require("react");
  return function PhoneNumberInputWithCountryMock(props) {
    React.useLayoutEffect(() => {
      props.setCountryCode?.("US");
      props.setPhone?.("2345678901"); // 10 digits
      props.setError?.("");
    }, []);
    return <div data-testid="phone-input-mock" />;
  };
});

// Redux action
jest.mock("../../redux/features/authentication/authActions", () => ({
  updateUserProfile: jest.fn(() => ({
    type: "UPDATE_USER_PROFILE",
    payload: { success: true },
  })),
}));

// Router navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// --- Helpers ---
const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: {
      auth: (state = initialState.auth || {}, action) => state,
    },
    preloadedState: initialState,
  });

const mockUser = {
  given_name: "John",
  family_name: "Doe",
  email: "john@example.com",
  phone_number: "+12345678901", // good: strips to 2345678901 (10 digits)
  zoneinfo: "United States",
};

const defaultStore = createMockStore({
  auth: { user: mockUser },
});

const renderWithProvider = (ui, store = defaultStore) =>
  render(<Provider store={store}>{ui}</Provider>);

// --- Tests ---
describe("YourProfile", () => {
  const mockSetHasUnsavedChanges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
    fireEvent.click(screen.getByText("EDIT"));
    await waitFor(() => {
      expect(screen.getByText("SAVE")).toBeInTheDocument();
      expect(screen.getByText("CANCEL")).toBeInTheDocument();
    });
  });

  it("shows input fields in edit mode", async () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    fireEvent.click(screen.getByText("EDIT"));
    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    });
  });

  it("sends verification and navigates when email is changed and saved", async () => {
    const { updateUserAttributes } = require("aws-amplify/auth");

    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("EDIT"));
    // ensure the phone input mock mounted & set the phone before saving
    await screen.findByTestId("phone-input-mock");
    await new Promise((r) => setTimeout(r, 0)); // flush state microtask

    const emailInput = screen.getByDisplayValue(/.+@.+\..+/);
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });

    fireEvent.click(screen.getByText("SAVE"));

    await waitFor(() => {
      expect(updateUserAttributes).toHaveBeenCalledWith({
        userAttributes: { email: "new@example.com" },
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/verify-otp",
        expect.objectContaining({
          state: expect.objectContaining({
            email: "new@example.com",
            isEmailUpdate: true,
          }),
        }),
      );
    });
  });

  it("calls setHasUnsavedChanges when input changes", async () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    fireEvent.click(screen.getByText("EDIT"));
    await waitFor(() => {
      const firstNameInput = screen.getByDisplayValue("John");
      fireEvent.change(firstNameInput, { target: { value: "Jane" } });
      expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
    });
  });

  it("opens call modal when phone icon is clicked", () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    fireEvent.click(screen.getByTestId("phone-call-icon"));
    expect(screen.getByTestId("call-modal")).toBeInTheDocument();
    expect(screen.getByText("CallModal - audio")).toBeInTheDocument();
  });

  it("opens video call modal when video icon is clicked", () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    fireEvent.click(screen.getByTestId("video-call-icon"));
    expect(screen.getByTestId("call-modal")).toBeInTheDocument();
    expect(screen.getByText("CallModal - video")).toBeInTheDocument();
  });

  it("cancels editing and resets form", async () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    fireEvent.click(screen.getByText("EDIT"));
    await waitFor(() => {
      const firstNameInput = screen.getByDisplayValue("John");
      fireEvent.change(firstNameInput, { target: { value: "Jane" } });
      fireEvent.click(screen.getByText("CANCEL"));
    });
    await waitFor(() => {
      expect(screen.getByText("EDIT")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
    });
  });

  it("handles user with no phone number", () => {
    const storeWithoutPhone = createMockStore({
      auth: { user: { ...mockUser, phone_number: null } },
    });
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      storeWithoutPhone,
    );
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
