import {
  confirmResetPassword,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  resetPassword,
  signOut,
} from "aws-amplify/auth";
import {
  changeUiLanguage,
  returnDefaultLanguage,
} from "../../../common/i18n/utils";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutSuccess,
  resetPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
} from "./authSlice";

export const checkAuthStatus = () => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const { userId } = await getCurrentUser();
    const {
      email,
      family_name,
      given_name,
      phone_number,
      ["custom:Country"]: zoneinfo,
    } = await fetchUserAttributes();
    const userSession = await fetchAuthSession();
    const groups = userSession.tokens.accessToken.payload["cognito:groups"];
    const user = {
      userId,
      email,
      family_name,
      given_name,
      phone_number,
      zoneinfo,
      groups,
    };
    if (user.userId) {
      dispatch(
        loginSuccess({
          user,
        }),
      );
    }
    const idToken = userSession.tokens?.idToken?.toString();
    dispatch(
      loginSuccess({
        user,
        idToken,
      }),
    );

    changeUiLanguage();
  } catch (error) {
    returnDefaultLanguage();
    dispatch(loginFailure(error.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    returnDefaultLanguage();
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
