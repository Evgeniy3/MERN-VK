import { Router } from "express";
import { createPost, getAll, getById, removePost, updatePost, getMyPosts, getPostComments, getUserPosts, getLike } from "../controllers/post.js";
import { checkAuth } from '../utils/checkAuth.js'

const router = new Router();

router.post('/', checkAuth, createPost)

router.get('/', checkAuth, getAll);

router.get('/user/me', checkAuth, getMyPosts);

router.get('/user/:id', checkAuth, getUserPosts);

router.get('/:id', checkAuth, getById);

router.delete('/:id', checkAuth, removePost);

router.put('/:id', checkAuth, updatePost);

router.put('/:id/like', checkAuth, getLike);

router.get('/comments/:id', checkAuth, getPostComments);

export default router;