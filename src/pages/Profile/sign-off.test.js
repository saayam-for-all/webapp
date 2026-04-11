import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SignOff from "./SignOff";

// --- Mocks ---

// AWS Amplify auth
const mockDeleteUser = jest.fn();
jest.mock("aws-amplify/auth", () => ({
  deleteUser: () => mockDeleteUser(),
}));

// i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Services
const mockSignOffUser = jest.fn();
const mockGetUserId = jest.fn();
jest.mock("../../services/volunteerServices", () => ({
  signOffUser: (...args) => mockSignOffUser(...args),
  getUserId: (...args) => mockGetUserId(...args),
}));

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock window.location
const mockLocation = { href: "" };
delete window.location;
window.location = mockLocation;

// Mock dispatchEvent
const mockDispatchEvent = jest.fn();
window.dispatchEvent = mockDispatchEvent;

// --- Helpers ---
const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: {
      auth: (state = initialState.auth || {}, action) => state,
    },
    preloadedState: initialState,
  });

const mockUser = {
  userDbId: "SID-00-000-001",
  email: "test@example.com",
};

const defaultStore = createMockStore({
  auth: { user: mockUser },
});

const renderWithProvider = (ui, store = defaultStore) =>
  render(<Provider store={store}>{ui}</Provider>);

