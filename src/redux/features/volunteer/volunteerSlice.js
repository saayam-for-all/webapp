import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: "",
};

const volunteerSlice = createSlice({
  name: "volunteerSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default volunteerSlice.reducer;
