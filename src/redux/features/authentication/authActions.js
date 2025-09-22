import {
  confirmResetPassword,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  resetPassword,
  signOut,
  updateUserAttributes,
} from "aws-amplify/auth";
import { getUserId } from "../../../services/volunteerServices";
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
  updateUserProfileSuccess,
} from "./authSlice";

import { clearToken, setToken } from "../../../services/authService";

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

    const idToken = userSession.tokens?.idToken?.toString();
    setToken(idToken);

    let userDbId = null;
    try {
      const result = await getUserId(email);
      userDbId = result?.data?.id || null;
    } catch (dbError) {
      console.warn(
        "Database lookup failed, continuing without databaseId:",
        dbError.message,
      );
    }

    const user = {
      userId,
      email,
      family_name,
      given_name,
      phone_number,
      zoneinfo,
      groups,
      userDbId,
    };
    if (user.userId) {
      dispatch(
        loginSuccess({
          user,
        }),
      );
    }

    dispatch(
      loginSuccess({
        user,
      }),
    );

    changeUiLanguage();
  } catch (error) {
    returnDefaultLanguage();
    dispatch(loginFailure(error.message));
  }
};

export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    if (!userData.firstName || !userData.lastName || !userData.email) {
      throw new Error("Required fields are missing");
    }

    const updatedAttributes = {
      given_name: userData.firstName,
      family_name: userData.lastName,
      email: userData.email,
      ...(userData.phone && { phone_number: userData.phone }),
      ...(userData.country && { "custom:Country": userData.country }),
    };

    await updateUserAttributes({ userAttributes: updatedAttributes });

    const updatedUser = {
      given_name: userData.firstName,
      family_name: userData.lastName,
      email: userData.email,
      ...(userData.phone && { phone_number: userData.phone }),
      ...(userData.country && { zoneinfo: userData.country }),
    };

    dispatch(updateUserProfileSuccess(updatedUser));

    return Promise.resolve({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return Promise.reject(error);
  }
};

export const logout = () => async (dispatch) => {
  try {
    returnDefaultLanguage();
    await signOut();
    clearToken();
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(loginFailure(error.message));
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