// --- Tests ---
describe("SignOff", () => {
  const mockSetHasUnsavedChanges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockLocation.href = "";
    mockSignOffUser.mockResolvedValue({ success: true });
    mockDeleteUser.mockResolvedValue({});
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the sign off component", () => {
    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    expect(screen.getByText("SIGN_OFF")).toBeInTheDocument();
    expect(
      screen.getByText("ACCOUNT_DELETION_WARNING_TITLE"),
    ).toBeInTheDocument();
  });

  it("renders reason textarea and character count", () => {
    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    expect(screen.getByLabelText(/Reason for leaving/i)).toBeInTheDocument();
    expect(screen.getByText("0/500 characters")).toBeInTheDocument();
  });

  it("updates reason and character count when typing", () => {
    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    const textarea = screen.getByLabelText(/Reason for leaving/i);
    fireEvent.change(textarea, { target: { value: "Test reason" } });
    expect(textarea.value).toBe("Test reason");
    expect(screen.getByText("11/500 characters")).toBeInTheDocument();
    expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
  });

  it("limits reason to 500 characters", () => {
    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    const textarea = screen.getByLabelText(/Reason for leaving/i);
    const longText = "a".repeat(600);
    fireEvent.change(textarea, { target: { value: longText } });
    // Should not update if over 500
    expect(textarea.value).toBe("");
  });

  it("enables submit button when checkbox is checked", () => {
    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    const checkbox = screen.getByRole("checkbox");
    const submitButton = screen.getByText("SUBMIT");

    expect(submitButton).toBeDisabled();
    fireEvent.click(checkbox);
    expect(submitButton).not.toBeDisabled();
    expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(true);
  });

  it("shows confirmation modal when submit is clicked", () => {
    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));

    expect(screen.getByText("CONFIRM_ACCOUNT_DELETION")).toBeInTheDocument();
    expect(
      screen.getByText("CONFIRM_ACCOUNT_DELETION_TEXT"),
    ).toBeInTheDocument();
  });

  it("closes confirmation modal when cancel is clicked", () => {
    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));

    // Click cancel in modal
    const cancelButtons = screen.getAllByText("CANCEL");
    fireEvent.click(cancelButtons[1]); // Second cancel is in modal

    expect(
      screen.queryByText("CONFIRM_ACCOUNT_DELETION"),
    ).not.toBeInTheDocument();
  });

  it("deletes account successfully with userDbId from Redux", async () => {
    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));
    fireEvent.click(screen.getByText("DELETE_ACCOUNT"));

    await waitFor(() => {
      expect(mockSignOffUser).toHaveBeenCalledWith("SID-00-000-001", "");
    });

    await waitFor(() => {
      expect(mockDeleteUser).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
      expect(localStorageMock.clear).toHaveBeenCalled();
      expect(mockAlert).toHaveBeenCalledWith("ACCOUNT_DELETED_SUCCESS");
    });

    jest.runAllTimers();
    expect(mockLocation.href).toBe("/");
  });

  it("uses localStorage fallback when Redux userDbId is not available", async () => {
    const storeWithoutDbId = createMockStore({
      auth: { user: { email: "test@example.com" } },
    });
    localStorageMock.getItem.mockReturnValue("SID-FROM-LOCALSTORAGE");

    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      storeWithoutDbId,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));
    fireEvent.click(screen.getByText("DELETE_ACCOUNT"));

    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith("userDbId");
      expect(mockSignOffUser).toHaveBeenCalledWith("SID-FROM-LOCALSTORAGE", "");
    });
  });

  it("uses API fallback when Redux and localStorage have no userDbId", async () => {
    const storeWithoutDbId = createMockStore({
      auth: { user: { email: "test@example.com" } },
    });
    localStorageMock.getItem.mockReturnValue(null);
    mockGetUserId.mockResolvedValue({ data: { id: "SID-FROM-API" } });

    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      storeWithoutDbId,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));
    fireEvent.click(screen.getByText("DELETE_ACCOUNT"));

    await waitFor(() => {
      expect(mockGetUserId).toHaveBeenCalledWith("test@example.com");
      expect(mockSignOffUser).toHaveBeenCalledWith("SID-FROM-API", "");
    });
  });

  it("skips DB deletion when user not found in database", async () => {
    const storeWithoutDbId = createMockStore({
      auth: { user: { email: "test@example.com" } },
    });
    localStorageMock.getItem.mockReturnValue(null);
    mockGetUserId.mockRejectedValue(new Error("User not found"));

    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      storeWithoutDbId,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));
    fireEvent.click(screen.getByText("DELETE_ACCOUNT"));

    await waitFor(() => {
      expect(mockSignOffUser).not.toHaveBeenCalled();
      expect(mockDeleteUser).toHaveBeenCalled();
    });
  });

  it("throws error when no email and no userDbId available", async () => {
    const storeWithoutInfo = createMockStore({
      auth: { user: {} },
    });
    localStorageMock.getItem.mockReturnValue(null);

    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
      storeWithoutInfo,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));
    fireEvent.click(screen.getByText("DELETE_ACCOUNT"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("ACCOUNT_DELETION_ERROR");
    });
  });

  it("shows error when database deletion fails", async () => {
    mockSignOffUser.mockResolvedValue({ success: false, message: "DB Error" });

    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));
    fireEvent.click(screen.getByText("DELETE_ACCOUNT"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("ACCOUNT_DELETION_ERROR");
    });
  });

  it("continues deletion even if Cognito deletion fails", async () => {
    mockDeleteUser.mockRejectedValue(new Error("Cognito error"));

    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));
    fireEvent.click(screen.getByText("DELETE_ACCOUNT"));

    await waitFor(() => {
      expect(mockSignOffUser).toHaveBeenCalled();
      expect(localStorageMock.clear).toHaveBeenCalled();
      expect(mockAlert).toHaveBeenCalledWith("ACCOUNT_DELETED_SUCCESS");
    });
  });

  it("includes reason in deletion request", async () => {
    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    const textarea = screen.getByLabelText(/Reason for leaving/i);
    fireEvent.change(textarea, {
      target: { value: "Moving to another platform" },
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));
    fireEvent.click(screen.getByText("DELETE_ACCOUNT"));

    await waitFor(() => {
      expect(mockSignOffUser).toHaveBeenCalledWith(
        "SID-00-000-001",
        "Moving to another platform",
      );
    });
  });

  it("resets form when cancel button is clicked", () => {
    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Click the main cancel button (not modal)
    const cancelButtons = screen.getAllByText("CANCEL");
    fireEvent.click(cancelButtons[0]);

    expect(checkbox).not.toBeChecked();
    expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
  });

  it("dispatches unsaved-changes event on successful deletion", async () => {
    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));
    fireEvent.click(screen.getByText("DELETE_ACCOUNT"));

    await waitFor(() => {
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "unsaved-changes",
          detail: { hasUnsavedChanges: false },
        }),
      );
    });
  });

  it("shows deleting state in modal button", async () => {
    // Make signOffUser slow
    mockSignOffUser.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 1000),
        ),
    );

    renderWithProvider(
      <SignOff setHasUnsavedChanges={mockSetHasUnsavedChanges} />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText("SUBMIT"));
    fireEvent.click(screen.getByText("DELETE_ACCOUNT"));

    expect(screen.getByText("DELETING")).toBeInTheDocument();
  });
});
