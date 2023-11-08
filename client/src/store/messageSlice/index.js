import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  current_conversation: null,
  current_messages: [],
  chatType: null,
  roomId: null,
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    selectConversation: (state, action) => {
        state.chatType = action.payload.chatType
        state.roomId = action.payload.roomId
    },
    fetchDirectConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        const user = el.participants.find(
          (elm) => elm._id.toString() !== action.payload.userId
        );
        return {
          id: el._id,
          user_id: user?._id,
          name: `${user?.name} ${user?.lastName}`,
          online: user?.status === "Online",
          img: `${user?.avatar}`,
          msg: el.messages.slice(-1)[0]?.text, 
          time: "9:36",
          unread: 0,
          pinned: false,
        };
      });

      state.conversations = list;
    },
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.conversations = state.conversations.map(
        (el) => {
          if (el?.id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== action.payload.userId
            );
            return {
              id: this_conversation._id._id,
              user_id: user?._id,
              name: `${user?.name} ${user?.lastName}`,
              online: user?.status === "Online",
              img: `${user?.avatar}`,
              msg: el.messages.slice(-1)[0]?.text, 
              time: "9:36",
              unread: 0,
              pinned: false,
            };
          }
        }
      );
    },
    addDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== action.payload.userId
      );
      state.conversations = state.conversations.filter(
        (el) => el?.id !== this_conversation._id
      );
      state.conversations.push({
        id: this_conversation._id._id,
        user_id: user?._id,
        name: `${user?.name} ${user?.lastName}`,
        online: user?.status === "Online",
        img: `${user?.avatar}`,
        msg: this_conversation?.messages.slice(-1)[0]?.text, 
        time: "9:36",
        unread: 0,
        pinned: false,
      });
    },
    setCurrentConversation(state, action) {
      state.current_conversation = action.payload;
    },
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.to === action.payload.userId,
        outgoing: el.from === action.payload.userId,
      }));
      state.current_messages = formatted_messages;
    },
    addDirectMessage(state, action) {
      state.current_messages.push(action.payload.message);
    }
  },
});

export const { selectConversation, fetchDirectConversations, updateDirectConversation, addDirectConversation, fetchCurrentMessages, addDirectMessage, setCurrentConversation } = messagesSlice.actions;

export default messagesSlice.reducer;