// requestActions.js
import { createAction } from "@reduxjs/toolkit";

// Static categories
const categories = [
  // Commented out categories are for future releases
  // { id: "banking", name: "Banking" },
  // { id: "books", name: "Books" },
  {
    id: "Food & Essentials",
    name: "Food & Essentials",
    subcategories: [
      "Food Assistance",
      "Grocery Shopping & Delivery",
      "Cooking Help",
    ],
  },
  {
    id: "Clothing Support",
    name: "Clothing Support",
    subcategories: ["Lend/Borrow Clothes", "Donate Clothes"],
  },
  // { id: "college_admissions", name: "College Admissions" },
  {
    id: "Housing Assistance",
    name: "Housing Assistance",
    subcategories: [
      "Finding a Roommate",
      "Renting Support",
      "Buy/Sell Household Items",
      "Moving & Packing Help",
      "Cleaning Help",
      "Home Buying/Selling Assistance",
    ],
  },
  {
    id: "Education & Career Support",
    name: "Education & Career Support",
    subcategories: [
      "College Applications Help",
      "SOP & Essay Review",
      "Tutoring",
    ],
  },
  {
    id: "Healthcare & Well-being",
    name: "Healthcare & Well-being",
    subcategories: ["Medical Consultation", "Medicine Delivery Assistance"],
  },
  {
    id: "Elderly & Community Support",
    name: "Elderly & Community Support",
    subcategories: [
      "Elderly Assistance",
      "Tech help for Seniors",
      "Help with Government Services",
      "Ride Assistance",
      "Shopping Assistance",
    ],
  },
  // { id: "cooking", name: "Cooking" },
  // {
  //   id: "education",
  //   name: "Education",
  //   subcategories: ["Elementary", "Middle School", "High School", "University"],
  // },
  // { id: "employment", name: "Employment" },
  // { id: "finance", name: "Finance" },
  // { id: "food", name: "Food" },
  // { id: "gardening", name: "Gardening" },
  { id: "general", name: "General" },
  // { id: "homelessness", name: "Homelessness" },
  // { id: "housing", name: "Housing" },
  // { id: "jobs", name: "Jobs" },
  // { id: "investing", name: "Investing" },
  // { id: "matrimonial", name: "Matrimonial" },
  // {
  //   id: "medical",
  //   name: "Medical",
  //   subcategories: ["Brain", "Depression", "Eye", "Hand", "Head", "Leg"],
  // },
  // { id: "rental", name: "Rental" },
  // { id: "school", name: "School" },
  // { id: "shopping", name: "Shopping" },
  // {
  //   id: "sports",
  //   name: "Sports",
  //   subcategories: [
  //     "Baseball",
  //     "Basketball",
  //     "Cricket",
  //     "Handball",
  //     "Jogging",
  //     "Hockey",
  //     "Running",
  //     "Tennis",
  //   ],
  // },
  // {
  //   id: "Counseling",
  //   name: "Counseling Support",
  //   subcategories: [
  //     "College Applications (Master’s)",
  //     "Review of Statements of Purpose (SoPs)",
  //     "College Recommendations",
  //     "Suggestions for College Choices",
  //   ],
  // },
  // { id: "stocks", name: "Stocks" },
  // { id: "travel", name: "Travel" },
  // { id: "tourism", name: "Tourism" },
];

// Action to load categories into the store
export const loadCategories = createAction("request/loadCategories", () => {
  return {
    payload: categories,
  };
});
