import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import YourProfile from "./YourProfile";

// Mock i18n and react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key, // Simple translation mock that returns the key
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock other dependencies
jest.mock("aws-amplify/auth", () => ({
  updateUserAttributes: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn().mockReturnValue({
    auth: {
      user: {
        given_name: "John",
        family_name: "Doe",
        email: "john.doe@example.com",
        phone_number: "+1234567890",
        zoneinfo: "United States",
      },
    },
  }),
  useDispatch: () => jest.fn(),
}));

jest.mock("react-select-country-list", () => () => ({
  getData: () => [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
  ],
}));

jest.mock("./CallModal.jsx", () => () => (
  <div data-testid="call-modal">Call Modal</div>
));

jest.mock("../../common/components/Loading/Loading", () => () => (
  <div data-testid="loading-indicator">Loading...</div>
));

jest.mock("../../utils/phone-codes-en", () => ({
  US: {
    primary: "United States",
    secondary: "+1",
    country: "United States",
    dialCode: "+1",
  },
}));

jest.mock("../../utils/utils", () => ({
  getPhoneCodeslist: () => [
    { code: "US", country: "United States", dialCode: "+1" },
  ],
}));

describe("YourProfile Component", () => {
  const mockSetHasUnsavedChanges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user profile information correctly", () => {
    render(<YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

    // Use more flexible queries to find the displayed user data
    expect(screen.getByDisplayValue(/John/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Doe/i)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(/john.doe@example.com/i),
    ).toBeInTheDocument();
  });

  it("switches between view and edit modes", async () => {
    render(<YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

    // Initial view mode assertions
    expect(screen.getByText(/EDIT/i)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(/EDIT/i));
    });

    // Edit mode assertions
    expect(screen.getByText(/SAVE/i)).toBeInTheDocument();
    expect(screen.getByText(/CANCEL/i)).toBeInTheDocument();
  });

  it("handles input changes in edit mode", async () => {
    render(<YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

    await act(async () => {
      fireEvent.click(screen.getByText(/EDIT/i));
    });

    const firstNameInput = screen.getByDisplayValue(/John/i);
    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    });

    expect(firstNameInput.value).toBe("Jane");
  });

  it("shows loading state during save", async () => {
    // Mock the dispatch to resolve after a delay
    const mockDispatch = jest
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true }), 100),
          ),
      );

    jest.mock("react-redux", () => ({
      ...jest.requireActual("react-redux"),
      useDispatch: () => mockDispatch,
    }));

    render(<YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

    await act(async () => {
      fireEvent.click(screen.getByText(/EDIT/i));
      fireEvent.click(screen.getByText(/SAVE/i));
    });

    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
