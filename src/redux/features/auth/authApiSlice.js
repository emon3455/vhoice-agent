import { apiSlice } from "../api/api";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => {
        return {
          url: "/api/user/login",
          method: "POST",
          body: data,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (data) => {
        return {
          url: "/api/user/changepassword",
          method: "PATCH",
          body: data,
        };
      },
    }),

  }),
});

export const { useLoginMutation, useChangePasswordMutation } = authApiSlice;
