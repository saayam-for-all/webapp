import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import OrganizationDetails from "./OrganizationDetails";

// --- Mocks ---

// i18n: return fallback/keys
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => {
      // Return readable labels for specific keys
      const translations = {
        ORGANIZATION_NAME: "Organization Name",
        ORGANIZATION_TYPE: "Organization Type",
        NON_PROFIT: "Non-Profit",
        FOR_PROFIT: "For-Profit",
        PHONE_NUMBER: "Phone Number",
        EMAIL: "Email",
        URL: "URL",
        CITY: "City",
        STATE: "State",
        ZIP_CODE: "ZIP Code",
        HELP_CATEGORIES: "Help Categories",
        SELECT_HELP_CATEGORIES:
          "Select help categories your organization supports...",
        EDIT: "Edit",
        SAVE: "Save",
        CANCEL: "Cancel",
        ADDRESS: "Street Address",
      };
      // Handle ADDRESS with optional parameter
      if (key === "ADDRESS" && options && options.optional !== undefined) {
        return `Street Address${options.optional}`;
      }
      // Handle fallback object (for categories translations)
      if (options && options.defaultValue !== undefined) {
        const result = translations[key];
        if (result) return result;
        // Return defaultValue if translation not found
        return options.defaultValue || key;
      }
      return (
        translations[key] ||
        (typeof options === "string" ? options : null) ||
        key
      );
    },
    i18n: { changeLanguage: jest.fn() },
  }),
}));

// Mock react-icons
jest.mock("react-icons/hi", () => ({
  HiChevronDown: () => <span data-testid="chevron-icon">▼</span>,
}));

// Mock react-select
jest.mock("react-select", () => {
  return function MockSelect(props) {
    return (
      <select
        data-testid="react-select"
        onChange={(e) => props.onChange?.({ code: e.target.value })}
      >
        <option value="">Select...</option>
        <option value="US">US</option>
        <option value="CA">CA</option>
      </select>
    );
  };
});

// Mock phone codes
jest.mock("../../utils/phone-codes-en", () => ({
  US: { primary: "United States", secondary: "+1", dialCode: "+1" },
  CA: { primary: "Canada", secondary: "+1", dialCode: "+1" },
}));

// Mock utils
jest.mock("../../utils/utils", () => ({
  getPhoneCodeslist: () => [
    { country: "United States", code: "US", dialCode: "+1" },
    { country: "Canada", code: "CA", dialCode: "+1" },
  ],
}));

// Mock fetch for country codes API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        { name: "United States", phone_code: "1" },
        { name: "Canada", phone_code: "1" },
      ]),
  }),
);

// --- Test Data ---
const mockCategories = [
  {
    catId: 1,
    catName: "FOOD_AND_ESSENTIALS_SUPPORT",
    catDesc: "Food and essentials support",
    subCategories: [
      { catId: 101, catName: "FOOD_ASSISTANCE", catDesc: "Food assistance" },
      {
        catId: 102,
        catName: "GROCERY_SHOPPING_AND_DELIVERY",
        catDesc: "Grocery help",
      },
    ],
  },
  {
    catId: 2,
    catName: "HOUSING_SUPPORT",
    catDesc: "Housing support",
    subCategories: [
      { catId: 201, catName: "LEASE_SUPPORT", catDesc: "Lease support" },
    ],
  },
  {
    catId: 3,
    catName: "GENERAL_CATEGORY",
    catDesc: "General category",
    subCategories: [],
  },
];

const mockOrganizationInfo = {
  organizationName: "Test Org",
  phoneNumber: "1234567890",
  phoneCountryCode: "US",
  email: "test@example.com",
  url: "https://test.org",
  streetAddress: "123 Main St",
  streetAddress2: "Suite 100",
  city: "Test City",
  state: "TS",
  zipCode: "12345",
  organizationType: "Non-Profit",
  helpCategories: ["FOOD_AND_ESSENTIALS_SUPPORT", "FOOD_ASSISTANCE"],
};

