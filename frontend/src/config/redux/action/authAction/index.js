import { clientServer } from "@/config";

import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(`/login`, {
        password: user.password,
        email: user.email
      });
      if(response.data.token){
        localStorage.setItem("token", response.data.token)
      }else {
        return thunkAPI.rejectWithValue({message: "token not provided"})
      }

      return thunkAPI.fulfillWithValue(response.data.token)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
    "user/register",
    async(user, thunkAPI) => {
        try {
        const response = await clientServer.post(`/register`, {
        password: user.password,
        email: user.email,
        username: user.username,
        name: user.name

      });

      return thunkAPI.fulfillWithValue(response.value);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async(user, thunkAPI) => {
    try {
      
      const response = await clientServer.get("/get_user_profile", {
        params : {
          token : user.token 
        }

      })

      return thunkAPI.fulfillWithValue(response.data)
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

export const getAllUsers = createAsyncThunk(
  "/getAllUsers",
  async(_, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_All_user_profiles");
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async(com, thunkAPI) => {
    try {
      const response = await clientServer.delete("/deletePost", {
        data: {
          token: localStorage.getItem('token'),
          postId:  com.postId
        }
      })
      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

export const sendConnectionRequest = createAsyncThunk(
  "user/sendconnectionrequest",
  async(user, thunkAPI) => {
    try {

      const response = await clientServer.post("/send_connetion_request", {
        
          token: localStorage.getItem('token'),
          connectionId: user.connectionId
        
      })

      thunkAPI.dispatch(getConnetionRequest({token: user.token}));

      return thunkAPI.fulfillWithValue(response.data)
      
    } catch (error) {
       return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

export const getConnetionRequest = createAsyncThunk(  // to whom whom i sent 
  "/getconnectionRequest", 
  async(user, thunkAPI) => {
    try {
      
      const response = await clientServer.get("/get_My_Connection_Requests", {
        params: {
          token: user.token
        }
      })

      return thunkAPI.fulfillWithValue(response.data.connections)

    } catch (error) {
       return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

export const whatAreMyConnection = createAsyncThunk( // who who sent me
  "whatAremyconnections", 
  async(user, thunkAPI) => {
    try {
      
      const response =  await clientServer.get("/what_Are_My_Connection", {
        params: {
          token: user.token
        }
      })

      return thunkAPI.fulfillWithValue(response.data.connections);

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
)

export const acceptConnectionRequest = createAsyncThunk(
  "accepttheConnectionRequests", 
  async(user, thunkAPI) => {
    try {

      const response =  await clientServer.post("/accept_Connection_Request", {
       
          token: user.token,
          requestId : user.connectionId,
          action_type: user.action
        
      })

      thunkAPI.dispatch(getConnetionRequest({token: user.token}));
      thunkAPI.dispatch(whatAreMyConnection({token: user.token}))

      return thunkAPI.fulfillWithValue(response.data);
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)