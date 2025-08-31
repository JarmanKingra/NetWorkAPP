/**
 * 
 * Steps for State Management
 * Submit Action
 * Handle Action in its reducer
 * Register here -> Reducer (here in Store)
 */
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});