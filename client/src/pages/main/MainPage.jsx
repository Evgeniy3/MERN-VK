import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { checkIsAuth, userData } from "../../store/authSlice";
import axios from "../../axios";
import Moment from "react-moment";
import style from "./Main.module.scss";
import age from "../../utils/age";
import PostItem from "../../components/post/PostItem";
import PostModal from "../../components/postModal/PostModal";
import EditMeModal from "../../components/editMeModal/EditMeModal";
import CreatePost from "../../components/createPost/CreatePost";
import "moment/locale/ru";
import Subscribers from "../../components/subscribe/Subscribers";
import Subscriptions from "../../components/subscribe/Subscriptions";

const MainPage = () => {
  const isAuth = useSelector(checkIsAuth);
  const [myPosts, setMyPosts] = useState(null);
  const [mySubscriptions, setMySubscriptions] = useState(null);
  const [mySubscribers, setMySubscribers] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [show, setShow] = useState(false);
  const data = useSelector(userData);
  const navigate = useNavigate();

  if (!window.localStorage.getItem("token")) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const { data } = await axios.get("/posts/user/me");
        setMyPosts(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchMySubscriptions = async () => {
      try {
        const { data } = await axios.get("/users/mySubscriptions");
        setMySubscriptions(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchMySubscribers = async () => {
      try {
        const { data } = await axios.get("/users/mySubscribers");
        setMySubscribers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyPosts();
    fetchMySubscriptions();
    fetchMySubscribers();
    document.title = `${data?.name} ${data?.lastName}`;
  }, [data, data?.posts?.length]);

  if (show) {
    document.body.style.overflowY = "hidden";
  } else {
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
  }

  return (
    <div>
      {!isAuth ? (
        <h1>Загрузка...</h1>
      ) : (
        <div className={style.main}>
          <div className={style.main__blocktop}>
            <div className={style.main__img}>
              <img
                className={style.main__avatar}
                src={`http://localhost:3005/${data?.avatar}`}
                alt=""
              />
              <div className={data?.status === 'Online' ? `${style.main__statusOnline}` : `${style.main__statusOffline}`}></div>
            </div>
            <div className={style.main__infoblock}>
              <div className={style.main__infoname}>
                <h1 className={style.main__name}>
                  {data?.name} {data?.lastName}
                </h1>
                <button
                  onClick={() => setShowEdit((showEd) => !showEd)}
                  className={style.main__editbtn}
                >
                  Редактировать профиль
                </button>
                {showEdit && <EditMeModal setShowEdit={setShowEdit} />}
              </div>
              <div className={style.main__info}>
                <p>{data?.city}</p>
                <p>{age(data?.birthday)} лет</p>
                <p>
                  <Moment local format="DD MMM YYYY">
                    {data?.birthday}
                  </Moment>
                </p>
                <p>{data?.email}</p>
              </div>
            </div>
          </div>
          <div className={style.main__blockbottom}>
            <div className={style.main__posts}>
              <CreatePost />
              <div className={style.main__postshead}>
                <p className={style.main__posttitle}>Мои записи</p>
                <input
                  className={style.main__postsearch}
                  type="text"
                  name=""
                  id=""
                  placeholder="Поиск поста"
                />
                <svg
                  className={style.main__searchsvg}
                  id="Layer_1"
                  viewBox="0 0 170 170"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  height="30px"
                >
                  <path
                    d="m63.3 59.9c3.8-4.6 6.2-10.5 6.2-17 0-14.6-11.9-26.5-26.5-26.5s-26.5 11.9-26.5 26.5 11.9 26.5 26.5 26.5c6.4 0 12.4-2.3 17-6.2l20.6 20.6c.5.5 1.1.7 1.7.7s1.2-.2 1.7-.7c.9-.9.9-2.5 0-3.4zm-20.4 4.7c-12 0-21.7-9.7-21.7-21.7s9.7-21.7 21.7-21.7 21.7 9.7 21.7 21.7-9.7 21.7-21.7 21.7z"
                    fill="#000000"
                    style={{ fill: "rgb(140, 140, 140)" }}
                  ></path>
                </svg>
              </div>
              {myPosts?.length !== 0 ? (
                myPosts?.map((post, index) => (
                  <PostItem
                    index={index}
                    key={post?._id}
                    post={post}
                    setShow={setShow}
                  />
                ))
              ) : (
                <div className={style.main__postemty}>
                  На стене пока нет ни одной записи
                </div>
              )}
            </div>
            {show && <PostModal />}
            <div className={style.main__friends}>
              <div className={style.main__subscribers}>
                <p className={style.main__subtitle}>
                  Подписчики <span>{data?.subscribers.length}</span>
                </p>
                {mySubscribers?.length !== 0 ? (
                  <div className={style.main__subblock}>
                    {mySubscribers?.map((sub) => (
                      <Subscribers key={sub._id} sub={sub} />
                    ))}
                  </div>
                ) : (
                  <div className={style.main__subemty}>
                    На Вас никто не подписан
                  </div>
                )}
              </div>
              <div className={style.main__subscribers}>
                <p className={style.main__subtitle}>
                  Подписки <span>{data?.subscriptions.length}</span>
                </p>
                {mySubscriptions?.length !== 0 ? (
                  <div className={style.main__subblock}>
                    {mySubscriptions?.map((sub) => (
                      <Subscriptions key={sub._id} sub={sub} />
                    ))}
                  </div>
                ) : (
                  <div className={style.main__subemty}>
                    Вы ни на кого не подписаны
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
