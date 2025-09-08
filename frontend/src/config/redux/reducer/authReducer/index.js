import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  loginUser,
  registerUser,
} from "../../action/authAction";

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  TokenIsThere: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionRequests: [],
  all_users: [],
  all_profiles_fetched: false,
  }

  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers : {
      reset: () => initialState,
      handleLoginUser: (state) =>{
        state.message = "hello"
      },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.TokenIsThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.TokenIsThere = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        (state.isLoading = true), (state.message = "Knocking the door...");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.isSuccess = true),
          (state.loggedIn = true),
          (state.message = "User LoggedIn Successfully");
      })
      .addCase(loginUser.rejected, (state, action) => {
        (state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload);
      })
      .addCase(registerUser.pending, (state) => {
        (state.isLoading = true), (state.message = "registering you");
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.isSuccess = true),
          (state.loggedIn = true),
          (state.message = {
            message: "Registration is SuccessFull, please SignIn",
          });
      })
      .addCase(registerUser.rejected, (state, action) => {
        (state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload);
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.profileFetched = true),
          (state.user = action.payload);
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false,
        state.isError = false,
        state.all_profiles_fetched = true,
        state.all_users = action.payload
      })
  },
});

export const {
  reset,
  emptyMessage,
  handleLoginUser,
  setTokenIsNotThere,
  setTokenIsThere,
} = authSlice.actions;
export default authSlice.reducer;
