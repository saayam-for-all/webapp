import { getCurrentUser, signInWithRedirect, signOut } from "aws-amplify/auth";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutSuccess,
} from "./authSlice";

export const login = () => async (dispatch) => {
  dispatch(loginRequest());
  console.log("Login request dispatched. Redirecting to Cognito Hosted UI...");
  try {
    await signInWithRedirect(); // This will redirect to the Cognito Hosted UI
    console.log("Successfully redirected to Cognito Hosted UI.");
  } catch (error) {
    console.error("Error during Cognito login redirect:", error.message);
    dispatch(loginFailure(error.message));
  }
};

export const checkAuthStatus = () => async (dispatch) => {
  dispatch(loginRequest());
  console.log("Checking user authentication status...");
  try {
    const user = await getCurrentUser();
    console.log("Successfully retrieved authenticated user:", user);
    dispatch(loginSuccess(user));
  } catch (error) {
    console.error("Error checking authentication status:", error.message);
    dispatch(loginFailure(error.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    signOut();
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(authFailure(error.message));
  }
};
