import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: "",
  volunteer: {
    name: "Ethan Marshall",
  },
};

const volunteerSlice = createSlice({
  name: "volunteer",
  initialState,
  reducers: {
    setVolunteer(state, action) {
      state.volunteer = action.payload;
    },
    clearVolunteer(state) {
      state.volunteer = null;
    },
  },
});

export const { setVolunteer, clearVolunteer } = volunteerSlice.actions;
export default volunteerSlice.reducer;
