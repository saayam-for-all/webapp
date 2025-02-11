// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const yourProfileApi = createApi({
//     reducerPath: "yourProfileApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: "https://your-backend-api.com/",
//         prepareHeaders: (headers, { getState }) => {
//             const token = getState().auth.idToken;
//             if(token){
//                 headers.set("Authorization", `Bearer ${token}`);
//             }
//             return headers;

//         },
//     }),
//     endpoints: (builder) => ({
//         initialCall: builder.mutation({
//             query: (callData) => ({
//                 url: "api/start-call", //testing
//                 method: "POST",
//                 body: callData,
//             }),
//         }),
//     }),
// });

// export const {useInitialCallMutation} = yourProfileApi;