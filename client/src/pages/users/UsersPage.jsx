import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../store/usersSlice";
import User from "../../components/user/User";
import style from "./Users.module.scss";
import { userData } from "../../store/authSlice";

const UsersPage = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const { searchUsers } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(searchUser(value))
    document.title = "Друзья";
  }, [value]);

  return (
    <div className={style.users}>
      <div className={style.users__container}>
        <h3 className={style.users__title}>Все пользователи</h3>
        <div className={style.users__search}>
          <input
            onChange={(e) => setValue(e.target.value)}
            className={style.users__input}
            type="text"
            placeholder="Поиск пользователя"
          />
          <svg
            className={style.users__svg}
            id="Layer_1"
            viewBox="0 0 170 170"
            xmlns="http://www.w3.org/2000/svg"
            width="40px"
            height="40px"
          >
            <path
              d="m63.3 59.9c3.8-4.6 6.2-10.5 6.2-17 0-14.6-11.9-26.5-26.5-26.5s-26.5 11.9-26.5 26.5 11.9 26.5 26.5 26.5c6.4 0 12.4-2.3 17-6.2l20.6 20.6c.5.5 1.1.7 1.7.7s1.2-.2 1.7-.7c.9-.9.9-2.5 0-3.4zm-20.4 4.7c-12 0-21.7-9.7-21.7-21.7s9.7-21.7 21.7-21.7 21.7 9.7 21.7 21.7-9.7 21.7-21.7 21.7z"
              fill="#000000"
              style={{ fill: "rgb(140, 140, 140)" }}
            ></path>
          </svg>
        </div>
        <div className={style.users__block}>
          {searchUsers?.map((user) => 
            <User key={user._id} user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
