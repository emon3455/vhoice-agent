/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseURL } from '../../../constant/baseURL';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    mode: 'cors',
  }),
  refetchOnReconnect: true,
  tagTypes: [],
  endpoints: (builder) => ({}),
});
