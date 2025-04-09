import React from "react";
import { render, screen, act } from "@testing-library/react";
import YourProfile from "./YourProfile";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

// Mock i18n initialization
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock i18n utils to prevent actual initialization
jest.mock("../../common/i18n/utils", () => ({
  changeUiLanguage: jest.fn(),
  returnDefaultLanguage: jest.fn(),
}));

// Mock AWS Amplify
jest.mock("aws-amplify/auth", () => ({
  updateUserAttributes: jest.fn(() => Promise.resolve()),
}));

// Mock react-select-country-list
jest.mock("react-select-country-list", () => ({
  __esModule: true,
  default: () => ({
    getData: () => [
      { value: "US", label: "United States" },
      { value: "CA", label: "Canada" },
    ],
  }),
}));

// Mock phone codes
jest.mock("../../utils/phone-codes-en", () => ({
  US: { primary: "United States", secondary: "+1" },
  CA: { primary: "Canada", secondary: "+1" },
}));

// Mock utils
jest.mock("../../utils/utils", () => ({
  getPhoneCodeslist: jest.fn(() => [
    { code: "US", country: "United States", dialCode: "+1" },
    { code: "CA", country: "Canada", dialCode: "+1" },
  ]),
}));

// Mock child components
jest.mock("./CallModal.jsx", () => () => <div>CallModal</div>);
jest.mock("../../common/components/Loading/Loading", () => () => (
  <div>Loading...</div>
));

const mockStore = configureStore([]);

describe("YourProfile", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: {
          given_name: "John",
          family_name: "Doe",
          email: "john.doe@example.com",
          phone_number: "+134567890",
          zoneinfo: "United States",
        },
      },
    });
  });

  it("renders user profile information", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <YourProfile setHasUnsavedChanges={jest.fn()} />
        </Provider>,
      );
    });

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("United States")).toBeInTheDocument();
  });

  it("shows edit mode when edit button is clicked", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <YourProfile setHasUnsavedChanges={jest.fn()} />
        </Provider>,
      );
    });

    const editButton = screen.getByText("EDIT");
    await act(async () => {
      editButton.click();
    });

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
  });
});
