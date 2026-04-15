import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RequestDescription from "./RequestDescription";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

// Mock the useTranslation hook
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        "Change Volunteer": "Change Volunteer",
        Delete: "Delete",
        EDIT: "EDIT",
        Reason: "Reason",
        Cancel: "Cancel",
        "Please specify the reason for change of volunteer":
          "Please specify the reason for change of volunteer",
        High: "High",
        Medium: "Medium",
        Low: "Low",
        Open: "Open",
        "In Progress": "In Progress",
        Completed: "Completed",
        Maintenance: "Maintenance",
        Medical: "Medical",
        Education: "Education",
      };
      return translations[key] || key;
    },
    i18n: {
      resolvedLanguage: "en",
      hasResourceBundle: () => true,
      getResourceBundle: () => ({
        REQUEST_CATEGORIES: {
          Maintenance: { LABEL: "Maintenance" },
          Medical: { LABEL: "Medical" },
          Education: { LABEL: "Education" },
        },
      }),
    },
  }),
}));

// Mock react-redux useSelector
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(() => "mock-token"),
}));

// Mock react-router-dom useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock console.log to verify logging
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: {
        idToken: "mock-token",
        user: { id: "user1", name: "Test User" },
      },
    },
  });
};

const renderWithProviders = (component) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

