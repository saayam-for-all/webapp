import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import YourProfile from "./YourProfile";

// Mock all dependencies
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

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

jest.mock("./CallModal.jsx", () => () => <div data-testid="call-modal" />);

jest.mock("../../common/components/Loading/Loading", () => () => (
  <div data-testid="loading-indicator" />
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

describe("YourProfile", () => {
  const setHasUnsavedChanges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<YourProfile setHasUnsavedChanges={setHasUnsavedChanges} />);
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
  });

  it("switches to edit mode when edit button is clicked", () => {
    render(<YourProfile setHasUnsavedChanges={setHasUnsavedChanges} />);

    act(() => {
      fireEvent.click(screen.getByText("EDIT"));
    });

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(<YourProfile setHasUnsavedChanges={setHasUnsavedChanges} />);

    act(() => {
      fireEvent.click(screen.getByText("EDIT"));
    });

    const firstNameInput = screen.getByDisplayValue("John");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    expect(firstNameInput.value).toBe("Jane");
    expect(setHasUnsavedChanges).toHaveBeenCalled();
  });

  it("cancels edit mode", () => {
    render(<YourProfile setHasUnsavedChanges={setHasUnsavedChanges} />);

    act(() => {
      fireEvent.click(screen.getByText("EDIT"));
      fireEvent.change(screen.getByDisplayValue("John"), {
        target: { value: "Jane" },
      });
      fireEvent.click(screen.getByText("CANCEL"));
    });

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(setHasUnsavedChanges).toHaveBeenCalledWith(false);
  });
});
