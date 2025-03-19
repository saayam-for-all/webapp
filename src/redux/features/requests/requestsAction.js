import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequests } from "../../../services/requestServices";

export const fetchRequests = createAsyncThunk(
  "requests/fetchRequests",
  getRequests,
);
