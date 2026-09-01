import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChangePassword from "./ChangePassword";
import { updatePassword } from "aws-amplify/auth";

// --- Mocks ---

jest.mock("aws-amplify/auth", () => ({
  updatePassword: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock("react-icons/ai", () => ({
  AiOutlineEye: () => <span data-testid="eye-icon" />,
  AiOutlineEyeInvisible: () => <span data-testid="eye-invisible-icon" />,
}));

jest.mock("../../common/components/Loading/Loading", () => {
  return function LoadingIndicator() {
    return <div data-testid="loading-indicator" />;
  };
});

// --- Helpers ---

const mockSetHasUnsavedChanges = jest.fn();

const renderComponent = () =>
  render(<ChangePassword setHasUnsavedChanges={mockSetHasUnsavedChanges} />);

// Helper: focus all three password inputs so they become editable
const activateFields = () => {
  const inputs = screen.getAllByRole("textbox", { hidden: true });
  // password inputs are not "textbox" role; query by type
  const passwordInputs = document.querySelectorAll(
    'input[type="password"], input[type="text"]',
  );
  passwordInputs.forEach((input) => fireEvent.focus(input));
};

// --- Tests ---

describe("ChangePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore?.();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders all three password field labels", () => {
    renderComponent();
    expect(screen.getByText("CURRENT_PASSWORD")).toBeInTheDocument();
    expect(screen.getByText("NEW_PASSWORD")).toBeInTheDocument();
    expect(screen.getByText("CONFIRM_PASSWORD")).toBeInTheDocument();
  });

  it("renders Save and Cancel buttons", () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /SAVE/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /CANCEL/i })).toBeInTheDocument();
  });

  it("renders password requirement hint text", () => {
    renderComponent();
    expect(screen.getByText("PASSWORD_REQUIREMENTS")).toBeInTheDocument();
  });

  // ── Autofill protection: readOnly ──────────────────────────────────────────

  it("all password inputs start as readOnly to prevent browser autofill", () => {
    renderComponent();
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      expect(input).toHaveAttribute("readOnly");
    });
  });

  it("all password inputs have autoComplete set to new-password", () => {
    renderComponent();
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      expect(input).toHaveAttribute("autoComplete", "new-password");
    });
  });

  it("password inputs become editable after the user focuses them", () => {
    renderComponent();
    const inputs = document.querySelectorAll("input");

    // Verify initially readOnly
    inputs.forEach((input) => expect(input).toHaveAttribute("readOnly"));

    // Focus the first input — all three should become editable
    fireEvent.focus(inputs[0]);

    inputs.forEach((input) => expect(input).not.toHaveAttribute("readOnly"));
  });

  it("password inputs return to readOnly after Cancel is clicked", () => {
    renderComponent();
    const inputs = document.querySelectorAll("input");

    // Activate fields and type something
    fireEvent.focus(inputs[0]);
    fireEvent.change(inputs[0], { target: { value: "SomePass1!" } });

    // Cancel resets readOnly
    fireEvent.click(screen.getByRole("button", { name: /CANCEL/i }));

    const freshInputs = document.querySelectorAll("input");
    freshInputs.forEach((input) => expect(input).toHaveAttribute("readOnly"));
  });

  // ── Password visibility toggle ─────────────────────────────────────────────

  it("password inputs default to type=password (hidden)", () => {
    renderComponent();
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      expect(input).toHaveAttribute("type", "password");
    });
  });

  it("toggles all inputs to type=text when the eye icon is clicked", () => {
    renderComponent();

    // Click any eye icon (they all share the same toggle)
    const eyeIcons = screen.getAllByTestId("eye-icon");
    fireEvent.click(eyeIcons[0]);

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      expect(input).toHaveAttribute("type", "text");
    });
  });

  it("toggles back to type=password when eye icon is clicked a second time", () => {
    renderComponent();
    const eyeIcons = screen.getAllByTestId("eye-icon");
    fireEvent.click(eyeIcons[0]); // show
    fireEvent.click(screen.getAllByTestId("eye-invisible-icon")[0]); // hide

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      expect(input).toHaveAttribute("type", "password");
    });
  });

  // ── Cancel ─────────────────────────────────────────────────────────────────

  it("Cancel clears all three fields", () => {
    renderComponent();
    const inputs = document.querySelectorAll("input");

    fireEvent.focus(inputs[0]);
    fireEvent.change(inputs[0], { target: { value: "CurrentPass1!" } });
    fireEvent.change(inputs[1], { target: { value: "NewPass1!" } });
    fireEvent.change(inputs[2], { target: { value: "NewPass1!" } });

    fireEvent.click(screen.getByRole("button", { name: /CANCEL/i }));

    document
      .querySelectorAll("input")
      .forEach((input) => expect(input.value).toBe(""));
  });

  it("Cancel calls setHasUnsavedChanges(false)", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /CANCEL/i }));
    expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
  });

  // ── Validation ─────────────────────────────────────────────────────────────

  it("shows a password requirements error when new password is too weak", async () => {
    renderComponent();
    const inputs = document.querySelectorAll("input");

    fireEvent.focus(inputs[0]);
    fireEvent.change(inputs[1], { target: { value: "weak" } });
    fireEvent.change(inputs[2], { target: { value: "weak" } });

    fireEvent.click(screen.getByRole("button", { name: /SAVE/i }));

    await waitFor(() => {
      expect(
        screen.getByText("PASSWORD_REQUIREMENTS_ERROR"),
      ).toBeInTheDocument();
    });
    expect(updatePassword).not.toHaveBeenCalled();
  });

  it("shows a mismatch error when new and confirm passwords differ", async () => {
    renderComponent();
    const inputs = document.querySelectorAll("input");

    fireEvent.focus(inputs[0]);
    fireEvent.change(inputs[1], { target: { value: "ValidPass1!" } });
    fireEvent.change(inputs[2], { target: { value: "DifferentPass1!" } });

    fireEvent.click(screen.getByRole("button", { name: /SAVE/i }));

    await waitFor(() => {
      expect(screen.getByText("PASSWORD_MISMATCH_ERROR")).toBeInTheDocument();
    });
    expect(updatePassword).not.toHaveBeenCalled();
  });

  // ── Successful save ────────────────────────────────────────────────────────

  it("calls updatePassword with correct args and clears fields on success", async () => {
    updatePassword.mockResolvedValueOnce({});
    renderComponent();
    const inputs = document.querySelectorAll("input");

    fireEvent.focus(inputs[0]);
    fireEvent.change(inputs[0], { target: { value: "CurrentPass1!" } });
    fireEvent.change(inputs[1], { target: { value: "NewPass1@" } });
    fireEvent.change(inputs[2], { target: { value: "NewPass1@" } });

    fireEvent.click(screen.getByRole("button", { name: /SAVE/i }));

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith({
        oldPassword: "CurrentPass1!",
        newPassword: "NewPass1@",
      });
    });

    await waitFor(() => {
      document
        .querySelectorAll("input")
        .forEach((input) => expect(input.value).toBe(""));
    });

    // Fields should be readOnly again after a successful save
    document
      .querySelectorAll("input")
      .forEach((input) => expect(input).toHaveAttribute("readOnly"));
  });

  it("shows an alert on successful password change", async () => {
    updatePassword.mockResolvedValueOnce({});
    renderComponent();
    const inputs = document.querySelectorAll("input");

    fireEvent.focus(inputs[0]);
    fireEvent.change(inputs[1], { target: { value: "NewPass1@" } });
    fireEvent.change(inputs[2], { target: { value: "NewPass1@" } });

    fireEvent.click(screen.getByRole("button", { name: /SAVE/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("PASSWORD_CHANGE_SUCCESS");
    });
  });

  it("calls setHasUnsavedChanges(false) after a successful save", async () => {
    updatePassword.mockResolvedValueOnce({});
    renderComponent();
    const inputs = document.querySelectorAll("input");

    fireEvent.focus(inputs[0]);
    fireEvent.change(inputs[1], { target: { value: "NewPass1@" } });
    fireEvent.change(inputs[2], { target: { value: "NewPass1@" } });

    fireEvent.click(screen.getByRole("button", { name: /SAVE/i }));

    await waitFor(() => {
      expect(mockSetHasUnsavedChanges).toHaveBeenCalledWith(false);
    });
  });

  it("shows an alert with the error message when updatePassword throws", async () => {
    updatePassword.mockRejectedValueOnce(new Error("Incorrect password"));
    renderComponent();
    const inputs = document.querySelectorAll("input");

    fireEvent.focus(inputs[0]);
    fireEvent.change(inputs[1], { target: { value: "NewPass1@" } });
    fireEvent.change(inputs[2], { target: { value: "NewPass1@" } });

    fireEvent.click(screen.getByRole("button", { name: /SAVE/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Incorrect password");
    });
  });
});
