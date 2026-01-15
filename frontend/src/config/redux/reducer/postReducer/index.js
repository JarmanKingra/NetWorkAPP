import { createSlice } from "@reduxjs/toolkit";
import { reset } from "../authReducer";
import { getAllPosts, getComments } from "../../action/postAction";

const initialState = {
    posts: [],
    isError: false,
    postsFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    comments: [],
    postId: "",
}

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = ""
        }
        }, extraReducers: (builder) => {
            builder
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true
                state.message = "Fetching all the posts..."
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.postsFetched = true
                state.posts = action.payload.posts
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.postId = action.payload.postId
                state.comments = action.payload.comments
            })
    }
})
export const {resetPostId} = postSlice.actions;
export default postSlice.reducer