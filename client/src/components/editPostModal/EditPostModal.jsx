import React, { useState } from "react";
import style from "./EditPost.module.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updatePost } from "../../store/postsSlice";

const EditPostModal = ({post, setShowEdit}) => {
  const [newImage, setNewImage] = useState("");
  const [oldImage, setOldImage] = useState(`${post?.imgUrl}`);
  const [text, setText] = useState(`${post?.text}`);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = () => {
    try {
      const updatedPost = new FormData();
      updatedPost.append("id", post?._id);
      updatedPost.append("image", newImage);
      updatedPost.append("text", text);
      dispatch(updatePost(updatedPost));
      navigate(-1)
      toast("Пост успешно изменен!");
      setTimeout(() => {window.location.reload()}, 200)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.postcreate}>
      <form
        className={style.postcreate__form}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className={style.postcreate__file}
          type="file"
          onChange={(e) => {
            setNewImage(e.target.files[0]);
            setOldImage("");
          }}
        />
        <div>
          {oldImage && (
            <img
              className={style.postcreate__img}
              src={`http://localhost:3005/${oldImage}`}
              alt={oldImage.name}
            />
          )}
          {newImage && (
            <img
              className={style.postcreate__img}
              src={URL.createObjectURL(newImage)}
              alt={newImage.name}
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
            Обновить пост
          </button>
          <button onClick={() => setShowEdit((show) => !show)} className={style.postcreate__btn}>
            Отменить
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostModal;