import { fetchAuthSession } from "aws-amplify/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session?.tokens?.idToken?.toString();
  } catch (error) {
    console.log("Error fetching token:", error);
    return null;
  }
};

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://a9g3p46u59.execute-api.us-east-1.amazonaws.com/saayam/",

    prepareHeaders: async (headers) => {
      const token = await getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllRequest: builder.query({
      query: () => "dev/requests/v0.0.1/mockRequests",
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
