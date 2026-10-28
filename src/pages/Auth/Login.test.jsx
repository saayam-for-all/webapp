import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../redux/features/authentication/authSlice";
import LoginPage from "./Login";

const mockNavigate = jest.fn();
let mockLocationState = null;
let mockLocationSearch = "";

jest.mock("aws-amplify/auth", () => ({
  signIn: jest.fn(),
  signInWithRedirect: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: mockLocationState,
    search: mockLocationSearch,
    pathname: "/login",
  }),
}));

jest.mock(
  "../../common/components/InactivityTimer/InactivityTimer.jsx",
  () => ({ INACTIVITY_TIMEOUT: 3600000 }),
);

jest.mock("../../common/components/Loading/Loading.jsx", () => () => (
  <span data-testid="login-loading-indicator">loading</span>
));

jest.mock("../../redux/features/authentication/authActions", () => ({
  checkAuthStatus: jest.fn(() => ({ type: "mock" })),
}));

const renderLogin = () => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user: null, loading: false, idToken: null } },
  });
  return render(
    <Provider store={store}>
      <LoginPage />
    </Provider>,
  );
};

describe("LoginPage", () => {
  const { signIn } = require("aws-amplify/auth");

  beforeEach(() => {
    mockLocationState = null;
    mockLocationSearch = "";
    mockNavigate.mockClear();
    signIn.mockReset();
  });

  it("renders the login form fields", () => {
    renderLogin();
    expect(screen.getByLabelText(/EMAIL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PASSWORD/i)).toBeInTheDocument();
  });

  it("identifies the login fields correctly to browser auto-fill", () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/EMAIL/i);
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("autocomplete", "username");
    expect(screen.getByLabelText(/PASSWORD/i)).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
  });

  it("shows success banner when accountCreated is true in location state", () => {
    mockLocationState = { accountCreated: true };
    renderLogin();
    expect(
      screen.getByText("common:ACCOUNT_CREATED_SUCCESS"),
    ).toBeInTheDocument();
  });

  it("shows an error banner when social sign-in was blocked by an existing native account", () => {
    mockLocationSearch = "?authError=SOCIAL_SIGNIN_BLOCKED_NATIVE_EXISTS";
    renderLogin();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "auth:login.social_blocked_native_exists",
    );
  });

  it.each([
    [
      "SOCIAL_SIGNIN_BLOCKED_DIFFERENT_PROVIDER_EXISTS",
      "auth:login.social_blocked_different_provider_exists",
    ],
    ["OAUTH_SIGNIN_FAILED", "auth:login.oauth_signin_failed"],
  ])("shows the banner for %s", (authError, key) => {
    mockLocationSearch = `?authError=${authError}`;
    renderLogin();
    expect(screen.getByRole("alert")).toHaveTextContent(key);
  });

  it("removes the authError code from the URL but keeps the banner", () => {
    mockLocationSearch = "?authError=OAUTH_SIGNIN_FAILED";
    renderLogin();
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("does not touch the URL when there is no authError", () => {
    renderLogin();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  describe("social buttons", () => {
    const { signInWithRedirect } = require("aws-amplify/auth");

    beforeEach(() => signInWithRedirect.mockReset());

    it("always asks Google to show its account chooser", () => {
      renderLogin();
      fireEvent.click(screen.getByRole("button", { name: /GOOGLE/ }));
      expect(signInWithRedirect).toHaveBeenCalledWith({
        provider: "Google",
        options: { prompt: "SELECT_ACCOUNT" },
      });
    });

    it("keeps the account chooser for Google after a failed attempt", () => {
      mockLocationSearch = "?authError=SOCIAL_SIGNIN_BLOCKED_NATIVE_EXISTS";
      renderLogin();
      fireEvent.click(screen.getByRole("button", { name: /GOOGLE/ }));
      expect(signInWithRedirect).toHaveBeenCalledWith({
        provider: "Google",
        options: { prompt: "SELECT_ACCOUNT" },
      });
    });

    it("always asks LinkedIn to show its login screen", () => {
      renderLogin();
      fireEvent.click(screen.getByRole("button", { name: /LinkedIn/ }));
      expect(signInWithRedirect).toHaveBeenCalledWith({
        provider: { custom: "LinkedIn" },
        options: { prompt: "LOGIN" },
      });
    });

    it("keeps the login prompt for LinkedIn after a failed attempt", () => {
      mockLocationSearch = "?authError=SOCIAL_SIGNIN_BLOCKED_NATIVE_EXISTS";
      renderLogin();
      fireEvent.click(screen.getByRole("button", { name: /LinkedIn/ }));
      expect(signInWithRedirect).toHaveBeenCalledWith({
        provider: { custom: "LinkedIn" },
        options: { prompt: "LOGIN" },
      });
    });

    it("signs in with Facebook without extra options", () => {
      renderLogin();
      fireEvent.click(screen.getByRole("button", { name: /FACEBOOK/ }));
      expect(signInWithRedirect).toHaveBeenCalledWith({
        provider: "Facebook",
      });
    });
  });

  it("ignores unknown authError values", () => {
    mockLocationSearch = "?authError=<script>";
    renderLogin();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not show the blocked-sign-in banner by default", () => {
    renderLogin();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not show success banner when accountCreated is not in location state", () => {
    renderLogin();
    expect(
      screen.queryByText("ACCOUNT_CREATED_SUCCESS"),
    ).not.toBeInTheDocument();
  });

  it("shows email invalid format validation and does not submit", async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/EMAIL/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/PASSWORD/i), {
      target: { value: "Secret123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /common:LOGIN/i }));

    expect(
      await screen.findByText("auth:login.email_invalid"),
    ).toBeInTheDocument();
    expect(signIn).not.toHaveBeenCalled();
  });

  it("clears password and shows invalid credentials on failed login", async () => {
    signIn.mockRejectedValueOnce({
      name: "NotAuthorizedException",
      message: "Incorrect username or password.",
    });

    renderLogin();

    const emailInput = screen.getByLabelText(/EMAIL/i);
    const passwordInput = screen.getByLabelText(/PASSWORD/i);

    fireEvent.change(emailInput, {
      target: { value: "user@example.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "WrongPassword123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /common:LOGIN/i }));

    expect(
      await screen.findByText("auth:login.invalid_credentials"),
    ).toBeInTheDocument();
    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("");
  });

  it("disables the login button and shows loading while sign-in is in progress", async () => {
    let resolveSignIn;
    signIn.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveSignIn = resolve;
      }),
    );

    renderLogin();

    fireEvent.change(screen.getByLabelText(/EMAIL/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/PASSWORD/i), {
      target: { value: "Secret123!" },
    });

    const loginButton = screen.getByRole("button", { name: /common:LOGIN/i });
    fireEvent.click(loginButton);

    expect(loginButton).toBeDisabled();
    expect(screen.getByTestId("login-loading-indicator")).toBeInTheDocument();

    resolveSignIn({
      isSignedIn: false,
      nextStep: { signInStep: "CONFIRM_SIGN_UP" },
    });

    await waitFor(() => expect(loginButton).not.toBeDisabled());
  });

  it("maps network failures to the network error message", async () => {
    signIn.mockRejectedValueOnce({
      name: "NetworkError",
      message: "Failed to fetch",
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/EMAIL/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/PASSWORD/i), {
      target: { value: "Secret123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /common:LOGIN/i }));

    expect(
      await screen.findByText("auth:shared.network_error"),
    ).toBeInTheDocument();
  });
});
