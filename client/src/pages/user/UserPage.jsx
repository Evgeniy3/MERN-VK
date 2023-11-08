import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addFriend, removeFriend, userData } from "../../store/authSlice";
import Moment from "react-moment";
import style from "./UserPage.module.scss";
import age from "../../utils/age";
import PostItem from "../../components/post/PostItem";
import PostModal from "../../components/postModal/PostModal";
import axios from "../../axios";
import "moment/locale/ru";
import Subscribers from "../../components/subscribe/Subscribers";
import Subscriptions from "../../components/subscribe/Subscriptions";
import { socket } from "../../server";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [userSubscribers, setUserSubscribers] = useState(null);
  const [userSubscriptions, setUserSubscriptions] = useState(null);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector(userData);
  const params = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`users/user/${params.id}`);
        setUser(data);
      } catch (e) {
        console.log(e);
      }
    };
    const fetchUserPosts = async () => {
      try {
        const { data } = await axios.get(`posts/user/${params.id}`);
        setUserPosts(data);
      } catch (e) {
        console.log(e);
      }
    };
    const fetchUserSubscribers = async () => {
      try {
        const { data } = await axios.get(`users/userSubscribers/${params.id}`);
        setUserSubscribers(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchUserSubscriptions = async () => {
      try {
        const { data } = await axios.get(
          `users/userSubscriptions/${params.id}`
        );
        setUserSubscriptions(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
    fetchUserPosts();
    fetchUserSubscribers();
    fetchUserSubscriptions();
    document.title = `${user?.name} ${user?.lastName}`;
  }, [user]);

  const subscribe = () => {
    dispatch(addFriend(params.id));
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const unSubscribe = () => {
    dispatch(removeFriend(params.id));
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const isSubscribe = data?.subscriptions.filter((sub) => sub === user?._id);

  if (show) {
    document.body.style.overflowY = "hidden";
  } else {
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
  }

  return (
    <div className={style.main}>
      <div className={style.main__blocktop}>
        <div className={style.main__img}>
          <img
            className={style.main__avatar}
            src={`http://localhost:3005/${user?.avatar}`}
            alt=""
          />
          <div className={data?.status === 'Online' ? `${style.main__statusOnline}` : `${style.main__statusOffline}`}></div>
        </div>
        <div className={style.main__infoblock}>
          <div className={style.main__infoname}>
            <h1 className={style.main__name}>
              {user?.name} {user?.lastName}
            </h1>
            <div>
              {isSubscribe?.length > 0 ? (
                <button onClick={unSubscribe} className={style.main__editbtn}>
                  Отписаться
                </button>
              ) : (
                <button onClick={subscribe} className={style.main__editbtn}>
                  Подписаться
                </button>
              )}
              <button
                onClick={() => {
                  socket?.emit("start_conversation", {to: user._id, from: data._id})
                  navigate('/chat')
                }}
                className={style.main__editbtn}
               >
                Написать сообщение
              </button>
            </div>
          </div>
          <div className={style.main__info}>
            <p>{user?.city}</p>
            <p>{age(user?.birthday)} лет</p>
            <p>
              <Moment local format="DD MMM YYYY">
                {user?.birthday}
              </Moment>
            </p>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>
      <div className={style.main__blockbottom}>
        <div className={style.main__posts}>
          <div className={style.main__postshead}>
            <p className={style.main__posttitle}>Записи {user?.name}</p>
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
          {userPosts?.length !== 0 ? (
            userPosts?.map((post, index) => (
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
        {show && <PostModal setShow={setShow} />}
        <div className={style.main__friends}>
          <div className={style.main__subscribers}>
            <p className={style.main__subtitle}>
              Подписчики <span>{user?.subscribers.length}</span>
            </p>
            {userSubscribers?.length !== 0 ? (
              <div className={style.main__subblock}>
                {userSubscribers?.map((sub) => (
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
              Подписки <span>{user?.subscriptions.length}</span>
            </p>
            {userSubscriptions?.length !== 0 ? (
              <div className={style.main__subblock}>
                {userSubscriptions?.map((sub) => (
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
  );
};

export default UserPage;
