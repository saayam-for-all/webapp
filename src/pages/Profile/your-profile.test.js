import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import YourProfile from "./YourProfile";

// Mock i18n and react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => `mockTranslate(${key})`, // Modified to match snapshot format
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

    // Check for translation keys in labels
    expect(screen.getByText("mockTranslate(FIRST_NAME)")).toBeInTheDocument();
    expect(screen.getByText("mockTranslate(LAST_NAME)")).toBeInTheDocument();
    expect(screen.getByText("mockTranslate(EMAIL)")).toBeInTheDocument();

    // Check for edit button
    expect(screen.getByText("mockTranslate(EDIT)")).toBeInTheDocument();
  });

  it("switches between view and edit modes", async () => {
    render(<YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

    // Initial view mode assertions
    expect(screen.getByText("mockTranslate(EDIT)")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("mockTranslate(EDIT)"));
    });

    // Edit mode assertions
    expect(screen.getByText("mockTranslate(SAVE)")).toBeInTheDocument();
    expect(screen.getByText("mockTranslate(CANCEL)")).toBeInTheDocument();
  });

  it("handles input changes in edit mode", async () => {
    render(<YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

    await act(async () => {
      fireEvent.click(screen.getByText("mockTranslate(EDIT)"));
    });

    // Find inputs by their labels
    const firstNameInput = screen.getByLabelText("mockTranslate(FIRST_NAME)");
    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    });

    expect(firstNameInput.value).toBe("Jane");
  });

  it("shows loading state during save", async () => {
    render(<YourProfile setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

    await act(async () => {
      fireEvent.click(screen.getByText("mockTranslate(EDIT)"));
      fireEvent.click(screen.getByText("mockTranslate(SAVE)"));
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
