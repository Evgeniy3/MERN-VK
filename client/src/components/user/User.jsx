import React from "react";
import style from "./User.module.scss";
import { Link } from "react-router-dom";
import age from '../../utils/age'
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";

const User = ({ user }) => {
  const data = useSelector(userData)

  return (
    <Link to={data?._id === user?._id ? '/' : `/user/${user?._id}`} className={style.link}>
      <div className={style.user}>
        <img
          className={style.user__img}
          src={`http://localhost:3005/${user?.avatar}`}
          alt="Аватар"
        />
        <div className={style.user__info}>
          <h3 className={style.user__title}>{user?.name} {user?.lastName}</h3>
          <div className={style.user__dopinfo}>
            <p className={style.user__city}>{user?.city}</p>
            <p className={style.user__age}>{age(user.birthday)} лет</p>
            <p className={style.user__status}>Online</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default User;
