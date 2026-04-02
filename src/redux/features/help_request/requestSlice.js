// requestSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loadCategories } from "./requestActions";

const initialState = {
  categories: [],
  categoriesFetched: false,
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadCategories, (state, action) => {
      // Ensure categories is always an array
      state.categories = Array.isArray(action.payload) ? action.payload : [];
      state.categoriesFetched = true;
    });
  },
});

// Selectors
export const selectCategories = (state) => state.request.categories;
export const selectCategoriesFetched = (state) =>
  state.request.categoriesFetched;

export default requestSlice.reducer;
