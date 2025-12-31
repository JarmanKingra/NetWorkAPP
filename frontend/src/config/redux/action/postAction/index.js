import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/getAllPost");
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkAPI) => {
        const {file, body} = userData;
        try {
            const formData = new FormData();

            formData.append('token', localStorage.getItem('token'))
            formData.append('body', body)
            formData.append('media', file)
            
            const response = await clientServer.post("/post", formData, {
                headers: {
                    'Content-Type': "multipart/form-data"
                }
            });
            if(response.status == 200){
            return thunkAPI.fulfillWithValue("Post Uploaded")
            }else{
                return thunkAPI.fulfillWithValue("Post Upload Fail")
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const incrementLikes = createAsyncThunk(
    "post/incrementLikes",
    async(gotData, thunkAPI) => {
        try {
            const response = await clientServer.post("/incriment_like", {
                
                    postId: gotData.postId,
                    token: localStorage.getItem('token') // added now -- 
                
            })

            // await thunkAPI.dispatch(getAllPosts());

        // if(response.status == 200){
            return thunkAPI.fulfillWithValue("Liked")
        // } else {
        //     return thunkAPI.rejectWithValue("Not Liked")
        // }
        } catch (error) {
              return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getComments = createAsyncThunk(
    "/getAllComments",
    async(postData, thunkAPI) => {
        try {
            const response = await clientServer.get("/get_comments_by_post", {
                params: {
                    postId: postData.postId
                }

            })
            return thunkAPI.fulfillWithValue({
                comments: response.data,
                postId: postData.postId
            })
        } catch (error) {
            return thunkAPI.rejectWithValue("something went wrong");
        }
    }
)

export const postComment = createAsyncThunk(
    "post/Comment",
    async(conmmentData, thunkAPI) => {
        try {
            const response = await  clientServer.post("/comment", {
                post_Id: conmmentData.postId,
                token: localStorage.getItem('token'),
                commentBody: conmmentData.body,
            })

            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
             return thunkAPI.rejectWithValue("something went wrong");
        }
    }
)

