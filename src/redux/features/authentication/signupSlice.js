import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: "",
};

const signupSlice = createSlice({
  name: "signupSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default signupSlice.reducer;
