import {
  getCurrentUser,
  signInWithRedirect,
  signOut,
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutSuccess,
} from "./authSlice";

export const login = () => async (dispatch) => {
  dispatch(loginRequest());
  try {
    await signInWithRedirect(); // This will redirect to the Cognito Hosted UI
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const checkAuthStatus = () => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const { userId } = await getCurrentUser();
    const { email, name, phone_number, zoneinfo } = await fetchUserAttributes();
    const userSession = await fetchAuthSession();
    const groups = userSession.tokens.accessToken.payload["cognito:groups"];
    const user = {
      userId,
      email,
      name,
      phone_number,
      zoneinfo,
      groups,
    };
    dispatch(loginSuccess(user));
  } catch (error) {
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
