import "./styles/app.scss";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/navbar/Layout";
import MainPage from "./pages/main/MainPage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { getMe, userData } from "./store/authSlice";
import { getAllUsers } from "./store/usersSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import PostsPage from "./pages/posts/PostsPage";
import PostModal from "./components/postModal/PostModal";
import EditPostModal from "./components/editPostModal/EditPostModal";
import UsersPage from "./pages/users/UsersPage";
import UserPage from "./pages/user/UserPage";
import ChatPage from "./pages/chat/ChatPage";
import MusicPage from "./pages/music/MusicPage";
import ScrollToTop from "react-scroll-up";
import { connectSocket, socket } from "./server";
import { addDirectConversation, addDirectMessage, selectConversation, updateDirectConversation } from "./store/messageSlice";

function App() {
  const dispatch = useDispatch();
  const data = useSelector(userData);
  const {conversations, current_conversation} = useSelector((state) => state.messages);
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    dispatch(getMe());
    dispatch(getAllUsers());
  }, [dispatch]);
  
    const userId = data?._id

    if(!socket && userId !== undefined) {
      connectSocket(userId)
    }

    socket?.on("start_chat", (data) => {
      const existing_conversation = conversations.find(
        (el) => el?.id === data._id
      );
      if (existing_conversation) {
        dispatch(updateDirectConversation({ conversation: data, userId: userId }));
      } else {
        dispatch(addDirectConversation({ conversation: data, userId: userId }));
      }
      dispatch(selectConversation({chatType: "individal", room_id: data._id }));
    });

    socket?.on("new_message", (data) => {
      const message = data.message;
      if (current_conversation?.id === data.conversation_id) {
        dispatch(
          addDirectMessage({
            id: message._id,
            type: "msg",
            subtype: message.type,
            message: message.text,
            incoming: message.to,
            outgoing: message.from,
          })
        );
      }
    });

  return (
    <>
      <ScrollToTop
        showUnder={10}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          color: "#62aaeb",
          backgroundColor: "#222222",
          height: "100vh",
          width: "90px",
          paddingTop: 50,
          paddingLeft: 30,
          fontSize: 14,
        }}
      >
        &#5169; Наверх
      </ScrollToTop>
      <div className="main__container">
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path=":id" element={<PostModal />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="user/:id" element={<UserPage />} />
            <Route path=":id/edit" element={<EditPostModal />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>

          <ToastContainer theme="dark" autoClose={4000} position="top-right" />
        </Layout>
      </div>
    </>
  );
}

export default App;
