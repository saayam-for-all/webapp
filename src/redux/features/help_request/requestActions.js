// requestActions.js
import { createAction } from "@reduxjs/toolkit";

export const loadCategories = createAction(
  "request/loadCategories",
  (categories) => {
    return {
      payload: categories,
    };
  },
);
