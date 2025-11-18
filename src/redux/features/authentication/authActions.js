import {
  confirmResetPassword,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  resetPassword,
  signOut,
  updateUserAttributes,
} from "aws-amplify/auth";

import { getEnums, getCategories } from "../../../services/requestServices";

import { getUserId, getVolunteerSkills } from "../../../services/volunteerServices";
import { loadCategories } from "../help_request/requestActions";
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

    try {
      const enumsData = await getEnums();
      localStorage.setItem("enums", JSON.stringify(enumsData));
      // console.log("Enums fetched and stored in localStorage:", enumsData);
    } catch (enumError) {
      console.warn(" Failed to fetch enums after login:", enumError.message);
    }

    try {
      const categoriesData = await getCategories();
      // Extract categories array from API response
      let categoriesArray;
      if (Array.isArray(categoriesData)) {
        categoriesArray = categoriesData;
      } else if (
        categoriesData &&
        Array.isArray(categoriesData.categories)
      ) {
        categoriesArray = categoriesData.categories;
      } else if (categoriesData && typeof categoriesData === "object") {
        console.log("Categories API response structure:", Object.keys(categoriesData));
        throw new Error(
          "Invalid API response format - expected array or object with categories array",
        );
      } else {
        throw new Error("Invalid API response format - expected array");
      }

      // Filter out invalid/header entries (like cat_name, cat_id placeholders)
      const validCategories = categoriesArray.filter(
        (cat) =>
          cat.catName &&
          cat.catName !== "cat_name" &&
          cat.catId !== "cat_id" &&
          cat.catId !== "﻿cat_id" && // Handle BOM characters
          !cat.catName.toLowerCase().includes("cat_name") &&
          !cat.catId.toLowerCase().includes("cat_id"),
      );

      // Store in localStorage
      localStorage.setItem("categories", JSON.stringify(validCategories));
      // Also load into Redux state
      dispatch(loadCategories(validCategories));
    } catch (categoryError) {
      console.warn("Failed to fetch categories after login:", categoryError.message);
    }

    try {
      const volunteerSkillsData = await getVolunteerSkills();
      // Store volunteer skills in localStorage for volunteer wizard
      if (volunteerSkillsData?.body) {
        localStorage.setItem("volunteerSkills", JSON.stringify(volunteerSkillsData.body));
      } else if (volunteerSkillsData) {
        localStorage.setItem("volunteerSkills", JSON.stringify(volunteerSkillsData));
      }
    } catch (volunteerSkillsError) {
      console.warn("Failed to fetch volunteer skills after login:", volunteerSkillsError.message);
    }

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
