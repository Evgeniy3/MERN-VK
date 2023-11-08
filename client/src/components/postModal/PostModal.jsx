import React, { useCallback, useEffect, useState } from "react";
import style from "./PostModal.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import Moment from "react-moment";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { removePost } from "../../store/postsSlice";
import { toast } from "react-toastify";
import { userData } from "../../store/authSlice";
import { createComment, getPostComments } from "../../store/commentsSlice";
import Comment from "../../components/comment/Comment";
import EmojiPicker from "emoji-picker-react";
import EditPostModal from "../editPostModal/EditPostModal";
import likeSvg from '../../assets/svg/like.svg'
import redLikeSvg from '../../assets/svg/redlike.svg'
import "moment/locale/ru";

function PostModal() {
  const data = useSelector(userData);
  const [showEdit, setShowEdit] = useState(false);
  const [post, setPost] = useState(null);
  const [showEmj, setShowEmj] = useState(false);
  const [comment, setComment] = useState("");

  const { users } = useSelector((state) => state.users);
  const { comments } = useSelector((state) => state.comments);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const correctUser = users.filter((user) => user?._id === post?.author);
  
  const fetchPost = useCallback(async () => {
    const { data } = await axios.get(`/posts/${params.id}`);
    setPost(data);
  }, [params.id]);

  const removePostHandler = () => {
      if (window.confirm("Вы действительно хотите удалить пост?")) {
        dispatch(removePost(params.id));
        navigate(-1);
        toast("Пост удален!");
        setTimeout(() => {window.location.reload()}, 200)
      } 
  };

  const sendCommentHandler = () => {
    try {
      const postId = params.id;
      dispatch(createComment({ postId, comment }));
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = useCallback(async () => {
    try {
      dispatch(getPostComments(params.id));
    } catch (error) {
      console.log(error);
    }
  }, [params.id]);

  const onEmojiClick = (emojiObject) => {
    setComment((prevInput) => prevInput + emojiObject.emoji);
  };

  const handlerLike = useCallback(async () => {
     await axios.put(`posts/${post?._id}/like`)
     fetchPost();
  }, [post?.like])

  useEffect(() => {
    fetchPost();
    fetchComments();
    document.title = "Новости";
  }, [fetchPost, fetchComments]);

  if (!post) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={style.post__modal}>
      <div
        className={
          !showEdit ? `${style.post}` : `${style.post} ${style.postedit}`
        }
      >
        <div className={style.post__createblock}>
        <img className={style.post__createimg} src={`http://localhost:3005/${correctUser[0]?.avatar}`} alt="" />
          <div className={style.post__create}>
            <h4 className={style.post__author}>{post?.username}</h4>
            <p className={style.post__date}>
              <Moment local format="hh:mm DD MMM YYYY">
                {post?.createdAt}
              </Moment>
            </p>
          </div>
        </div>
        <p className={style.post__description}>{post?.text}</p>
        <div className={style.post__blockimg}>
          <img
            className={style.post__img}
            src={`http://localhost:3005/${post?.imgUrl}`}
            alt=""
          />
        </div>
        <div className={style.post__infoblock}>
          <div className={style.post__like}>
            <div className={style.post__info}>
            <img onClick={handlerLike} className={style.post__likeimg} src={post?.like.includes(data._id) ? redLikeSvg : likeSvg} alt="" />
            <p>{post?.like.length}</p>
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
        <div className={style.btn}>
          <button
            onClick={() => navigate(-1)}
            className={style.btn__close}
            title="Закрыть"
          >
            <svg id="Close" viewBox="0 0 128 128" width="25px" height="25px">
              <path
                d="m71.1 64 42.9 42.9-7.1 7.1-42.9-42.9-42.9 42.9-7.1-7.1 42.9-42.9-42.9-42.9 7.1-7.1 42.9 42.9 42.9-42.9 7.1 7.1z"
                fill="#000000"
                style={{ fill: "rgb(140, 140, 140)" }}
              ></path>
            </svg>
          </button>
          {data?._id === post?.author ? (
            <>
              <button
                onClick={() => setShowEdit((showEdit) => !showEdit)}
                className={style.btn__edit}
                title="Редактировать"
              >
                <svg
                  version="1.1"
                  id="Layer_1"
                  viewBox="0 0 512.019 512.019"
                  width="25px"
                  height="25px"
                >
                  <g>
                    <g>
                      <polygon
                        points="350.316,80.852 0,431.166 0,512.009 80.841,512.009 431.157,161.693 "
                        fill="#000000"
                        style={{ fill: "rgb(140, 140, 140)" }}
                      ></polygon>
                    </g>
                  </g>
                  <g>
                    <g>
                      <rect
                        x="406.542"
                        y="10.214"
                        transform="matrix(0.7071 -0.7071 0.7071 0.7071 82.5924 334.1501)"
                        width="76.218"
                        height="114.327"
                        fill="#000000"
                        style={{ fill: "rgb(140, 140, 140)" }}
                      ></rect>
                    </g>
                  </g>
                </svg>
              </button>
              <button
                onClick={removePostHandler}
                className={style.btn__remove}
                title="Удалить"
              >
                <svg viewBox="0 0 25 25" width="30px" height="30px">
                  <g id="Layer_13" data-name="Layer 13">
                    <path
                      d="M20.24,2.05H4.76A2.72,2.72,0,0,0,2.05,4.76V7a.5.5,0,0,0,.5.5H4.26V20.24A2.72,2.72,0,0,0,7,23H18a2.72,2.72,0,0,0,2.71-2.71V7.47h1.71A.5.5,0,0,0,23,7V4.76A2.72,2.72,0,0,0,20.24,2.05Zm-.5,18.19A1.72,1.72,0,0,1,18,22H7a1.72,1.72,0,0,1-1.71-1.71V7.47H19.74ZM22,6.47H3.05V4.76A1.72,1.72,0,0,1,4.76,3.05H20.24A1.72,1.72,0,0,1,22,4.76Z"
                      fill="#000000"
                      style={{ fill: "rgb(140, 140, 140)" }}
                    ></path>
                    <path
                      d="M9.18,18.53a.5.5,0,0,0,.5-.5V11.39a.5.5,0,0,0-.5-.5.51.51,0,0,0-.5.5V18A.51.51,0,0,0,9.18,18.53Z"
                      fill="#000000"
                      style={{ fill: "rgb(140, 140, 140)" }}
                    ></path>
                    <path
                      d="M15.82,18.53a.51.51,0,0,0,.5-.5V11.39a.51.51,0,0,0-.5-.5.5.5,0,0,0-.5.5V18A.5.5,0,0,0,15.82,18.53Z"
                      fill="#000000"
                      style={{ fill: "rgb(140, 140, 140)" }}
                    ></path>
                  </g>
                </svg>
              </button>
            </>
          ) : (
            <div></div>
          )}
        </div>
        <div className={style.comments}>
          <div className={style.comments__block}>
            {comments.length === 0 ? (
              <p className={style.comments__empty}>
                Будьте первым, кто оставит комментарий <br></br> под этим постом
              </p>
            ) : (
              comments?.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))
            )}
          </div>
          <div className={style.comments__enter}>
            <svg
              onClick={() => setShowEmj((vol) => !vol)}
              className={style.comments__smile}
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={style.comments__input}
              type="text"
              placeholder="Оставить комментарий"
            />
            <svg
              onClick={sendCommentHandler}
              className={style.comments__btn}
              id="object"
              viewBox="0 0 500 500"
              width="50px"
              height="30px"
            >
              <g id="_26" data-name="26">
                <path
                  d="m30.814 507.555a26.44 26.44 0 0 1 -26.314-27.435l6.571-186.434v-.11a26.212 26.212 0 0 1 19.749-24.417 15.947 15.947 0 0 1 3.1-.482l225.639-12.677-225.63-12.677a15.947 15.947 0 0 1 -3.1-.482 26.212 26.212 0 0 1 -19.749-24.417v-.11l-6.58-186.434a26.361 26.361 0 0 1 38.132-24.615l450.315 225.157a26.361 26.361 0 0 1 0 47.156l-450.315 225.157a26.371 26.371 0 0 1 -11.818 2.82zm12.049-207.329-6.05 171.642 431.736-215.868-431.736-215.868 6.05 171.642 324.262 18.219a16.025 16.025 0 0 1 3.1.483 26.36 26.36 0 0 1 0 51.048 16.025 16.025 0 0 1 -3.1.483z"
                  fill="#000000"
                  style={{ fill: "rgb(140, 140, 140)" }}
                ></path>
              </g>
            </svg>
            <div className={style.comments__emoji}>
              {showEmj && (
                <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} />
              )}
            </div>
          </div>
        </div>
      </div>
      {showEdit && <EditPostModal post={post} setShowEdit={setShowEdit}/>}
    </div>
  );
}

export default PostModal;
