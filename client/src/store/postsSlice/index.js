import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
  posts: [],
  popularPosts: [],
  filterPosts: [],
  message: "",
  status: "Loading",
};

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (params) => {
    try {
      const { data } = await axios.post("/posts", params);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllPosts = createAsyncThunk("posts/getAllPosts", async () => {
  try {
    const { data } = await axios.get("/posts");
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const removePost = createAsyncThunk("posts/removePost", async (id) => {
  try {
    const { data } = await axios.delete(`/posts/${id}`, id);
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const updatePost = createAsyncThunk("posts/updatePost", async (params) => {
  try {
    const { data } = await axios.put(`/posts/${params.id}`, params);
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    searchPost: (state, action) => {
      state.filterPosts = state.posts.filter((post) => 
        post?.text.toLowerCase().includes(action.payload.toLowerCase())
      )
    },
  },
  extraReducers: {
    // Создание поста
    [createPost.pending]: (state) => {
      state.status = "Loading";
    },
    [createPost.fulfilled]: (state, action) => {
      state.status = "Success";
      state.posts.push(action.payload.posts);
      state.message = action.payload.message;
    },
    [createPost.rejectWithValue]: (state, action) => {
      state.status = "Error";
      state.message = action.payload.message;
    },
    // Получаение всех постов
    [getAllPosts.pending]: (state) => {
      state.status = "Loading";
    },
    [getAllPosts.fulfilled]: (state, action) => {
      state.status = "Success";
      state.posts = action.payload.posts;
      state.popularPosts = action.payload.popularPosts;
      state.message = action.payload.message;
    },
    [getAllPosts.rejected]: (state, action) => {
      state.status = "Error";
      state.message = action.payload.message;
    },
    // Удаление поста
    [removePost.pending]: (state) => {
      state.status = "Loading";
    },
    [removePost.fulfilled]: (state, action) => {
      state.status = "Success";
      state.posts = state.posts.filter((post) => 
        post._id !== action.payload._id
      )
      state.message = action.payload.message;
    },
    [removePost.rejected]: (state, action) => {
      state.status = "Error";
      state.message = action.payload.message;
    },
    // Обновление поста
    [updatePost.pending]: (state) => {
      state.status = "Loading";
    },
    [updatePost.fulfilled]: (state, action) => {
      state.status = "Success";
      const index = state.posts.findIndex((post) => 
        post._id === action.payload._id,
      )
      state.posts[index] = action.payload
      state.message = action.payload.message;
    },
    [updatePost.rejected]: (state, action) => {
      state.status = "Error";
      state.message = action.payload.message;
    },
  },
});

export const { searchPost } = postsSlice.actions

export default postsSlice.reducer;
