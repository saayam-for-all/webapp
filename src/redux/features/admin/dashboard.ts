import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AdminDashboardDataOut {}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    fetchAdminDashBoardData: builder.query<AdminDashboardDataOut, void>({
      query: () => ({ url: "", method: "" }),
      providesTags: [],
    }),
  }),
});
