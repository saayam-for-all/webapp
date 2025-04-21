import React from "react";
import { render, screen } from "@testing-library/react";
import YourProfile from "./YourProfile";

// Mock all dependencies
jest.mock("react-i18next", () => ({
  // This mocks the useTranslation hook
  useTranslation: () => ({
    t: jest.fn((key) => key),
  }),
}));

jest.mock("aws-amplify/auth", () => ({
  updateUserAttributes: jest.fn(),
}));

jest.mock("../../redux/features/authentication/authActions", () => ({
  updateUserProfile: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn((selector) => {
    // Mock the state that useSelector would return
    return (
      {
        auth: {
          user: {
            given_name: "John",
            family_name: "Doe",
            email: "john.doe@example.com",
            phone_number: "+12345678901",
            zoneinfo: "United States",
          },
        },
      }[selector.toString().match(/state\.(\w+)/)?.[1]] || null
    );
  }),
  useDispatch: () => jest.fn().mockResolvedValue({ success: true }),
}));

// Mock the CountryList
jest.mock("react-select-country-list", () => () => ({
  getData: jest.fn().mockReturnValue([
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
  ]),
}));

// Mock the CallModal component
jest.mock("./CallModal.jsx", () => {
  return function DummyCallModal({ isOpen, onClose, callType }) {
    return isOpen ? <div data-testid="call-modal">Mock Call Modal</div> : null;
  };
});

// Mock the Loading component
jest.mock("../../common/components/Loading/Loading", () => {
  return function DummyLoading({ size, className }) {
    return <div data-testid="loading-indicator">Loading...</div>;
  };
});

// Mock the phone codes
jest.mock("../../utils/phone-codes-en", () => ({
  US: {
    primary: "United States",
    secondary: "+1",
    country: "United States",
    dialCode: "+1",
  },
}));

// Mock the phone codes list utils
jest.mock("../../utils/utils", () => ({
  getPhoneCodeslist: jest.fn(() => [
    { code: "US", country: "United States", dialCode: "+1" },
  ]),
}));

describe("YourProfile", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const setHasUnsavedChanges = jest.fn();
    render(<YourProfile setHasUnsavedChanges={setHasUnsavedChanges} />);
    // Basic assertion to make sure something rendered
    expect(document.body.textContent).toBeTruthy();
  });
});
