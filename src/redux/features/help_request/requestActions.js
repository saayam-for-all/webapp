// requestActions.js
import { createAction } from "@reduxjs/toolkit";

// Static categories as fallback - matches API structure for consistency
const categories = [
  {
    catId: "0.0.0.0.0",
    catName: "GENERAL_CATEGORY",
    catDesc: "GENERAL_CATEGORY_DESC",
    subCategories: [],
  },
  {
    catId: "1",
    catName: "FOOD_AND_ESSENTIALS_SUPPORT",
    catDesc: "FOOD_AND_ESSENTIALS_SUPPORT_DESC",
    subCategories: [
      {
        catId: "1.1",
        catName: "FOOD_ASSISTANCE",
        catDesc: "FOOD_ASSISTANCE_DESC",
        subCategories: [],
      },
      {
        catId: "1.2",
        catName: "GROCERY_SHOPPING_AND_DELIVERY",
        catDesc: "GROCERY_SHOPPING_AND_DELIVERY_DESC",
        subCategories: [],
      },
      {
        catId: "1.3",
        catName: "COOKING_HELP",
        catDesc: "COOKING_HELP_DESC",
        subCategories: [],
      },
    ],
  },
  {
    catId: "2",
    catName: "CLOTHING_SUPPORT",
    catDesc: "CLOTHING_SUPPORT_DESC",
    subCategories: [
      {
        catId: "2.1",
        catName: "DONATE_CLOTHES",
        catDesc: "DONATE_CLOTHES_DESC",
        subCategories: [],
      },
      {
        catId: "2.2",
        catName: "BORROW_CLOTHES",
        catDesc: "BORROW_CLOTHES_DESC",
        subCategories: [],
      },
    ],
  },
  {
    catId: "3",
    catName: "HOUSING_SUPPORT",
    catDesc: "HOUSING_SUPPORT_DESC",
    subCategories: [
      {
        catId: "3.1",
        catName: "FIND_A_ROOMMATE",
        catDesc: "FIND_A_ROOMMATE_DESC",
        subCategories: [],
      },
      {
        catId: "3.2",
        catName: "RENTING_SUPPORT",
        catDesc: "RENTING_SUPPORT_DESC",
        subCategories: [],
      },
    ],
  },
  {
    catId: "4",
    catName: "EDUCATION_CAREER_SUPPORT",
    catDesc: "EDUCATION_CAREER_SUPPORT_DESC",
    subCategories: [
      {
        catId: "4.1",
        catName: "COLLEGE_APPLICATION_HELP",
        catDesc: "COLLEGE_APPLICATION_HELP_DESC",
        subCategories: [],
      },
      {
        catId: "4.2",
        catName: "SOP_ESSAY_REVIEW",
        catDesc: "SOP_ESSAY_REVIEW_DESC",
        subCategories: [],
      },
      {
        catId: "4.3",
        catName: "TUTORING",
        catDesc: "TUTORING_DESC",
        subCategories: [],
      },
    ],
  },
  {
    catId: "5",
    catName: "HEALTHCARE_WELLNESS_SUPPORT",
    catDesc: "HEALTHCARE_WELLNESS_SUPPORT_DESC",
    subCategories: [
      {
        catId: "5.1",
        catName: "MEDICAL_NAVIGATION",
        catDesc: "MEDICAL_NAVIGATION_DESC",
        subCategories: [],
      },
      {
        catId: "5.2",
        catName: "MEDICINE_DELIVERY",
        catDesc: "MEDICINE_DELIVERY_DESC",
        subCategories: [],
      },
    ],
  },
  {
    catId: "6",
    catName: "ELDERLY_SUPPORT",
    catDesc: "ELDERLY_SUPPORT_DESC",
    subCategories: [
      {
        catId: "6.1",
        catName: "SENIOR_LIVING_RELOCATION",
        catDesc: "SENIOR_LIVING_RELOCATION_DESC",
        subCategories: [],
      },
      {
        catId: "6.2",
        catName: "DIGITAL_SUPPORT_FOR_SENIORS",
        catDesc: "DIGITAL_SUPPORT_FOR_SENIORS_DESC",
        subCategories: [],
      },
    ],
  },
];

// Action to load categories into the store (can accept custom data or use static)
export const loadCategories = createAction(
  "request/loadCategories",
  (customCategories = null) => {
    return {
      payload: customCategories || categories,
    };
  },
);
