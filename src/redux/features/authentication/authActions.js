import {
  confirmResetPassword,
  getCurrentUser,
  resetPassword,
  signIn,
  signOut,
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutSuccess,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
} from "./authSlice";

export const login = (email, password) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    await signIn({
      username: email,
      password: password,
    });
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

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(resetPasswordRequest());
  try {
    await resetPassword({ username: email });
  } catch (error) {
    console.log(error);
    dispatch(resetPasswordFailure(error.message));
  }
};

export const confirmForgotPassword =
  (username, confirmationCode, newPassword) => async (dispatch) => {
    try {
      await confirmResetPassword({ username, confirmationCode, newPassword });
      dispatch(resetPasswordSuccess());
    } catch (error) {
      console.log(error);
      dispatch(resetPasswordFailure(error.message));
    }
  };
