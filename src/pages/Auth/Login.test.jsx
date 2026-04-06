import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../redux/features/authentication/authSlice";
import LoginPage from "./Login";

const mockNavigate = jest.fn();
let mockLocationState = null;

jest.mock("aws-amplify/auth", () => ({ signIn: jest.fn() }));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: mockLocationState, pathname: "/login" }),
}));

jest.mock(
  "../../common/components/InactivityTimer/InactivityTimer.jsx",
  () => ({ INACTIVITY_TIMEOUT: 3600000 }),
);

jest.mock("../../common/components/Loading/Loading.jsx", () => () => null);

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
  beforeEach(() => {
    mockLocationState = null;
    mockNavigate.mockClear();
  });

  it("renders the login form fields", () => {
    renderLogin();
    expect(screen.getByLabelText(/EMAIL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PASSWORD/i)).toBeInTheDocument();
  });

  it("shows success banner when accountCreated is true in location state", () => {
    mockLocationState = { accountCreated: true };
    renderLogin();
    expect(
      screen.getByText("common:ACCOUNT_CREATED_SUCCESS"),
    ).toBeInTheDocument();
  });

  it("does not show success banner when accountCreated is not in location state", () => {
    renderLogin();
    expect(
      screen.queryByText("ACCOUNT_CREATED_SUCCESS"),
    ).not.toBeInTheDocument();
  });
});
