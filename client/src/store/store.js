import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import postsSlice from './postsSlice';
import commentsSlice from './commentsSlice';
import usersSlice from './usersSlice';
import messagesSlice from './messageSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    comments: commentsSlice,
    users: usersSlice,
    messages: messagesSlice,
  },
})