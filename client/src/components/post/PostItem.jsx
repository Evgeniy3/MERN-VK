import React, { useState } from "react";
import style from "./Post.module.scss";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import 'moment/locale/ru';
import { useSelector } from "react-redux";
import axios from '../../axios'
import { userData } from "../../store/authSlice";
import likeSvg from '../../assets/svg/like.svg'
import redLikeSvg from '../../assets/svg/redlike.svg'


const Post = ({ setShow, post , index}) => {
  const data = useSelector(userData);
  const { users } = useSelector((state) => state.users);
  const [like, setLike] = useState([post?.like.includes(data?._id) ? redLikeSvg : likeSvg]);
  const [count, setCount] = useState(post?.like.length);
  
  const correctUser = users.filter((user) => user?._id === post?.author);

  const handlerLike = async () => {
    if (like == likeSvg) {
      await axios.put(`posts/${post?._id}/like`)
      setLike(redLikeSvg);
      setCount(count + 1);
    } else {
      await axios.put(`posts/${post?._id}/like`)
      setLike(likeSvg)
      setCount(count - 1);
    }
  }

  return (
    <div className={index === 0 ? `${style.postfirst}` : `${style.post}`}>
      <div className={style.post__createblock}>
        <img className={style.post__createimg} src={`http://localhost:3005/${correctUser[0]?.avatar}`} alt="" />
        <div className={style.post__create}>
          <h4 className={style.post__author}>{correctUser[0]?.name} {correctUser[0]?.lastName}</h4>
          <p className={style.post__date}> <Moment local format="hh:mm DD MMM YYYY">{post?.createdAt}</Moment></p>
        </div>
      </div>
      <Link to={`/${post?._id}`} onClick={() => setShow((show) => !show)} className={style.post__link}>
        <p className={style.post__description}>
          {post?.text}
        </p>
        <div className={style.post__blockimg}>
          <img className={style.post__img} src={`http://localhost:3005/${post?.imgUrl}`} alt="" />
        </div>
      </Link>
      <div className={style.post__infoblock}>
        <div className={style.post__like}>
          <div className={style.post__info}>
            <img onClick={handlerLike} className={style.post__likeimg} src={like} alt="" />
            <p>{count}</p>
          </div>
          <div className={style.post__info}>
            <svg viewBox="0 0 23 23" width="20px" height="20px">
              <path
                d="M5.59,22.86a.78.78,0,0,1-.21,0A.59.59,0,0,1,5,22.27V18.73A9.65,9.65,0,0,1,2,11.5C2,6.26,6.71,2,12.5,2S23,6.26,23,11.5,18.29,21,12.5,21a11.35,11.35,0,0,1-4.22-.8L6,22.67A.63.63,0,0,1,5.59,22.86ZM12.5,3C7.26,3,3,6.81,3,11.5a8.54,8.54,0,0,0,2.82,6.61l.18.15v2.95L8,19l.33.15A10.41,10.41,0,0,0,12.5,20c5.24,0,9.5-3.81,9.5-8.5S17.74,3,12.5,3Z"
                fill="#000000"
                style={{ fill: "rgb(140, 140, 140)" }}
              ></path>
            </svg>
            <p>{post?.comments.length}</p>
          </div>
        </div>
        <div className={style.post__info}>
          <svg
            version="1.1"
            id="Layer_1"
            viewBox="0 0 370 570"
            width="15px"
            height="15px"
          >
            <g>
              <g>
                <g>
                  <path
                    d="M505.755,240.92l-89.088-89.088c-88.576-88.597-232.747-88.597-321.323,0L6.256,240.92 c-8.341,8.341-8.341,21.824,0,30.165l89.088,89.088c44.288,44.288,102.464,66.453,160.661,66.453s116.373-22.165,160.661-66.453 l89.088-89.088C514.096,262.744,514.096,249.261,505.755,240.92z M256.005,362.669c-58.816,0-106.667-47.851-106.667-106.667 s47.851-106.667,106.667-106.667s106.667,47.851,106.667,106.667S314.821,362.669,256.005,362.669z"
                    fill="#000000"
                    style={{ fill: "rgb(140, 140, 140)" }}
                  ></path>
                  <path
                    d="M256.005,192.003c-35.285,0-64,28.715-64,64s28.715,64,64,64s64-28.715,64-64S291.291,192.003,256.005,192.003z"
                    fill="#000000"
                    style={{ fill: "rgb(140, 140, 140)" }}
                  ></path>
                </g>
              </g>
            </g>
          </svg>
          <p>{post?.views}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
