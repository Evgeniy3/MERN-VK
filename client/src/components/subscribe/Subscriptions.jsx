import React from "react";
import style from "./Subscribe.module.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userData } from "../../store/authSlice";

const Subscriptions = ({ sub }) => {
  const data = useSelector(userData)

  return (
    <Link to={data?._id === sub?._id ? '/' : `/user/${sub?._id}`}>
      <div className={style.sub}>
        <img
          className={style.sub__img}
          src={`http://localhost:3005/${sub?.avatar}`}
          alt=""
        />
        <p className={style.sub__name}>{sub?.name}</p>
      </div>
    </Link>
  );
};

export default Subscriptions;
