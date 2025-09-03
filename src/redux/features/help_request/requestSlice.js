// requestSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loadCategories, fetchCategories } from "./requestActions";

const initialState = {
  categories: [],
  loading: false,
  error: "",
  categoriesFetched: false,
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories, (state, action) => {
        state.categories = action.payload;
        state.categoriesFetched = true;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.categoriesFetched = true;
        state.error = "";
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

// Selectors
export const selectCategories = (state) => state.request.categories;
export const selectCategoriesLoading = (state) => state.request.loading;
export const selectCategoriesError = (state) => state.request.error;
export const selectCategoriesFetched = (state) =>
  state.request.categoriesFetched;

export default requestSlice.reducer;
