import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
  data: null,
  token: null,
  message: '',
  status: "Loading",
};

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    try {
      const { data } = await axios.post("/auth/register", params);
      if (data.token) {
        window.localStorage.setItem("token", data.token);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchLogin = createAsyncThunk(
  "auth/fetchLogin",
  async (params) => {
    try {
      const { data } = await axios.post("/auth/login", params);
      if (data.token) {
        window.localStorage.setItem("token", data.token);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getMe = createAsyncThunk("auth/getMe", async () => {
  try {
    const { data } = await axios.get("/auth/me");
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const addFriend = createAsyncThunk("auth/addFriend", async (friendId) => {
  try {
    const { data } = await axios.post("/users/user", {
      friendId
    });
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const removeFriend = createAsyncThunk("auth/removeFriend", async (friendId) => {
  try {
    const { data } = await axios.post(`/users/user/${friendId}`, {
      friendId
    });
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const updateMe = createAsyncThunk("users/updateMe", async (params) => {
  try {
    const { data } = await axios.put('/users/me/edit', params);
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.token = null;
    },
  },
  extraReducers: {
    // Register user
    [fetchRegister.pending]: (state) => {
      state.status = "Loading";
      state.data = null;
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.status = "Success";
      state.data = action.payload?.user;
      state.message = action.payload.message;
      state.token = action.payload.token
    },
    [fetchRegister.rejectWithValue]: (state) => {
      state.status = "Error";
      state.data = null;
    },
    // Login user
    [fetchLogin.pending]: (state) => {
      state.status = "Loading";
      state.data = null;
    },
    [fetchLogin.fulfilled]: (state, action) => {
      state.status = "Success";
      state.data = action.payload.user;
      state.message = action.payload.message;
      state.token = action.payload.token
    },
    [fetchLogin.rejectWithValue]: (state) => {
      state.status = "Error";
      state.data = null;
    },
    // Getme
    [getMe.pending]: (state) => {
      state.status = "Loading";
      state.data = null;
    },
    [getMe.fulfilled]: (state, action) => {
      state.status = "Success";
      state.data = action.payload?.user;
      state.message = action.payload.message;
      state.token = action.payload.token
    },
    [getMe.rejectWithValue]: (state) => {
      state.status = "Error";
      state.data = null;
    },
    // addFriend
    [addFriend.pending]: (state) => {
      state.status = "Loading";
      state.data = null;
    },
    [addFriend.fulfilled]: (state, action) => {
      state.status = "Success";
      state.data?.subscriptions.push(action.payload.user)
      state.message = action.payload.message;
    },
    [addFriend.rejectWithValue]: (state) => {
      state.status = "Error";
      state.data = null;
    },
    // removeFriend
    [removeFriend.pending]: (state) => {
      state.status = "Loading";
      state.data = null;
    },
    [removeFriend.fulfilled]: (state, action) => {
      state.status = "Success";
      if(state.data !== null) {
        state.data.subscriptions = state.data?.subscriptions?.filter((sub) => 
        sub !== action.payload._id
      )
      }
      state.message = action.payload.message;
    },
    [removeFriend.rejectWithValue]: (state) => {
      state.status = "Error";
      state.data = null;
    },
    // updateMe
    [updateMe.pending]: (state) => {
      state.status = "Loading";
    },
    [updateMe.fulfilled]: (state, action) => {
      state.status = "Success";
      state.data = action.payload.user;
      state.message = action.payload.message;
    },
    [updateMe.rejectWithValue]: (state, action) => {
      state.status = "Error";
      state.message = action.payload.message;
    },
  },
});

export const userData = (state) => state.auth.data;

export const checkIsAuth = (state) => Boolean(state.auth.token);
export const { logout } = authSlice.actions;
export default authSlice.reducer;
