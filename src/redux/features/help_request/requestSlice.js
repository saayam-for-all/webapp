// requestSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loadCategories } from "./requestActions";

const initialState = {
  categories: [],
  loading: false,
  error: "",
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadCategories, (state, action) => {
      state.categories = action.payload;
    });
  },
});

export default requestSlice.reducer;
