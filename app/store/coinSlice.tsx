"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    _id: "",
    data: [],
    createdAt: "",
    _v: 0,
  },
};

export const coinSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    coinsList: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { coinsList } = coinSlice.actions;

export default coinSlice.reducer;
