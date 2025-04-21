import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import YourProfile from "./YourProfile";

// Mock i18n and react-i18next properly
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

jest.mock("../../common/i18n/i18n", () => ({
  use: jest.fn(),
  init: jest.fn(),
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

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("switches to edit mode when edit button is clicked", async () => {
    render(<YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

    await act(async () => {
      fireEvent.click(screen.getByText("EDIT"));
    });

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
  });

  it("handles input changes in edit mode", async () => {
    render(<YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

    await act(async () => {
      fireEvent.click(screen.getByText("EDIT"));
    });

    const firstNameInput = screen.getByDisplayValue("John");
    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    });

    expect(firstNameInput.value).toBe("Jane");
    expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
  });

  it("cancels edit mode and reverts changes", async () => {
    render(<YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

    await act(async () => {
      fireEvent.click(screen.getByText("EDIT"));
      fireEvent.change(screen.getByDisplayValue("John"), {
        target: { value: "Jane" },
      });
      fireEvent.click(screen.getByText("CANCEL"));
    });

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
  });

  it("displays loading indicator when saving", async () => {
    render(<YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

    await act(async () => {
      fireEvent.click(screen.getByText("EDIT"));
      fireEvent.click(screen.getByText("SAVE"));
    });

    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });
});
