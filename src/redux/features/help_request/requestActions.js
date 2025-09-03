// requestActions.js
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";
import endpoints from "../../../services/endpoints.json";

// Static categories aligned with i18n keys
const categories = [
  {
    key: "FOOD_ESSENTIALS",
    id: "FOOD_ESSENTIALS",
    name: "Food & Essentials",
    subcategories: [
      { key: "FOOD_ASSISTANCE" },
      { key: "GROCERY_SHOPPING_DELIVERY" },
      { key: "COOKING_HELP" },
    ],
  },
  {
    key: "CLOTHING_AND_SUPPORT",
    id: "CLOTHING_AND_SUPPORT",
    name: "Clothing and Support",
    subcategories: [{ key: "LEND_BORROW_CLOTHES" }, { key: "DONATE_CLOTHES" }],
  },
  {
    key: "HOUSING_ASSISTANCE",
    id: "HOUSING_ASSISTANCE",
    name: "Housing Assistance",
    subcategories: [
      { key: "FINDING_A_ROOMMATE" },
      { key: "RENTING_SUPPORT" },
      { key: "BUY_SELL_HOUSEHOLD_ITEMS" },
      { key: "MOVING_PACKING_HELP" },
      { key: "CLEANING_HELP" },
      { key: "HOME_BUYING_SELLING_ASSISTANCE" },
    ],
  },
  {
    key: "EDUCATION_CAREER_SUPPORT",
    id: "EDUCATION_CAREER_SUPPORT",
    name: "Education & Career Support",
    subcategories: [
      { key: "COLLEGE_APPLICATIONS_HELP" },
      { key: "SOP_ESSAY_REVIEW" },
      { key: "TUTORING" },
    ],
  },
  {
    key: "HEALTHCARE_WELLBEING",
    id: "HEALTHCARE_WELLBEING",
    name: "Healthcare & Well-being",
    subcategories: [
      { key: "MEDICAL_CONSULTATION" },
      { key: "MEDICINE_DELIVERY_ASSISTANCE" },
    ],
  },
  {
    key: "ELDERLY_COMMUNITY_SUPPORT",
    id: "ELDERLY_COMMUNITY_SUPPORT",
    name: "Elderly & Community Support",
    subcategories: [
      { key: "ELDERLY_ASSISTANCE" },
      { key: "TECH_HELP_FOR_SENIORS" },
      { key: "HELP_WITH_GOVERNMENT_SERVICES" },
      { key: "RIDE_ASSISTANCE" },
      { key: "SHOPPING_ASSISTANCE" },
    ],
  },
  {
    key: "GENERAL",
    id: "GENERAL",
    name: "General",
    subcategories: [],
  },
];

// Action to load static categories into the store (fallback)
export const loadCategories = createAction("request/loadCategories", () => {
  return {
    payload: categories,
  };
});

// Async thunk to fetch categories from API
export const fetchCategories = createAsyncThunk(
  "request/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.GET_CATEGORIES);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Return static categories as fallback
      return categories;
    }
  },
);
