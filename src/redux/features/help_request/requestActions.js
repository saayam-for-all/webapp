// requestActions.js
import { createAction } from '@reduxjs/toolkit';

// Static categories
const categories = [
    { id: 'banking', name: 'Banking' },
    { id: 'books', name: 'Books' },
    { id: 'clothes', name: 'Clothes' },
    { id: 'college_admissions', name: 'College Admissions' },
    { id: 'cooking', name: 'Cooking' },
    { id: 'education', name: 'Education', subcategories: ['Elementary', 'Middle School', 'High School', 'University'] },
    { id: 'employment', name: 'Employment' },
    { id: 'finance', name: 'Finance' },
    { id: 'food', name: 'Food' },
    { id: 'gardening', name: 'Gardening' },
    { id: 'general', name: 'General' },
    { id: 'homelessness', name: 'Homelessness' },
    { id: 'housing', name: 'Housing' },
    { id: 'jobs', name: 'Jobs' },
    { id: 'investing', name: 'Investing' },
    { id: 'matrimonial', name: 'Matrimonial' },
    { id: 'medical', name: 'Medical', subcategories: ['Brain', 'Depression', 'Eye', 'Hand', 'Head', 'Leg'] },
    { id: 'rental', name: 'Rental' },
    { id: 'school', name: 'School' },
    { id: 'shopping', name: 'Shopping' },
    { id: 'sports', name: 'Sports', subcategories: ['Baseball', 'Basketball', 'Cricket', 'Handball', 'Jogging', 'Hockey', 'Running', 'Tennis'] },
    { id: 'stocks', name: 'Stocks' },
    { id: 'travel', name: 'Travel' },
    { id: 'tourism', name: 'Tourism' }
  ];
  

// Action to load categories into the store
export const loadCategories = createAction('request/loadCategories', () => {
  return {
    payload: categories,
  };
});