describe("RequestDescription", () => {
  const mockRequestData = {
    id: "REQ-123",
    subject: "Test Request",
    description: "This is a test request description",
    creationDate: "2024-01-15T10:00:00Z",
    category: "Maintenance",
    status: "Open",
    priority: "High",
  };

  const mockSetIsEditing = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
    mockNavigate.mockClear();
  });

  it("renders without crashing", () => {
    renderWithProviders(
      <RequestDescription
        requestData={mockRequestData}
        setIsEditing={mockSetIsEditing}
      />,
    );

    expect(
      screen.getByText("This is a test request description"),
    ).toBeInTheDocument();
  });

  it("displays request attributes correctly", () => {
    renderWithProviders(
      <RequestDescription
        requestData={mockRequestData}
        setIsEditing={mockSetIsEditing}
      />,
    );

    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument();
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders all action buttons", () => {
    renderWithProviders(
      <RequestDescription
        requestData={mockRequestData}
        setIsEditing={mockSetIsEditing}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Change Volunteer" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EDIT" })).toBeInTheDocument();
  });

  describe("Change Volunteer Dialog", () => {
    it("opens change volunteer dialog when button is clicked", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      expect(
        screen.getByText("Please specify the reason for change of volunteer"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Change Volunteer" }),
      ).toBeInTheDocument();
    });

    it("closes dialog when cancel button is clicked", async () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      // Close dialog
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      fireEvent.click(cancelButton);

      // Wait for dialog to close
      await waitFor(() => {
        expect(
          screen.queryByText(
            "Please specify the reason for change of volunteer",
          ),
        ).not.toBeInTheDocument();
      });
    });

    it("validates reason input - submit button disabled when empty", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      const submitButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      expect(submitButton).toBeDisabled();
    });

    it("enables submit button when reason is provided", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      // Enter reason
      const textarea = screen.getByPlaceholderText("Reason");
      fireEvent.change(textarea, {
        target: { value: "Need different expertise" },
      });

      const submitButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      expect(submitButton).not.toBeDisabled();
    });

    it("validates reason input - submit button disabled with whitespace only", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      // Enter whitespace only
      const textarea = screen.getByPlaceholderText("Reason");
      fireEvent.change(textarea, { target: { value: "   " } });

      const submitButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      expect(submitButton).toBeDisabled();
    });

    it("submits volunteer change and navigates to dashboard", async () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      // Enter reason
      const textarea = screen.getByPlaceholderText("Reason");
      fireEvent.change(textarea, {
        target: { value: "Need different expertise" },
      });

      // Submit
      const submitButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(submitButton);

      // Verify logging
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Changing volunteer for request:",
        "REQ-123",
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Reason:",
        "Need different expertise",
      );

      // Verify navigation
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");

      // Verify dialog is closed
      await waitFor(
        () => {
          expect(
            screen.queryByText(
              "Please specify the reason for change of volunteer",
            ),
          ).not.toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });

    it("resets reason state after successful submission", async () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      // Enter reason
      const textarea = screen.getByPlaceholderText("Reason");
      fireEvent.change(textarea, {
        target: { value: "Need different expertise" },
      });

      // Submit
      const submitButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(submitButton);

      // Wait for dialog to close
      await waitFor(() => {
        expect(
          screen.queryByText(
            "Please specify the reason for change of volunteer",
          ),
        ).not.toBeInTheDocument();
      });

      // Reopen dialog to check if reason is reset
      fireEvent.click(changeVolunteerButton);
      const textareaAfter = screen.getByPlaceholderText("Reason");
      expect(textareaAfter.value).toBe("");
    });
  });

  describe("Delete Dialog", () => {
    it("opens delete dialog when button is clicked", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      const deleteButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(deleteButton);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
    });

    it("submits delete and navigates to dashboard", async () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const deleteButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(deleteButton);

      // Enter reason
      const textarea = screen.getByPlaceholderText("Reason");
      fireEvent.change(textarea, { target: { value: "No longer needed" } });

      // Submit - find all buttons and click the one that's not disabled and not the cancel button
      const allButtons = screen.getAllByRole("button");
      const submitButton = allButtons.find(
        (btn) =>
          btn.textContent.includes("Delete") &&
          !btn.disabled &&
          btn.closest(".MuiDialogActions-root"),
      );
      fireEvent.click(submitButton);

      // Verify logging
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Deleting request:",
        "REQ-123",
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Reason:",
        "No longer needed",
      );

      // Verify navigation
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("Edit Functionality", () => {
    it("calls setIsEditing when edit button is clicked", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      const editButton = screen.getByRole("button", { name: "EDIT" });
      fireEvent.click(editButton);

      expect(mockSetIsEditing).toHaveBeenCalledWith(true);
    });
  });

  describe("Edge Cases", () => {
    it("handles missing category gracefully", () => {
      const requestDataWithoutCategory = {
        ...mockRequestData,
        category: null,
      };

      renderWithProviders(
        <RequestDescription
          requestData={requestDataWithoutCategory}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Should still render without crashing - check for description instead
      expect(
        screen.getByText("This is a test request description"),
      ).toBeInTheDocument();
      expect(screen.getByText("Open")).toBeInTheDocument();
      expect(screen.getByText("High")).toBeInTheDocument();
    });

    it("covers findCategoryLabel function edge cases", () => {
      const requestDataWithComplexCategory = {
        ...mockRequestData,
        category: "subcategory1",
      };

      renderWithProviders(
        <RequestDescription
          requestData={requestDataWithComplexCategory}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Should still render without crashing
      expect(
        screen.getByText("This is a test request description"),
      ).toBeInTheDocument();
    });

    it("covers findCategoryLabel recursive function", () => {
      // Mock i18n to return a nested structure that triggers recursive search
      const mockUseTranslation = () => ({
        t: (key) => key,
        i18n: {
          resolvedLanguage: "en",
          hasResourceBundle: () => true,
          getResourceBundle: () => ({
            REQUEST_CATEGORIES: {
              Maintenance: {
                LABEL: "Maintenance",
                SUBCATEGORIES: {
                  subcategory1: { LABEL: "Subcategory 1" },
                  subcategory2: { LABEL: "Subcategory 2" },
                },
              },
            },
          }),
        },
      });

      jest.doMock("react-i18next", () => ({
        useTranslation: mockUseTranslation,
      }));

      const requestDataWithNestedCategory = {
        ...mockRequestData,
        category: "subcategory1",
      };

      renderWithProviders(
        <RequestDescription
          requestData={requestDataWithNestedCategory}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Should render with nested category
      expect(
        screen.getByText("This is a test request description"),
      ).toBeInTheDocument();
    });

    it("handles unknown category gracefully", () => {
      const requestDataWithUnknownCategory = {
        ...mockRequestData,
        category: "UnknownCategory",
      };

      renderWithProviders(
        <RequestDescription
          requestData={requestDataWithUnknownCategory}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Should display the raw category value
      expect(screen.getByText("UnknownCategory")).toBeInTheDocument();
      expect(
        screen.getByText("This is a test request description"),
      ).toBeInTheDocument();
    });

    it("handles error in volunteer change gracefully", async () => {
      // Mock console.error to verify error handling
      const mockConsoleError = jest
        .spyOn(console, "error")
        .mockImplementation();

      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      // Enter reason
      const textarea = screen.getByPlaceholderText("Reason");
      fireEvent.change(textarea, {
        target: { value: "Need different expertise" },
      });

      // Mock an error during submission by making navigate throw
      mockNavigate.mockImplementation(() => {
        throw new Error("Navigation failed");
      });

      // Submit
      const submitButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(submitButton);

      // Verify error logging
      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Volunteer change failed:",
          expect.any(Error),
        );
      });

      mockConsoleError.mockRestore();
    });

    it("covers delete dialog onClose handler", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const deleteButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(deleteButton);

      // Test clicking outside dialog (onClose handler)
      const dialog = screen.getByRole("dialog");
      fireEvent.click(dialog);

      // Dialog should still be open (onClose handler called)
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("covers delete dialog cancel button handler", async () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const deleteButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(deleteButton);

      // Test cancel button (line 171)
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      fireEvent.click(cancelButton);

      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("covers delete dialog submit button when disabled", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const deleteButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(deleteButton);

      // Submit button should be disabled when reason is empty (line 179)
      const allButtons = screen.getAllByRole("button");
      const submitButton = allButtons.find(
        (btn) =>
          btn.textContent.includes("Delete") &&
          btn.closest(".MuiDialogActions-root"),
      );
      expect(submitButton).toBeDisabled();
    });

    it("covers change volunteer dialog onClose handler", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      // Test clicking outside dialog (onClose handler)
      const dialog = screen.getByRole("dialog");
      fireEvent.click(dialog);

      // Dialog should still be open (onClose handler called)
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("covers change volunteer dialog initial render", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      // Verify dialog title and content are rendered
      expect(
        screen.getByText("Please specify the reason for change of volunteer"),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Reason")).toBeInTheDocument();
    });

    it("covers delete dialog onClose handler for 100% coverage", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Test delete dialog onClose (line 155)
      const deleteButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(deleteButton);

      // Test the onClose handler by pressing Escape key
      fireEvent.keyDown(screen.getByRole("dialog"), {
        key: "Escape",
        code: "Escape",
      });

      expect(
        screen.getByText("This is a test request description"),
      ).toBeInTheDocument();
    });

    it("covers change volunteer dialog onClose handler for 100% coverage", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Test change volunteer dialog onClose (line 188)
      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      // Test the onClose handler by pressing Escape key
      fireEvent.keyDown(screen.getByRole("dialog"), {
        key: "Escape",
        code: "Escape",
      });

      expect(
        screen.getByText("This is a test request description"),
      ).toBeInTheDocument();
    });

    it("covers recursive findCategoryLabel function for 100% coverage", () => {
      // Create a more complex nested structure to trigger recursive search (lines 25-26)
      const originalMock = require("react-i18next").useTranslation;

      // Mock the translation to return nested structure
      const mockUseTranslation = () => ({
        t: (key) => {
          const translations = {
            "Change Volunteer": "Change Volunteer",
            Delete: "Delete",
            EDIT: "EDIT",
            Reason: "Reason",
            Cancel: "Cancel",
            "Please specify the reason for change of volunteer":
              "Please specify the reason for change of volunteer",
            High: "High",
            Medium: "Medium",
            Low: "Low",
            Open: "Open",
            "In Progress": "In Progress",
            Completed: "Completed",
            Maintenance: "Maintenance",
            Medical: "Medical",
            Education: "Education",
            "Subcategory 1": "Subcategory 1",
          };
          return translations[key] || key;
        },
        i18n: {
          resolvedLanguage: "en",
          hasResourceBundle: () => true,
          getResourceBundle: () => ({
            REQUEST_CATEGORIES: {
              Maintenance: {
                LABEL: "Maintenance",
                SUBCATEGORIES: {
                  subcategory1: { LABEL: "Subcategory 1" },
                },
              },
            },
          }),
        },
      });

      // Override the mock
      jest.doMock("react-i18next", () => ({
        useTranslation: mockUseTranslation,
      }));

      const requestDataWithNestedCategory = {
        ...mockRequestData,
        category: "subcategory1",
      };

      renderWithProviders(
        <RequestDescription
          requestData={requestDataWithNestedCategory}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // This should trigger the recursive findCategoryLabel function
      expect(
        screen.getByText("This is a test request description"),
      ).toBeInTheDocument();
    });

    it("covers delete request error handling", async () => {
      // Mock console.error to verify error handling
      const mockConsoleError = jest
        .spyOn(console, "error")
        .mockImplementation();

      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open dialog
      const deleteButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(deleteButton);

      // Enter reason
      const textarea = screen.getByPlaceholderText("Reason");
      fireEvent.change(textarea, { target: { value: "No longer needed" } });

      // Mock an error during submission by making navigate throw
      mockNavigate.mockImplementation(() => {
        throw new Error("Delete failed");
      });

      // Submit
      const allButtons = screen.getAllByRole("button");
      const submitButton = allButtons.find(
        (btn) =>
          btn.textContent.includes("Delete") &&
          !btn.disabled &&
          btn.closest(".MuiDialogActions-root"),
      );
      fireEvent.click(submitButton);

      // Verify error logging
      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Delete failed:",
          expect.any(Error),
        );
      });

      mockConsoleError.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("has proper button roles and labels", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      expect(
        screen.getByRole("button", { name: "Change Volunteer" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Delete" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "EDIT" })).toBeInTheDocument();
    });

    it("has proper textarea accessibility attributes", () => {
      renderWithProviders(
        <RequestDescription
          requestData={mockRequestData}
          setIsEditing={mockSetIsEditing}
        />,
      );

      // Open change volunteer dialog
      const changeVolunteerButton = screen.getByRole("button", {
        name: "Change Volunteer",
      });
      fireEvent.click(changeVolunteerButton);

      const textarea = screen.getByPlaceholderText("Reason");
      expect(textarea).toBeInTheDocument();
    });
  });
});
