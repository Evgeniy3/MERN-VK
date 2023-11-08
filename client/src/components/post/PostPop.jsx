import React from "react";
import style from "./Post.module.scss";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import 'moment/locale/ru';

const PostPop = ({setShow, post}) => {
  if (!post) {
    return <div>Постов нет.</div>;
  }
  return (
    <Link to={`/${post._id}`} onClick={() => setShow((show) => !show)} className={style.link}>
      <div className={style.postpop}>
        <div className={style.postpop__block}>
          <div className={style.postpop__blockimg}>
            <img className={style.postpop__img} src={`http://localhost:3005/${post?.imgUrl}`} alt="" />
          </div>
          <div className={style.postpop__info}>
            <h4 className={style.postpop__title}>{post?.username}</h4>
            <p className={style.postpop__date}><Moment local format="hh:mm DD MMM YYYY">{post?.createdAt}</Moment></p>
          </div>
        </div>
        <p className={style.postpop__description}>
          {post?.text}
        </p>
      </div>
    </Link>
  );
};

export default PostPop;
