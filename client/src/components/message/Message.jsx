import React, { useEffect, useState } from "react";
import style from "./Message.module.scss";
import EmojiPicker from "emoji-picker-react";
import { socket } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentMessages, setCurrentConversation } from "../../store/messageSlice";
import { userData } from "../../store/authSlice";
import TextMessage from "./TextMessage";

const Message = () => {
  const [showEmj, setShowEmj] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const data = useSelector(userData);
  const {current_conversation, current_messages, conversations, roomId} = useSelector((state) => state.messages);
  const userId = data?._id
console.log('current_messages', current_messages, current_conversation);
  const onEmojiClick = (emojiObject) => {
    setMessage((prevInput) => prevInput + emojiObject.emoji);
  };

  useEffect(() => {
    const current = conversations.find((el) => el?.id === roomId);

    socket?.emit("get_messages", { conversation_id: current?.id }, (data) => {
      dispatch(
        fetchCurrentMessages({ messages: data, userId: userId })
      );
    });

    dispatch(setCurrentConversation(current));
  }, [])

  const handleMessage = () => {
    socket.emit("text_message", { conversation_id: current_conversation.id, message, from: userId, to: current_conversation.user_id});
    setMessage('')
  }

  return (
    <div className={style.message}>
      <h3 className={style.message__name}>{current_conversation?.name}</h3>
      <div className={style.message__textblock}>
        <p className={style.message__text}>
          {current_messages?.map((msg) => 
            <TextMessage key={msg?._id} msg={msg}/>
          )}
        </p>
      </div>
      <div className={style.message__create}>
        <svg
          onClick={() => setShowEmj((vol) => !vol)}
          className={style.message__smile}
          version="1.1"
          id="Layer_1"
          viewBox="0 0 74 74"
          width="10px"
          height="10px"
        >
          <g id="SMILE_1_">
            <path
              d="M46.4257965,41.0966988c-0.4990005-0.2343979-1.0937958-0.0205002-1.3311005,0.4775009 C44.9511986,41.8769989,41.4667969,49,32,49c-9.4491997,0-12.9384995-7.0966988-13.0946999-7.4238014 c-0.2334003-0.5-0.8262005-0.7138977-1.3290997-0.482399c-0.5,0.2342987-0.7158012,0.8291016-0.4824009,1.3300018 C17.2577991,42.7733994,21.2266006,51,32,51s14.7421989-8.2266006,14.9062958-8.5761986 C47.1395988,41.9238014,46.9237976,41.3311005,46.4257965,41.0966988z"
              fill="#000000"
              style={{ fill: "rgb(140, 140, 140)" }}
            ></path>
            <path
              d="M32,0C14.3268995,0,0,14.3268003,0,32c0,17.6730995,14.3268995,32,32,32s32-14.3269005,32-32 C64,14.3268003,49.6730957,0,32,0z M32,62C15.4579,62,2,48.542099,2,32S15.4579,2,32,2s30,13.4579,30,30S48.542099,62,32,62z"
              fill="#000000"
              style={{ fill: "rgb(140, 140, 140)" }}
            ></path>
            <path
              d="M22,30c3.3136997,0,6-2.6863003,6-6s-2.6863003-6-6-6s-6,2.6863003-6,6S18.6863003,30,22,30z M22,20 c2.2056007,0,4,1.7943993,4,4s-1.7943993,4-4,4s-4-1.7943993-4-4S19.7943993,20,22,20z"
              fill="#000000"
              style={{ fill: "rgb(140, 140, 140)" }}
            ></path>
            <path
              d="M42,18c-3.3137016,0-6,2.6863003-6,6s2.6862984,6,6,6c3.3136978,0,6-2.6863003,6-6S45.3136978,18,42,18z M42,28 c-2.2056007,0-4-1.7943993-4-4s1.7943993-4,4-4c2.2055969,0,4,1.7943993,4,4S44.2055969,28,42,28z"
              fill="#000000"
              style={{ fill: "rgb(140, 140, 140)" }}
            ></path>
          </g>
        </svg>
        <input
          className={style.message__input}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          type="text"
          placeholder="Написать сообщение..."
        />
        <div className={style.message__emoji}>
          {showEmj && <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} />}
        </div>
        <button onClick={handleMessage} className={style.message__btn}>
          <svg id="object" viewBox="0 0 500 500" width="50px" height="30px">
            <g id="_26" data-name="26">
              <path
                d="m30.814 507.555a26.44 26.44 0 0 1 -26.314-27.435l6.571-186.434v-.11a26.212 26.212 0 0 1 19.749-24.417 15.947 15.947 0 0 1 3.1-.482l225.639-12.677-225.63-12.677a15.947 15.947 0 0 1 -3.1-.482 26.212 26.212 0 0 1 -19.749-24.417v-.11l-6.58-186.434a26.361 26.361 0 0 1 38.132-24.615l450.315 225.157a26.361 26.361 0 0 1 0 47.156l-450.315 225.157a26.371 26.371 0 0 1 -11.818 2.82zm12.049-207.329-6.05 171.642 431.736-215.868-431.736-215.868 6.05 171.642 324.262 18.219a16.025 16.025 0 0 1 3.1.483 26.36 26.36 0 0 1 0 51.048 16.025 16.025 0 0 1 -3.1.483z"
                fill="#000000"
                style={{ fill: "rgb(140, 140, 140)" }}
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Message;
