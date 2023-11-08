import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import style from './Channel.module.scss';
import { selectConversation } from '../../store/messageSlice';

const Channel = ({conversation}) => {
  const dispatch = useDispatch()
  useEffect(() => {
    document.title = 'Сообщения'
  }, [])
  console.log('conversation',conversation);
  const handleChannel = () => {
      dispatch(selectConversation({chatType: 'individal', roomId: conversation.id}))
  }
  return (
    <div
      onClick={handleChannel}
      className={style.channel}
     >
        <img className={style.channel__img} src={`http://localhost:3005/${conversation.img}`} alt="" />
        <div className={style.channel__info}>
            <h4 className={style.channel__name}>{conversation.name}</h4>
            <p className={style.channel__text}>{conversation.msg}</p>
        </div>
    </div>
  )
};

export default Channel;