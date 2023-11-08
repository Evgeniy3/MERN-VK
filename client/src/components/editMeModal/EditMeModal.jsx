import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { checkIsAuth, getMe, userData } from "../../store/authSlice";
import style from "./EditMe.module.scss";
import { updateMe } from "../../store/authSlice";

const EditMeModal = ({ setShowEdit }) => {
  const data = useSelector(userData);
  const [newImage, setNewImage] = useState("");
  const [oldImage, setOldImage] = useState(data?.avatar);
  const [name, setName] = useState(data?.name);
  const [lastName, setLastName] = useState(data?.lastName);
  const [city, setCity] = useState(data?.city);
  const [birthday, setBirthday] = useState(data?.birthday);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = () => {
    try {
      const updateMyData = new FormData();
      updateMyData.append("id", data._id);
      updateMyData.append("image", newImage);
      updateMyData.append("name", name);
      updateMyData.append("lastName", lastName);
      updateMyData.append("birthday", birthday);
      updateMyData.append("city", city);
      dispatch(updateMe(updateMyData));
      setBirthday('')
      setCity('')
      setLastName('')
      setName('')
      setOldImage('')
      navigate('/')
      setTimeout(() => {window.location.reload()}, 200)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.editme}>
      <div className={style.editme__container}>
        <h4 className={style.editme__title}>Профиль</h4>
        <form
          onSubmit={(e) => e.preventDefault()}
        >
          <div className={style.editme__form}>
          <div className={style.editme__blockimg}>
            <label for='file' className={style.editme__lb}>
              <input
                id="file"
                className={style.editme__inputimg}
                type="file"
                onChange={(e) => {
                  setNewImage(e.target.files[0]);
                  setOldImage("");
                }}
              />
            </label>
            {oldImage && (
              <img
                className={style.editme__img}
                src={`http://localhost:3005/${oldImage}`}
                alt={oldImage.name}
              />
            )}
            {newImage && (
              <img
                className={style.editme__img}
                src={URL.createObjectURL(newImage)}
                alt={newImage.name}
              />
            )}
          </div>
          <div className={style.editme__description}>
            <input
              type="text"
              className={style.editme__input}
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              className={style.editme__input}
              placeholder="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <input
              type="text"
              className={style.editme__input}
              placeholder="Город"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <input
              type="date"
              className={style.editme__input}
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          </div>
          
          <div className={style.editme__btnblock}>
              <button
                type="submit"
                onClick={onSubmit}
                className={style.editme__btn}
              >
                Обновить
              </button>
              <button
                onClick={() => setShowEdit((showEd) => !showEd)}
                className={style.editme__btn}
              >
                Отменить
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditMeModal;
