import React, {useEffect} from 'react';
import style from './Login.module.scss';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkIsAuth, fetchLogin, userData } from "../../store/authSlice";
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const LoginPage = () => {
  const isAuth = useSelector(checkIsAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {message}  = useSelector(state => state.auth);

  useEffect(() => {
    document.title = 'Вход';
    if (isAuth) navigate('/')
}, [isAuth])

  const LoginSchema = yup.object().shape({
    email: yup.string().required('Укажите почту!'),
    password: yup.string().required('Укажите пароль').min(5, 'Минимум 5 символов!'),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit = (values) => {
    try {
      dispatch(fetchLogin(values)) 
      toast(message)
    } catch(error) {
      console.log(error);
    }  
  }; 
  
  return (
      <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
        <h3 className={style.form__title}>Вход</h3>
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
            type="password"
            placeholder="Пароль"
            {...register("password", { required: "Укажите пароль" })}
          />
          <p className={style.form__error}>{errors.password?.message}</p>
        </label>
        <button type="submit" disabled={!isValid} className={style.form__btn}>
          Войти
        </button>
        <Link
          to="/register"
          className={style.form__link}
        >
          Нет аккаунта?
        </Link>
      </form>
  )
};

export default LoginPage;