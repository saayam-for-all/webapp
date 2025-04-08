import {
  confirmResetPassword,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  resetPassword,
  signOut,
  updateUserAttributes,
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
  updateUserProfileSuccess,
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

export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    // Validate required fields
    if (!userData.firstName || !userData.lastName || !userData.email) {
      throw new Error("Required fields are missing");
    }

    // Format the attributes for Cognito
    const updatedAttributes = {
      given_name: userData.firstName,
      family_name: userData.lastName,
      email: userData.email,
      ...(userData.phone && { phone_number: userData.phone }),
      ...(userData.country && { "custom:Country": userData.country }),
    };

    // Update Cognito - THIS WAS MISSING PROPER AWAIT
    const result = await updateUserAttributes({
      userAttributes: updatedAttributes, // Need to wrap in userAttributes
    });

    // Prepare updated user data for Redux
    const updatedUser = {
      given_name: userData.firstName,
      family_name: userData.lastName,
      email: userData.email,
      ...(userData.phone && { phone_number: userData.phone }),
      ...(userData.country && { zoneinfo: userData.country }),
    };

    // Update Redux state
    dispatch(updateUserProfileSuccess(updatedUser));

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    let errorMessage = error.message;

    // Handle specific Cognito errors
    if (error.name === "InvalidParameterException") {
      errorMessage =
        "Invalid phone number format. Please include country code (e.g., +1)";
    }

    return {
      success: false,
      error: errorMessage,
    };
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
