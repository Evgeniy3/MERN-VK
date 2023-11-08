import React, { useState } from "react";
import style from "./CreatePost.module.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../store/postsSlice";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";

const CreatePost = () => {
  const [showEmj, setShowEmj] = useState(false);
  const [image, setImage] = useState("");
  const [text, setText] = useState("");

  const onEmojiClick = (emojiObject) => {
    setText((prevInput) => prevInput + emojiObject.emoji);
  };

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
      setImage("");
      setText("");
      setTimeout(() => {window.location.reload()}, 100)
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
      <div className={style.postcreate__emoji}>
          {showEmj && <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} />}
        </div>
      <form
        className={style.postcreate__form}
        onSubmit={(e) => e.preventDefault()}
      >
        <svg
          onClick={() => setShowEmj((vol) => !vol)}
          className={style.postcreate__smile}
          version="1.1"
          id="Layer_1"
          viewBox="0 0 74 74"
          width="25px"
          height="25px"
        >
          <g id="SMILE_1_">
            <path
              d="M46.4257965,41.0966988c-0.4990005-0.2343979-1.0937958-0.0205002-1.3311005,0.4775009 C44.9511986,41.8769989,41.4667969,49,32,49c-9.4491997,0-12.9384995-7.0966988-13.0946999-7.4238014 c-0.2334003-0.5-0.8262005-0.7138977-1.3290997-0.482399c-0.5,0.2342987-0.7158012,0.8291016-0.4824009,1.3300018 C17.2577991,42.7733994,21.2266006,51,32,51s14.7421989-8.2266006,14.9062958-8.5761986 C47.1395988,41.9238014,46.9237976,41.3311005,46.4257965,41.0966988z"
              fill="#000000"
              style={{ fill: "rgb(140, 140, 140)" }}
            ></path>
            <path
              d="M32,0C14.3268995,0,0,14.3268003,0,32c0,17.6730995,14.3268995,32,32,32s32-14.3269005,32-32 C64,14.3268003,49.6730957,0,32,0z M32,62C15.4579,62,2,48.542099,2,32S15.4579,2,32,2s30,13.4579,30,30S48.542099,62,32,62z"
              fill="#000000"
              style={{ fill: "rgb(140, 140, 140)" }}
            ></path>
            <path
              d="M22,30c3.3136997,0,6-2.6863003,6-6s-2.6863003-6-6-6s-6,2.6863003-6,6S18.6863003,30,22,30z M22,20 c2.2056007,0,4,1.7943993,4,4s-1.7943993,4-4,4s-4-1.7943993-4-4S19.7943993,20,22,20z"
              fill="#000000"
              style={{ fill: "rgb(140, 140, 140)" }}
            ></path>
            <path
              d="M42,18c-3.3137016,0-6,2.6863003-6,6s2.6862984,6,6,6c3.3136978,0,6-2.6863003,6-6S45.3136978,18,42,18z M42,28 c-2.2056007,0-4-1.7943993-4-4s1.7943993-4,4-4c2.2055969,0,4,1.7943993,4,4S44.2055969,28,42,28z"
              fill="#000000"
              style={{ fill: "rgb(140, 140, 140)" }}
            ></path>
          </g>
        </svg>
        <label className={style.postcreate__lb} htmlFor="file" title="Прикрепить фото">
          <svg
            version="1.1"
            id="Layer_1"
            viewBox="0 0 600 600"
            width="35px"
            height="40px"
          >
            <path
              style={{ fill: "rgb(112, 112, 112)" }}
              d="M314.85,123.681L198.31,325.534c-22.027,38.153-70.988,51.272-109.141,29.244 c-38.152-22.027-51.271-70.987-29.244-109.14L182.935,32.58c17.972-31.128,57.917-41.832,89.046-23.86 c31.128,17.972,41.832,57.918,23.86,89.046L192.147,277.37c-14.02,24.283-45.181,32.634-69.464,18.614s-32.632-45.182-18.612-69.465 l97.225-168.398c2.841-4.922,9.135-6.608,14.056-3.767c4.922,2.841,6.608,9.135,3.767,14.057l-97.225,168.398 c-8.346,14.456-3.376,33.006,11.079,41.352c14.456,8.346,33.006,3.375,41.352-11.081L278.019,87.476 c12.298-21.301,4.974-48.635-16.327-60.934c-21.301-12.298-48.636-4.974-60.934,16.327L77.748,255.928 c-16.354,28.325-6.614,64.673,21.711,81.027s64.674,6.614,81.027-21.711l116.54-201.852c2.841-4.922,9.135-6.608,14.056-3.767 C316.005,112.466,317.691,118.759,314.85,123.681z"
              fill="#5C6670"
            ></path>
          </svg>
        </label>
        <input
          id="file"
          className={style.postcreate__file}
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <textarea
          tabIndex="0"
          className={style.postcreate__text}
          value={text}
          onChange={(e) => setText(e.target.value)}
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="Что у вас нового?"
        ></textarea>
        <div className={style.postcreate__imgblock}>
          {image && (
            <img
              className={style.postcreate__img}
              src={URL.createObjectURL(image)}
              alt={image.name}
            />
          )}
        </div>
        <div className={style.postcreate__btnblock}>
          <button
            type="submit"
            onClick={submitHandler}
            className={style.postcreate__btn}
          >
            Опубликовать
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
