import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("OMD-AI-USER")) || {},
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("OMD-AI-USER", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = {};
      localStorage.removeItem("OMD-AI-USER")
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;