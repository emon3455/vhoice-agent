import { apiSlice } from "../api/api";

export const modelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getAllModel: builder.query({
      query: () => ({
        url: "/api/model",
        method: "GET",
      }),
    }),

    getUserAllModel: builder.query({
      query: (userId) => ({
        url: `/api/model/user-model?userId=${userId}`,
        method: "GET",
      }),
    }),

    getModelById: builder.query({
      query: (id) => ({
        url: `/api/model/${id}`,
        method: "GET",
      }),
    }),

    createModel: builder.mutation({
      query: (data) => ({
        url: "/api/model",
        method: "POST",
        body: data,
      }),
    }),

    deleteModel: builder.mutation({
      query: (id) => ({
        url: `/api/model/${id}`,
        method: "DELETE",
      }),
    }),

    // updateModel: builder.mutation({
    //   query: (body) => ({
    //     url: `/api/model/${body._id}`,
    //     method: "PUT",
    //     body: body,
    //   }),
    // }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllModelQuery,
  useGetModelByIdQuery,
  useGetUserAllModelQuery,
  useCreateModelMutation,
  useDeleteModelMutation,
} = modelApiSlice;
