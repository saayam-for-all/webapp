import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: false,
  error: "",
  userId: localStorage.getItem("userId") || null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
      localStorage.setItem("userId", action.payload);
    },
  },
  extraReducers: (builder) => {},
});
export const { setUserId } = userSlice.actions;
export default userSlice.reducer;
