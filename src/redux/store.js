import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authentication/authSlice";
import signupReducer from "./features/authentication/signupSlice";
import userReducer from "./features/user/userSlice";
import volunteerReducer from "./features/volunteer/volunteerSlice";
import adminReducer from "./features/admin/adminSlice";
import requestReducer from "./features/help_request/requestSlice";
import { requestApi } from "../services/requestApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // signup: signupReducer,
    // user: userReducer,
    // volunteer: volunteerReducer,
    // admin: adminReducer,
    request: requestReducer,
    [requestApi.reducerPath]: requestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(requestApi.middleware),
});
