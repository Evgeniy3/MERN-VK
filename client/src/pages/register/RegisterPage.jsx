import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import style from "./Register.module.scss";
import { checkIsAuth, fetchRegister, userData } from "../../store/authSlice";
import { toast } from "react-toastify";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const RegisterPage = () => {
  const isAuth = useSelector(checkIsAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {message}  = useSelector(state => state.auth);

  useEffect(() => {
    document.title = 'Регистрация';
    if (isAuth) navigate('/')
}, [isAuth, message])

const RegisterSchema = yup.object().shape({
  avatar: yup.mixed(),
  name: yup.string().required('Укажите имя!').min(3, 'Минимум 2 символов!'),
  lastName: yup.string().required('Укажите фамилию!').min(3, 'Минимум 2 символов!'),
  birthday: yup.string().required('Укажите дату рождения!'),
  city: yup.string().required('Укажите город!').min(3, 'Минимум 3 символов!'),
  email: yup.string().required('Укажите почту!'),
  password: yup.string().required('Укажите пароль').min(5, 'Минимум 5 символов!'),
}).required();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(RegisterSchema),
    mode: "all",
  });

  const onSubmit = ({ avatar, name, lastName, email, birthday, city, password }) => {
    try {
      const data = new FormData();
      data.append("image", avatar[0]);
      data.append("name", name);
      data.append("lastName", lastName);
      data.append("email", email);
      data.append("birthday", birthday);
      data.append("city", city);
      data.append("password", password);
      dispatch(fetchRegister(data));
      toast(message)
    } catch (error) {
      console.log(error);
    }
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
        <h3 className={style.form__title}>Регистрация</h3>
        <label htmlFor="file" className={style.form__lbfile}>
          <p>Фото</p>
          <input
            id="file"
            className={style.form__file}
            type="file"
            {...register("avatar")}
          />
          <p className={style.form__error}>{errors.avatar?.message}</p>
        </label>
        <label className={style.form__lb}>
          <input
            className={style.form__input}
            type="text"
            placeholder="Имя"
            {...register("name", { required: "Укажите имя!" })}
          />
          <p className={style.form__error}>{errors.name?.message}</p>
        </label>
        <label className={style.form__lb}>
          <input
            className={style.form__input}
            type="text"
            placeholder="Фамилия"
            {...register("lastName", { required: "Укажите фамилию!" })}
          />
          <p className={style.form__error}>{errors.lastName?.message}</p>
        </label>
        <label className={style.form__lb}>
          <input
            className={style.form__input}
            type="email"
            placeholder="vasya@mail.ru"
            {...register("email", { required: "Укажите почту" })}
          />
          <p className={style.form__error}>{errors.email?.message}</p>
        </label>
        <label className={style.form__lb}>
          <input
            className={style.form__input}
            type="date"
            placeholder="Дата рождения"
            {...register("birthday", { required: "Укажите дату рождения" })}
          />
          <p className={style.form__error}>{errors.birthday?.message}</p>
        </label>
        <label className={style.form__lb}>
          <input
            className={style.form__input}
            type="text"
            placeholder="Город"
            {...register("city", { required: "Укажите город" })}
          />
          <p className={style.form__error}>{errors.city?.message}</p>
        </label>
        <label className={style.form__lb}>
          <input
            className={style.form__input}
            type="password"
            placeholder="Пароль"
            {...register("password", { required: "Укажите пароль" })}
          />
          <p className={style.form__error}>{errors.password?.message}</p>
        </label>
        <button type="submit" disabled={!isValid} className={style.form__btn}>
          Зарегистрироваться
        </button>
        <Link to="/login" className={style.form__link}>
          Уже зарегистрированы?
        </Link>
      </form>
  );
};

export default RegisterPage;
