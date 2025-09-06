import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../action/authAction";


const initialState = {
    user: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequests: []
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset : () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage : (state) => {
            state.message = ""
        }
    },

    extraReducers: (builder) => {

        builder
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true,
            state.message = "Knocking the door..."
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false,
            state.isError = false,
            state.isSuccess = true,
            state.loggedIn = true,
            state.message = "User LoggedIn Successfully"

        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false,
            state.isError = true,
            state.message = action.payload

        })
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true,
            state.message = "registering you"
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false,
            state.isError = false,
            state.isSuccess = true,
            state.loggedIn = true,
            state.message = {message: "Registration is SuccessFull, please SignIn"}

        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false,
            state.isError = true,
            state.message = action.payload

        })
    }

})
export const { reset, emptyMessage, handleLoginUser } = authSlice.actions;
export default authSlice.reducer;