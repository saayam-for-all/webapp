import {
  confirmResetPassword,
  getCurrentUser,
  resetPassword,
  signIn,
  signOut,
  signUp,
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
import { useNavigate } from "react-router";

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
    if (user.userId) {
      dispatch(loginSuccess({
        user,
      }));
    }
    //const user = await getCurrentUser();
    //const session = await fetchAuthSession();
    const idToken = userSession.tokens?.idToken?.toString();
    dispatch(
      loginSuccess({
        user,
        idToken,
      })
    );
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
