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

export const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    exchangeList: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { exchangeList } = exchangeSlice.actions;

export default exchangeSlice.reducer;
