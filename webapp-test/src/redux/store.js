import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./features/authentication/loginSlice";
import signupReducer from "./features/authentication/signupSlice";
import userReducer from "./features/user/userSlice";
import volunteerReducer from "./features/volunteer/volunteerSlice";
import adminReducer from "./features/admin/adminSlice";

export const store = configureStore({
   reducer: {
      login: loginReducer,
      signup: signupReducer,
      user: userReducer,
      volunteer: volunteerReducer,
      admin: adminReducer,
   }
})