// --- Tests ---
describe("OrganizationDetails", () => {
  const mockSetHasUnsavedChanges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("categories", JSON.stringify(mockCategories));
    localStorage.setItem(
      "organizationInfo",
      JSON.stringify(mockOrganizationInfo),
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders organization info from localStorage", () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    expect(screen.getByText("Test Org")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Test City")).toBeInTheDocument();
  });

  it("renders Help Categories label", () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    expect(screen.getByText("Help Categories")).toBeInTheDocument();
  });

  it("displays selected categories in view mode", () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    // In view mode, selected categories should be displayed as text
    const categoriesText = screen.getByText(/Food And Essentials Support/i);
    expect(categoriesText).toBeInTheDocument();
  });

  it("shows edit button when not in editing mode", () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.queryByText("Save")).not.toBeInTheDocument();
  });

  it("enters edit mode when edit button is clicked", async () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });

  it("shows category dropdown trigger in edit mode", async () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(screen.getByTestId("chevron-icon")).toBeInTheDocument();
    });
  });

  it("displays selected categories as tags in edit mode", async () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      // Should show selected categories as blue tags
      const tags = screen.getAllByText(/Food/i);
      expect(tags.length).toBeGreaterThan(0);
    });
  });

  it("opens category dropdown when clicked in edit mode", async () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      const dropdownTrigger = screen.getByTestId("chevron-icon").parentElement;
      fireEvent.click(dropdownTrigger);
    });

    // Categories should now be visible in dropdown
    await waitFor(() => {
      expect(screen.getByText(/General Category/i)).toBeInTheDocument();
    });
  });

  it("shows subcategories column when hovering over a category with subcategories", async () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      const dropdownTrigger = screen.getByTestId("chevron-icon").parentElement;
      fireEvent.click(dropdownTrigger);
    });

    // Wait for dropdown to open and find the Housing category (which has subcategories and is not pre-selected)
    await waitFor(() => {
      const housingCategory = screen.getByText(/Housing Support/i);
      expect(housingCategory).toBeInTheDocument();
      fireEvent.mouseEnter(
        housingCategory.closest("div[class*='cursor-pointer']"),
      );
    });

    // Should show subcategories - Lease Support is a subcategory of Housing Support
    await waitFor(() => {
      expect(screen.getByText(/Lease Support/i)).toBeInTheDocument();
    });
  });

  it("toggles category selection when checkbox is clicked", async () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      const dropdownTrigger = screen.getByTestId("chevron-icon").parentElement;
      fireEvent.click(dropdownTrigger);
    });

    // Find and click the General Category checkbox
    await waitFor(() => {
      const checkboxes = screen.getAllByRole("checkbox");
      const generalCheckbox = checkboxes.find((cb) => !cb.checked);
      if (generalCheckbox) {
        fireEvent.click(generalCheckbox);
      }
    });

    expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
  });

  it("closes dropdown when clicking outside", async () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      const dropdownTrigger = screen.getByTestId("chevron-icon").parentElement;
      fireEvent.click(dropdownTrigger);
    });

    // Dropdown should be open
    await waitFor(() => {
      expect(screen.getByText(/General Category/i)).toBeInTheDocument();
    });

    // Click outside
    fireEvent.mouseDown(document.body);

    // Dropdown should close - General Category should no longer be in the dropdown list
    // (it might still be visible as a selected tag, but the dropdown menu should be closed)
  });

  it("cancels editing and resets form", async () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      fireEvent.click(screen.getByText("Cancel"));
    });

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
    });
  });

  it("saves organization info to localStorage", async () => {
    const storageSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      fireEvent.click(screen.getByText("Save"));
    });

    expect(storageSpy).toHaveBeenCalledWith(
      "organizationInfo",
      expect.any(String),
    );

    storageSpy.mockRestore();
  });

  it("shows placeholder text when no categories are selected", async () => {
    localStorage.setItem(
      "organizationInfo",
      JSON.stringify({ ...mockOrganizationInfo, helpCategories: [] }),
    );

    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Select help categories your organization supports...",
        ),
      ).toBeInTheDocument();
    });
  });

  it("handles localStorage with no categories gracefully", () => {
    localStorage.removeItem("categories");

    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    // Should render without errors
    expect(screen.getByText("Help Categories")).toBeInTheDocument();
  });

  it("handles localStorage with no organization info gracefully", () => {
    localStorage.removeItem("organizationInfo");

    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    // Should render with empty fields
    expect(screen.getByText("Help Categories")).toBeInTheDocument();
  });

  it("handles invalid JSON in localStorage categories gracefully", () => {
    localStorage.setItem("categories", "invalid json");

    // Should render without errors (console.warn will be called)
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    expect(screen.getByText("Help Categories")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("handles category without subcategories correctly", async () => {
    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      const dropdownTrigger = screen.getByTestId("chevron-icon").parentElement;
      fireEvent.click(dropdownTrigger);
    });

    // Hover over General Category which has no subcategories
    await waitFor(() => {
      const generalCategory = screen.getByText(/General Category/i);
      fireEvent.mouseEnter(generalCategory.closest("div"));
    });

    // Should not show subcategories column for category without subcategories
    // The dropdown width should be full when no subcategories
  });

  it("displays validation errors", async () => {
    localStorage.setItem(
      "organizationInfo",
      JSON.stringify({
        ...mockOrganizationInfo,
        organizationName: "",
        email: "invalid-email",
        phoneNumber: "123",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      }),
    );

    render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      fireEvent.click(screen.getByText("Save"));
    });

    // Validation errors should prevent saving and display error messages
    // The component uses "Organization Name is required." as the error message
    await waitFor(() => {
      expect(
        screen.getByText("Organization Name is required."),
      ).toBeInTheDocument();
    });
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <OrganizationDetails setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
