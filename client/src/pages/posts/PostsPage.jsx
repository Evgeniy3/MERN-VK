import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostItem from "../../components/post/PostItem.jsx";
import style from "./Posts.module.scss";
import PostPop from "../../components/post/PostPop.jsx";
import { getAllPosts } from "../../store/postsSlice/index.js";
import SearchItem from "../../components/search/SearchItem.jsx";
import PostModal from "../../components/postModal/PostModal.jsx";

const PostsPage = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const { posts, popularPosts, filterPosts } = useSelector(
    (state) => state.posts
  );

  if (show) {
    document.body.style.overflowY = "hidden";
  } else {
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
  }

  useEffect(() => {
    dispatch(getAllPosts());
    document.title = "Новости";
  }, [dispatch]);

  if (!posts?.length) {
    return <div className={style.posts__empty}>Пока что нет ни одного поста.</div>;
  }
  return (
    <div className={style.posts}>
      <div className={style.posts__all}>
        <SearchItem />
          {filterPosts?.map((post, index) => (
            <PostItem index={index} key={post._id} post={post} setShow={setShow}/>
          ))}   
      </div>
      {show && <PostModal />}
      <div className={style.posts__popular}>
        <h2 className={style.posts__title}>Популярное:</h2>
        {popularPosts?.map((post) => 
          <PostPop key={post._id} post={post} setShow={setShow}/>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
