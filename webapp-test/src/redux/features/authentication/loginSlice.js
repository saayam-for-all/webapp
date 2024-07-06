import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   loading: false,
   error: "",
}

const loginSlice = createSlice({
   name: "loginSlice",
   initialState,
   reducers: {

   },
   extraReducers: (builder) => {

   }
})

export default loginSlice.reducer;