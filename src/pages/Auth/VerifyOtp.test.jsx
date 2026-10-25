import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../redux/features/authentication/authSlice";
import OTPVerification from "./VerifyOtp";

const mockNavigate = jest.fn();

jest.mock("aws-amplify/auth", () => ({
  confirmSignUp: jest.fn(),
  resendSignUpCode: jest.fn(),
  confirmUserAttribute: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { email: "test@example.com" } }),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
}));

jest.mock("../../redux/features/authentication/authActions", () => ({
  updateUserProfile: jest.fn(),
}));

jest.mock("../../utils/utils", () => ({
  maskEmail: (email) => email,
}));

const renderVerifyOtp = () => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user: null, loading: false, idToken: null } },
  });
  return render(
    <Provider store={store}>
      <OTPVerification />
    </Provider>,
  );
};

describe("OTPVerification", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the OTP form", () => {
    renderVerifyOtp();
    expect(screen.getByText(/Verify Your Email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Verify OTP/i }),
    ).toBeInTheDocument();
  });

  it("distributes pasted digits across all OTP inputs", () => {
    renderVerifyOtp();
    const inputs = screen.getAllByRole("textbox");

    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => "123456" },
    });

    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("3");
    expect(inputs[3]).toHaveValue("4");
    expect(inputs[4]).toHaveValue("5");
    expect(inputs[5]).toHaveValue("6");
  });

  it("distributes partial paste and leaves remaining inputs empty", () => {
    renderVerifyOtp();
    const inputs = screen.getAllByRole("textbox");

    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => "123" },
    });

    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("3");
    expect(inputs[3]).toHaveValue("");
    expect(inputs[4]).toHaveValue("");
    expect(inputs[5]).toHaveValue("");
  });

  it("strips non-numeric characters from pasted text", () => {
    renderVerifyOtp();
    const inputs = screen.getAllByRole("textbox");

    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => "1a2b3c" },
    });

    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("3");
    expect(inputs[3]).toHaveValue("");
  });

  it("navigates to login with accountCreated state after successful OTP verification", async () => {
    const { confirmSignUp } = require("aws-amplify/auth");
    confirmSignUp.mockResolvedValueOnce({ isSignUpComplete: true });

    renderVerifyOtp();

    // Fill in OTP inputs
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      fireEvent.change(input, { target: { value: "1" } });
    });

    fireEvent.click(screen.getByRole("button", { name: /Verify OTP/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/OTP Verified Successfully/i),
      ).toBeInTheDocument();
    });

    jest.runAllTimers();

    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: { accountCreated: true },
    });
  });
});
