import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: null,
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
  },
});

export const { loginRequest, loginSuccess, loginFailure, logoutSuccess } =
  authSlice.actions;

export default authSlice.reducer;
