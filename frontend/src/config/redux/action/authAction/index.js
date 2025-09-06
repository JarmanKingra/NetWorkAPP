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
