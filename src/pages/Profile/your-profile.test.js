import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import YourProfile from "./YourProfile";
import { useNavigate } from "react-router-dom";

// Mock the external dependencies
jest.mock("aws-amplify/auth", () => ({
  updateUserAttributes: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
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

jest.mock("../../redux/features/authentication/authActions", () => ({
  updateUserProfile: jest.fn(() => ({
    type: "UPDATE_USER_PROFILE",
    payload: { success: true },
  })),
}));

// Mock router navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

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
  return render(<Provider store={store}>{component}</Provider>);
};

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

  it("shows edit button when not in editing mode", () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    expect(screen.getByText("EDIT")).toBeInTheDocument();
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

  it("shows email verification required message when email is changed", async () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    fireEvent.click(screen.getByText("EDIT"));

    const emailInput = await screen.findByDisplayValue("john@example.com");
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });

    expect(
      screen.getByText(/Email verification will be required/i),
    ).toBeInTheDocument();
  });

  it("triggers navigation on save with email change", async () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    fireEvent.click(screen.getByText("EDIT"));

    const emailInput = await screen.findByDisplayValue("john@example.com");
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });

    const saveButton = screen.getByText("SAVE");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/verify-otp",
        expect.any(Object),
      );
    });
  });

  it("handles cancel editing and resets form", async () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    fireEvent.click(screen.getByText("EDIT"));

    const firstNameInput = await screen.findByDisplayValue("John");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    fireEvent.click(screen.getByText("CANCEL"));
    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
    });
  });

  it("opens call modal when phone icon is clicked", () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    fireEvent.click(screen.getByTestId("phone-call-icon"));
    expect(screen.getByTestId("call-modal")).toBeInTheDocument();
  });

  it("opens call modal when video icon is clicked", () => {
    renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    fireEvent.click(screen.getByTestId("video-call-icon"));
    expect(screen.getByTestId("call-modal")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderWithProvider(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
