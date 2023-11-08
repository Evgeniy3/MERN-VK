import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
  users: [],
  searchUsers: [],
  message: "",
  status: "Loading",
};

export const getAllUsers = createAsyncThunk("users/getAllUsers", async () => {
  try {
    const { data } = await axios.get('/users');
    return data;
  } catch (error) {
    console.log(error);
  }
});



export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    searchUser: (state, action) => {
        state.searchUsers = state.users.filter((user) => 
            user.name.toLowerCase().includes(action.payload.toLowerCase())
        )
      },
  },
  extraReducers: {
    // Получение всех пользователей
    [getAllUsers.pending]: (state) => {
      state.status = "Loading";
    },
    [getAllUsers.fulfilled]: (state, action) => {
      state.status = "Success";
      state.users = action.payload;
      state.message = action.payload?.message;
    },
    [getAllUsers.rejectWithValue]: (state, action) => {
      state.status = "Error";
      state.message = action.payload.message;
    },
  },
});

export const { searchUser } = usersSlice.actions

export default usersSlice.reducer;
