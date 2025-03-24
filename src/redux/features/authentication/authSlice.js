import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: null,
  success: false,
  idToken: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.idToken = action.payload.idToken;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.idToken = null;
    },
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    resetPasswordSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },

    // New reducer to update user profile in Redux state
    updateUserProfileSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload }; // Update only modified fields
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  updateUserProfileSuccess,
} = authSlice.actions;

export default authSlice.reducer;
