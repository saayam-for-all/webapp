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
});
