import { createAsyncThunk } from "@reduxjs/toolkit";

// export const login = createAsyncThunk(
//    "login",
//    async (data, { rejectWithValue }) => {
//       const URL = "v1/auth/otp/send";

//       try {
//          const res = await AxiosInstance.post(URL, data)

//          return { data, response: JSON.parse(JSON.stringify(res)) }
//       } catch (error) {

//          return JSON.parse(JSON.stringify(rejectWithValue(error?.response.data)))
//       }
//    }
// )