/**
 * 
 * Steps for State Management
 * Submit Action
 * Handle Action in its reducer
 * Register here -> Reducer (here in Store)
 */
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postsReducer from "./reducer/postReducer"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer
  }
});