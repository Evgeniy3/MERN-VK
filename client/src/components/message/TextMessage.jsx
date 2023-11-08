import React from "react";
import style from './Message.module.scss'
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";

const TextMessage = ({ msg }) => {
  const data = useSelector(userData)
  const {current_conversation} = useSelector((state) => state.messages)
    console.log('msg',msg, current_conversation);
  return (
    <div className={style.text}>
      <img className={style.text__img} src={msg.outgoing ? `http://localhost:3005/${data?.avatar}` : `http://localhost:3005/${current_conversation.img}`} alt="" />
      <div className={style.text__block}>
        <h4 className={style.text__name}>{msg.outgoing ? `${data?.name} ${data?.lastName}` : `${current_conversation.name}`}</h4>
        <p className={style.text__text}>
          {msg.message}
        </p>
      </div>
    </div>
  );
};

export default TextMessage;
