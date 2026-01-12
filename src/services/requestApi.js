import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../services/authService";
import endpoints from "./endpoints.json";

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_API_URL,

    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllRequest: builder.query({
      query: () => endpoints.GET_ALL_REQUESTS,
      providesTags: ["Request"],
    }),
    addRequest: builder.mutation({
      query: (request) => ({
        url: endpoints.ADD_HELP_REQUEST,
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Request"],
    }),
  }),
});

export const { useGetAllRequestQuery, useAddRequestMutation } = requestApi;
