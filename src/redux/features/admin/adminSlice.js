import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: "",
};

const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default adminSlice.reducer;
