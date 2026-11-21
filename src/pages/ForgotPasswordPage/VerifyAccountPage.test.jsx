import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VerifyAccountPage from "./VerifyAccountPage";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { confirmForgotPassword } from "../../redux/features/authentication/authActions";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router", () => ({
  useLocation: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("../../redux/features/authentication/authActions", () => ({
  confirmForgotPassword: jest.fn(),
}));

describe("VerifyAccountPage - Issue #1983", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue({
      loading: false,
      success: false,
      error: null,
    });

    useLocation.mockReturnValue({
      state: { email: "test@example.com" },
    });

    useNavigate.mockReturnValue(mockNavigate);
  });

  it("shows social login guidance with a link to the Login page", () => {
    render(<VerifyAccountPage />);

    expect(
      screen.getByText(
        /If you have an email\/password account, we sent a code/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("renders all reset fields empty initially", () => {
    render(<VerifyAccountPage />);

    expect(screen.getByLabelText("Enter Code")).toHaveValue("");
    expect(screen.getByLabelText("New Password", { exact: true })).toHaveValue(
      "",
    );
    expect(screen.getByLabelText("Confirm New Password")).toHaveValue("");
  });

  it("uses one-time-code autocomplete for verification code", () => {
    render(<VerifyAccountPage />);

    const code = screen.getByLabelText("Enter Code");

    expect(code).toHaveAttribute("autocomplete", "one-time-code");
    expect(code).toHaveAttribute("name", "resetVerificationCode");
    expect(code).toHaveAttribute("placeholder", "Your Code");
  });

  it("uses new-password autocomplete for both password fields", () => {
    render(<VerifyAccountPage />);

    const password = screen.getByLabelText("New Password", { exact: true });
    const confirm = screen.getByLabelText("Confirm New Password");

    expect(password).toHaveAttribute("autocomplete", "new-password");
    expect(confirm).toHaveAttribute("autocomplete", "new-password");
  });

  it("uses unique IDs for all reset fields", () => {
    render(<VerifyAccountPage />);

    const inputs = document.querySelectorAll("input");
    const ids = Array.from(inputs, (input) => input.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(screen.getByLabelText("Confirm New Password")).toHaveAttribute(
      "id",
      "confirmPassword",
    );
  });

  it("allows users to enter verification code and new passwords", () => {
    render(<VerifyAccountPage />);

    const code = screen.getByLabelText("Enter Code");
    const password = screen.getByLabelText("New Password", { exact: true });
    const confirm = screen.getByLabelText("Confirm New Password");

    fireEvent.change(code, { target: { value: "123456" } });
    fireEvent.change(password, { target: { value: "NewPassword123!" } });
    fireEvent.change(confirm, { target: { value: "NewPassword123!" } });

    expect(code).toHaveValue("123456");
    expect(password).toHaveValue("NewPassword123!");
    expect(confirm).toHaveValue("NewPassword123!");
  });

  it("submits the entered code and password through the existing action", () => {
    confirmForgotPassword.mockReturnValue({
      type: "auth/confirmForgotPassword",
    });

    render(<VerifyAccountPage />);

    fireEvent.change(screen.getByLabelText("Enter Code"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByLabelText("New Password", { exact: true }), {
      target: { value: "NewPassword123!" },
    });

    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "NewPassword123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(confirmForgotPassword).toHaveBeenCalledWith(
      "test@example.com",
      "123456",
      "NewPassword123!",
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it("alerts and does not submit when passwords do not match", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<VerifyAccountPage />);

    fireEvent.change(screen.getByLabelText("New Password", { exact: true }), {
      target: { value: "NewPassword123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "Different123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(alertSpy).toHaveBeenCalledWith("Passwords do not match");
    expect(mockDispatch).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("navigates to login after a successful reset", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    useSelector.mockReturnValue({ loading: false, success: true, error: null });

    render(<VerifyAccountPage />);

    expect(alertSpy).toHaveBeenCalledWith("Password reset successful!");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    alertSpy.mockRestore();
  });

  it("alerts the error when the reset fails", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    useSelector.mockReturnValue({
      loading: false,
      success: false,
      error: "Invalid code",
    });

    render(<VerifyAccountPage />);

    expect(alertSpy).toHaveBeenCalledWith(
      "Password reset failed: Invalid code",
    );
    expect(mockNavigate).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("toggles visibility and focus styling of both password fields", () => {
    render(<VerifyAccountPage />);

    const password = screen.getByLabelText("New Password", { exact: true });
    const confirm = screen.getByLabelText("Confirm New Password");

    for (const input of [password, confirm]) {
      const toggle = input.parentElement.querySelector("button");
      expect(input).toHaveAttribute("type", "password");
      fireEvent.click(toggle);
      expect(input).toHaveAttribute("type", "text");
      fireEvent.click(toggle);
      expect(input).toHaveAttribute("type", "password");

      fireEvent.focus(input);
      expect(input.parentElement).toHaveClass("border-blue-700");
      fireEvent.blur(input);
      expect(input.parentElement).not.toHaveClass("border-blue-700");
    }
  });
});
