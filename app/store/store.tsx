"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import coinReducer from "./coinSlice";
import exchangeReducer from "./exchangeSlice";

const rootReducer = combineReducers({
  coins: coinReducer,
  exchange: exchangeReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
