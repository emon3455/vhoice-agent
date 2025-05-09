import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/api';
import userSlice from './features/auth/authSlice';

const store = configureStore({
  reducer: {
    userSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
