import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PersonalInformation from "./PersonalInformation";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock country-state-city
jest.mock("country-state-city", () => ({
  Country: {
    getAllCountries: jest.fn(() => [
      { name: "United States", isoCode: "US" },
      { name: "Canada", isoCode: "CA" },
    ]),
  },
  State: {
    getStatesOfCountry: jest.fn((countryCode) => {
      if (countryCode === "US") {
        return [
          { name: "California", isoCode: "CA" },
          { name: "New York", isoCode: "NY" },
          { name: "Texas", isoCode: "TX" },
        ];
      }
      return [];
    }),
  },
}));

// Mock react-select-country-list
jest.mock("react-select-country-list", () => {
  return jest.fn(() => ({
    getData: () => [
      { label: "United States", value: "US" },
      { label: "Canada", value: "CA" },
    ],
  }));
});

// Mock getPhoneCodeslist
jest.mock("../../utils/utils", () => ({
  getPhoneCodeslist: jest.fn(() => [
    { label: "+1", value: "US" },
    { label: "+1", value: "CA" },
  ]),
}));

describe("PersonalInformation State Field Persistence", () => {
  const mockSetHasUnsavedChanges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  test("should display saved state value after component remount when localStorage has data", async () => {
    // Mock localStorage with saved personal info including state
    const savedPersonalInfo = {
      dateOfBirth: "1990-01-01",
      gender: "Male",
      streetAddress: "123 Main St",
      streetAddress2: "",
      country: "United States",
      state: "California",
      zipCode: "12345",
      secondaryEmail: "test@example.com",
      secondaryPhone: "5551234567",
      secondaryPhoneCountryCode: "US",
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedPersonalInfo));

    // First render - simulate initial load
    const { unmount } = render(
      <PersonalInformation setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    // Wait for states to be populated asynchronously by checking for any text that contains state info
    await waitFor(
      () => {
        const stateElements = screen.queryAllByText("California");
        expect(stateElements.length).toBeGreaterThan(0);
      },
      { timeout: 1000 },
    );

    // Unmount component (simulating tab switch away)
    unmount();

    // Re-render component (simulating tab switch back)
    render(
      <PersonalInformation setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    // Wait for states to be populated again
    await waitFor(
      () => {
        const stateElements = screen.queryAllByText("California");
        expect(stateElements.length).toBeGreaterThan(0);
      },
      { timeout: 1000 },
    );

    // Verify the state value is still displayed
    expect(screen.getByText("California")).toBeInTheDocument();
  });

  test("should handle editing state field correctly", async () => {
    const savedPersonalInfo = {
      dateOfBirth: "1990-01-01",
      gender: "Male",
      streetAddress: "123 Main St",
      streetAddress2: "",
      country: "United States",
      state: "California",
      zipCode: "12345",
      secondaryEmail: "test@example.com",
      secondaryPhone: "5551234567",
      secondaryPhoneCountryCode: "US",
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedPersonalInfo));

    render(
      <PersonalInformation setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    // Wait for component to load by checking for the state value first
    await waitFor(
      () => {
        const stateElements = screen.queryAllByText("California");
        expect(stateElements.length).toBeGreaterThan(0);
      },
      { timeout: 1000 },
    );

    // Click edit button
    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);

    // Check that select fields are now rendered (in editing mode)
    await waitFor(
      () => {
        const selects = screen.getAllByRole("combobox");
        expect(selects.length).toBeGreaterThan(0);
      },
      { timeout: 1000 },
    );
  });
});
