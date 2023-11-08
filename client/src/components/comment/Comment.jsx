import React from "react";
import style from "./Comment.module.scss";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import 'moment/locale/ru';

const Comment = ({ comment }) => {
  const { users } = useSelector((state) => state.users);
  const correctUser = users.filter((user) => user._id === comment.author);
  return (
    <div className={style.comment}>
      <img className={style.comment__img} src={`http://localhost:3005/${correctUser[0]?.avatar}`} alt="" />
      <div className={style.comment__info}>
        <div className={style.comment__date}>
          <h5 className={style.comment__name}>{correctUser[0]?.name} {correctUser[0]?.lastName}</h5>
          <p className={style.comment__time}><Moment local format="hh:mm DD MMM YYYY">{comment?.createdAt}</Moment></p>
        </div>
        <p className={style.comment__text}>
          {comment?.comment}
        </p>
      </div>
    </div>
  );
};

export default Comment;
