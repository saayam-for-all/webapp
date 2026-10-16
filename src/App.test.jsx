import { render, waitFor } from "@testing-library/react";
import App from "./App";
import { checkAuthStatus } from "./redux/features/authentication/authActions";
import { loginFailure } from "./redux/features/authentication/authSlice";

const mockDispatch = jest.fn();
const mockHubListen = jest.fn();
let mockRouter;
let authListener;

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("react-router-dom", () => ({
  RouterProvider: ({ router }) => {
    mockRouter = router;
    return <div>Router</div>;
  },
  createBrowserRouter: (routes) => ({ routes }),
  redirect: (path) => ({ redirectedTo: path }),
}));

jest.mock("./Layout/Layout", () => ({
  __esModule: true,
  default: () => <div>Layout</div>,
}));

jest.mock("./pages/Error404/Error404", () => ({
  __esModule: true,
  default: () => <div>Error</div>,
}));

jest.mock("./routes/routes", () => []);

jest.mock("./redux/features/authentication/authActions", () => ({
  checkAuthStatus: jest.fn(() => ({ type: "CHECK_AUTH_STATUS" })),
}));

jest.mock("aws-amplify/utils", () => ({
  Hub: {
    listen: (...args) => mockHubListen(...args),
  },
}));

describe("App auth bootstrap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authListener = undefined;
    mockHubListen.mockImplementation((channel, listener) => {
      authListener = listener;
      return jest.fn();
    });
    window.history.pushState({}, "", "/");
  });

  it("checks auth status immediately for a normal app load", () => {
    render(<App />);

    expect(checkAuthStatus).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "CHECK_AUTH_STATUS" });
  });

  it("waits for the OAuth redirect event before refreshing auth state", async () => {
    window.history.pushState(
      {},
      "",
      "/dashboard?code=oauth-code&state=oauth-state",
    );

    render(<App />);

    expect(checkAuthStatus).not.toHaveBeenCalled();

    authListener({
      payload: {
        event: "signInWithRedirect",
      },
    });

    await waitFor(() => {
      expect(checkAuthStatus).toHaveBeenCalledTimes(1);
    });
  });

  it("stores an auth failure if the redirect flow fails", async () => {
    window.history.pushState({}, "", "/dashboard?error=access_denied");

    render(<App />);

    authListener({
      payload: {
        event: "signInWithRedirect_failure",
        data: { message: "OAuth failed" },
      },
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(loginFailure("OAuth failed"));
    });
  });

  it("redirects OAuth error URLs to login from a route loader, before any page renders", () => {
    render(<App />);
    const [{ loader }] = mockRouter.routes;

    expect(
      loader({
        request: {
          url: "http://localhost:5173/dashboard?error_description=PreSignUp+failed+with+error+SOCIAL_SIGNIN_BLOCKED_DIFFERENT_PROVIDER_EXISTS.",
        },
      }),
    ).toEqual({
      redirectedTo:
        "/login?authError=SOCIAL_SIGNIN_BLOCKED_DIFFERENT_PROVIDER_EXISTS",
    });
    expect(
      loader({ request: { url: "http://localhost:5173/dashboard" } }),
    ).toBeNull();
  });

  it("keeps the real provider error message from the Hub failure event", async () => {
    window.history.pushState({}, "", "/dashboard");

    render(<App />);

    authListener({
      payload: {
        event: "signInWithRedirect_failure",
        data: { error: { message: "PreSignUp failed" } },
      },
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        loginFailure("PreSignUp failed"),
      );
    });
  });

  it("uses a default message when the Hub failure has no message", async () => {
    window.history.pushState({}, "", "/dashboard");

    render(<App />);

    authListener({
      payload: { event: "signInWithRedirect_failure", data: {} },
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        loginFailure("OAuth sign-in failed"),
      );
    });
  });
});
