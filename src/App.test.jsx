import { render, waitFor } from "@testing-library/react";
import App from "./App";
import { checkAuthStatus } from "./redux/features/authentication/authActions";
import { loginFailure } from "./redux/features/authentication/authSlice";

const mockDispatch = jest.fn();
const mockHubListen = jest.fn();
let authListener;

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("react-router-dom", () => ({
  RouterProvider: () => <div>Router</div>,
  createBrowserRouter: () => ({ routes: [] }),
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
});
