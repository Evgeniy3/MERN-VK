import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
  comments: [],
  message: "",
  status: "Loading",
};

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({postId, comment}) => {
    try {
      const { data } = await axios.post(`/comments/${postId}`, {
        postId,
        comment
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getPostComments = createAsyncThunk("comments/getPostComments", async (postId) => {
  try {
    const { data } = await axios.get(`/posts/comments/${postId}`);
    return data;
  } catch (error) {
    console.log(error);
  }
});


export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: {
    // Создание комментария
    [createComment.pending]: (state) => {
      state.status = "Loading";
    },
    [createComment.fulfilled]: (state, action) => {
      state.status = "Success";
      state.comments.push(action.payload);
      state.message = action.payload.message;
    },
    [createComment.rejectWithValue]: (state, action) => {
      state.status = "Error";
      state.message = action.payload.message;
    },
    // Получаение комментариев
    [getPostComments.pending]: (state) => {
      state.status = "Loading";
    },
    [getPostComments.fulfilled]: (state, action) => {
      state.status = "Success";
      state.comments = action.payload;
    },
    [getPostComments.rejected]: (state, action) => {
      state.status = "Error";
      state.message = action.payload.message;
    },
  },
});

export default commentsSlice.reducer;
