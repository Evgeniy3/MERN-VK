import React from "react";
import style from "./Navbar.module.scss";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { checkIsAuth, logout } from "../../store/authSlice";
import logoImg from "../../assets/img/logo.png";
import logoutSvg from "../../assets/svg/logout.svg";
import registerSvg from "../../assets/svg/register.svg";
import loginSvg from "../../assets/svg/login.svg";
import homeSvg from "../../assets/svg/home.svg";
import friendsSvg from "../../assets/svg/friends.svg";
import newsSvg from "../../assets/svg/news.svg";
import chatSvg from "../../assets/svg/chat.svg";
import musicSvg from "../../assets/svg/music.svg";
import MusicPlayer from "../music/MusicPlayer";

const Navbar = () => {
  const discpstch = useDispatch();
  const isAuth = useSelector(checkIsAuth);

  const activeBtn = {
    'background-color': '#222222',
    'border-radius': '5px',
  };

  const clickLogout = () => {
    if (window.confirm("Вы действительно хотите выйти?")) {
      discpstch(logout());
      window.localStorage.removeItem("token");
      toast("Вы вышли из аккаунта!");
    }
  };

  return (
    <>
    <div className={style.navbar__top}>
        <div className={style.navbar__logo}>
          <img className={style.navbar__logoimg} src={logoImg} alt="" />
          <p className={style.navbar__logotext}>ВКОНТАКТЕ</p>
        </div>
        <div>
          {isAuth ? (
            <div className={style.navbar__topsetting}>
              <div className={style.navbar__topsearch}>
              <svg
                  className={style.navbar__searchsvg}
                  id="Layer_1"
                  viewBox="0 0 140 140"
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
                <input className={style.navbar__topinput} type="text" placeholder="Поиск"/>
                <MusicPlayer />
              </div>
              <NavLink
                onClick={clickLogout}
                to={"/login"}
                href="/login"
              >
                <div title="Выход">
                  <img className={style.navbar__logoutImg} src={logoutSvg} alt="Выход" />
                </div>
              </NavLink>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    <div className={style.navbar}>
      {!isAuth ? (
        <ul className={style.navbar__item}>
          <li className={style.navbar__list}>
            <NavLink
              to={"/register"}
              href="/register"
              style={({ isActive }) => (isActive ? activeBtn : undefined)}
            >  
              <img className={style.navbar__img} src={registerSvg} alt="" />
              <p className={style.navbar__text}>Регистрация</p>
            </NavLink>
          </li>
          <li className={style.navbar__list}>
            <NavLink
              to={"/login"}
              href="/login"
              style={({ isActive }) => (isActive ? activeBtn : undefined)}
            >
              <img className={style.navbar__img} src={loginSvg} alt="" />
              <p className={style.navbar__text}>Вход</p>
            </NavLink>
          </li>
        </ul>
      ) : (
        <ul className={style.navbar__item}>
          <li className={style.navbar__list}>
            <NavLink
              to={"/"}
              href="/"
              style={({ isActive }) => (isActive ? activeBtn : undefined)}
            >
              <img className={style.navbar__img} src={homeSvg} alt="" />
              <p className={style.navbar__text}>Моя страница</p>
            </NavLink>
          </li>
          <li className={style.navbar__list}>
            <NavLink
              to={"/posts"}
              href="/posts"
              style={({ isActive }) => (isActive ? activeBtn : undefined)}
            >
              <img className={style.navbar__img} src={newsSvg} alt="" />
              <p className={style.navbar__text}>Новости</p>    
            </NavLink>
          </li>
          <li className={style.navbar__list}>
            <NavLink
              to={"/chat"}
              href="/chat"
              style={({ isActive }) => (isActive ? activeBtn : undefined)}
            >
              <img className={style.navbar__img} src={chatSvg} alt="" />
              <p className={style.navbar__text}>Мессенджер</p>    
            </NavLink>
          </li>
          <li className={style.navbar__list}>
            <NavLink
              to={"/users"}
              href="/users"
              style={({ isActive }) => (isActive ? activeBtn : undefined)}
            >
              <img className={style.navbar__img} src={friendsSvg} alt="" />
              <p className={style.navbar__text}>Друзья</p>
            </NavLink>
          </li>
          <li className={style.navbar__list}>
            <NavLink
              to={"/music"}
              href="/music"
              style={({ isActive }) => (isActive ? activeBtn : undefined)}
            >
              <img className={style.navbar__img} src={musicSvg} alt="" />
              <p className={style.navbar__text}>Музыка</p>    
            </NavLink>
          </li>
        </ul>
      )}
    </div>
    </>
  );
};

export default Navbar;
