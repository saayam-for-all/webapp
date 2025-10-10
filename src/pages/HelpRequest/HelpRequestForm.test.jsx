import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";
import HelpRequestForm from "./HelpRequestForm";

// Mock the hooks and services
jest.mock("../../services/requestApi", () => ({
  useAddRequestMutation: () => [jest.fn(), { isLoading: false }],
  useGetAllRequestQuery: () => ({ data: null, error: null, isLoading: false }),
}));

jest.mock("../../redux/features/help_request/requestActions", () => ({
  loadCategories: () => ({ type: "LOAD_CATEGORIES" }),
}));

jest.mock("./location/usePlacesSearchBox", () => ({
  __esModule: true,
  default: () => ({
    inputRef: { current: null },
    isLoaded: true,
    handleOnPlacesChanged: jest.fn(),
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock store
const mockStore = configureStore({
  reducer: {
    request: (state = { categories: [] }) => state,
    auth: (state = { idToken: null, user: { groups: [] } }) => state,
  },
});

const renderWithProviders = (component) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

describe("HelpRequestForm - For Self Dropdown", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should render "For Self" dropdown with default "Yes" selected', () => {
    renderWithProviders(<HelpRequestForm />);

    const dropdown = screen.getByTestId("dropdown");
    expect(dropdown).toBeInTheDocument();
    expect(dropdown.value).toBe("yes");
  });

  test('should have both "Yes" and "No" options available', () => {
    renderWithProviders(<HelpRequestForm />);

    const dropdown = screen.getByTestId("dropdown");
    const options = dropdown.querySelectorAll("option");

    expect(options).toHaveLength(2);
    expect(options[0]).toHaveValue("yes");
    expect(options[1]).toHaveValue("no");
  });

  test('should allow user to select "No" option', async () => {
    renderWithProviders(<HelpRequestForm />);

    const dropdown = screen.getByTestId("dropdown");

    // Initially should be "yes"
    expect(dropdown.value).toBe("yes");

    // Change to "no"
    fireEvent.change(dropdown, { target: { value: "no" } });

    await waitFor(() => {
      expect(dropdown.value).toBe("no");
    });
  });

  test('should allow user to change back to "Yes" option', async () => {
    renderWithProviders(<HelpRequestForm />);

    const dropdown = screen.getByTestId("dropdown");

    // Change to "no"
    fireEvent.change(dropdown, { target: { value: "no" } });
    await waitFor(() => {
      expect(dropdown.value).toBe("no");
    });

    // Change back to "yes"
    fireEvent.change(dropdown, { target: { value: "yes" } });
    await waitFor(() => {
      expect(dropdown.value).toBe("yes");
    });
  });

  test("should not be disabled", () => {
    renderWithProviders(<HelpRequestForm />);

    const dropdown = screen.getByTestId("dropdown");
    expect(dropdown).not.toBeDisabled();
  });

  test("should have correct CSS classes applied", () => {
    renderWithProviders(<HelpRequestForm />);

    const dropdown = screen.getByTestId("dropdown");
    expect(dropdown).toHaveClass(
      "appearance-none",
      "bg-white",
      "border",
      "p-2",
      "w-full",
      "rounded-lg",
      "text-gray-700",
    );
  });
});
