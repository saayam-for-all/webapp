import { createSlice } from "@reduxjs/toolkit";
const profileImgSlice = createSlice({
  name: "profileImg",
  initialState: {
    profileImgUrl: null,
  },
  reducers: {
    setProfileImgUrl: (state, action) => {
      state.profileImgUrl = action.payload;
    },
  },
});
export const { setProfileImgUrl } = profileImgSlice.actions;
export default profileImgSlice.reducer;
