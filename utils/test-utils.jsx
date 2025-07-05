import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "#redux/features/authentication/authSlice";
import { NotificationProvider } from "../src/context/NotificationContext";

// redux state for logged in user
export const MOCK_STATE_LOGGED_IN = {
  auth: { user: { userId: "mockUser" }, idToken: "mockToken" },
};
// redux state for logged out user
export const MOCK_STATE_LOGGED_OUT = { auth: { user: null } };

export function renderWithProviders(ui, extendedRenderOptions = {}) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <NotificationProvider>{children}</NotificationProvider>
    </Provider>
  );

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
