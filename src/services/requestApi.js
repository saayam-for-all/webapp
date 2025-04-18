import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a9g3p46u59.execute-api.us-east-1.amazonaws.com/saayam/",

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.idToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllRequest: builder.query({
      query: () => "dev/requests/v0.0.1/get-requests",
      providesTags: ["Request"],
    }),
    addRequest: builder.mutation({
      query: (request) => ({
        url: "dev/requests/v0.0.1/help-request",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Request"],
    }),
  }),
});

export const { useGetAllRequestQuery, useAddRequestMutation } = requestApi;
