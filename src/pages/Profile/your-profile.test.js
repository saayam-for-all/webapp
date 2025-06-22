import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import YourProfile from "./YourProfile";

// Minimal mocks
jest.mock("aws-amplify/auth", () => ({
  updateUserAttributes: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../redux/features/authentication/authActions", () => ({
  updateUserProfile: jest.fn().mockImplementation(() => ({
    then: (callback) => callback({ success: true }),
    catch: (callback) => ({ then: () => ({}) }),
  })),
}));

jest.mock("./CallModal.jsx", () => {
  return function CallModal() {
    return <div data-testid="call-modal">Call Modal</div>;
  };
});

jest.mock("../../common/components/Loading/Loading", () => {
  return function LoadingIndicator() {
    return <div data-testid="loading">Loading</div>;
  };
});

jest.mock("react-select-country-list", () => {
  return function CountryList() {
    return {
      getData: () => [
        { value: "US", label: "United States" },
        { value: "CA", label: "Canada" },
      ],
    };
  };
});

jest.mock("../../utils/utils", () => ({
  getPhoneCodeslist: () => [
    { code: "US", country: "United States", dialCode: "+1" },
    { code: "CA", country: "Canada", dialCode: "+1" },
  ],
}));

jest.mock("../../utils/phone-codes-en", () => ({
  US: { primary: "United States", secondary: "+1" },
  CA: { primary: "Canada", secondary: "+1" },
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => defaultValue || key,
  }),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Simple store setup
const createTestStore = (user = null) => {
  return configureStore({
    reducer: {
      auth: (state = { user }) => state,
    },
    preloadedState: {
      auth: {
        user: user || {
          given_name: "John",
          family_name: "Doe",
          email: "john@example.com",
          phone_number: "+1234567890",
          zoneinfo: "United States",
        },
      },
    },
  });
};

const TestWrapper = ({ children, user = null }) => (
  <Provider store={createTestStore(user)}>
    <BrowserRouter>{children}</BrowserRouter>
  </Provider>
);

describe("YourProfile - Basic Tests", () => {
  let mockSetHasUnsavedChanges;

  beforeEach(() => {
    mockSetHasUnsavedChanges = jest.fn();
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  test("renders without crashing", () => {
    render(
      <TestWrapper>
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
      </TestWrapper>,
    );

    expect(screen.getByText("EDIT")).toBeInTheDocument();
  });

  test("displays user information", () => {
    render(
      <TestWrapper>
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
      </TestWrapper>,
    );

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  test("enters edit mode", () => {
    render(
      <TestWrapper>
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByText("EDIT"));

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByText("SAVE")).toBeInTheDocument();
    expect(screen.getByText("CANCEL")).toBeInTheDocument();
  });

  test("updates form fields", () => {
    render(
      <TestWrapper>
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByText("EDIT"));

    const firstNameInput = screen.getByDisplayValue("John");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
  });

  test("cancels editing", () => {
    render(
      <TestWrapper>
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByText("EDIT"));

    const firstNameInput = screen.getByDisplayValue("John");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    fireEvent.click(screen.getByText("CANCEL"));

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("EDIT")).toBeInTheDocument();
    expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
  });

  test("handles empty user data", () => {
    render(
      <TestWrapper user={null}>
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
      </TestWrapper>,
    );

    expect(screen.getByText("EDIT")).toBeInTheDocument();
  });

  test("handles phone number formatting", () => {
    render(
      <TestWrapper>
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByText("EDIT"));

    const phoneInput = screen.getByPlaceholderText("1234567890");
    fireEvent.change(phoneInput, { target: { value: "abc123def456" } });

    expect(screen.getByDisplayValue("123456")).toBeInTheDocument();
  });

  test("shows email verification notice", () => {
    render(
      <TestWrapper>
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByText("EDIT"));

    const emailInput = screen.getByDisplayValue("john@example.com");
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });

    expect(screen.getByText("EMAIL_VERIFICATION_REQUIRED")).toBeInTheDocument();
  });

  test("validates required fields", async () => {
    render(
      <TestWrapper>
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByText("EDIT"));

    const firstNameInput = screen.getByDisplayValue("John");
    fireEvent.change(firstNameInput, { target: { value: "" } });

    fireEvent.click(screen.getByText("SAVE"));

    await waitFor(() => {
      expect(
        screen.getByText("First and last name are required"),
      ).toBeInTheDocument();
    });
  });

  test("validates email field", async () => {
    render(
      <TestWrapper>
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByText("EDIT"));

    const emailInput = screen.getByDisplayValue("john@example.com");
    fireEvent.change(emailInput, { target: { value: "" } });

    fireEvent.click(screen.getByText("SAVE"));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  test("handles country selection", () => {
    render(
      <TestWrapper>
        <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />
      </TestWrapper>,
    );

    fireEvent.click(screen.getByText("EDIT"));

    const countrySelect = screen.getByDisplayValue("United States");
    fireEvent.change(countrySelect, { target: { value: "Canada" } });

    expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
  });
});
