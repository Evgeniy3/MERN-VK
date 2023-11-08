import React, { useState } from "react";
import style from "./CreatePost.module.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../store/postsSlice";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = () => {
    try {
      const data = new FormData();
      data.append("image", image);
      data.append("text", text);
      dispatch(createPost(data));
      navigate("/");
      toast("Пост успешно создан!");
    } catch (error) {
      console.log(error);
    }
  };

  const clearFormHandler = () => {
    setImage("");
    setText("");
  };

  return (
    <div className={style.postcreate}>
      <form className={style.postcreate__form} onSubmit={(e) => e.preventDefault()}>
        <input
          className={style.postcreate__file}
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div>
          {image && (
            <img
              className={style.postcreate__img}
              src={URL.createObjectURL(image)}
              alt={image.name}
            />
          )}
        </div>
        <textarea
          className={style.postcreate__text}
          value={text}
          onChange={(e) => setText(e.target.value)}
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="Описание"
        ></textarea>
        <div className={style.postcreate__btnblock}>
          <button
            type="submit"
            onClick={submitHandler}
            className={style.postcreate__btn}
          >
            Создать пост
          </button>
          <button onClick={clearFormHandler} className={style.postcreate__btn}>
            Отменить
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
