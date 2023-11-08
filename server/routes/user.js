import { Router } from "express";
import { addUser, getAll, getById, getMySubscribers, getMySubscriptions, getUserSubscribers, getUserSubscriptions, removeFriend, updateMe } from "../controllers/user.js";
import { checkAuth } from '../utils/checkAuth.js'

const router = new Router();

router.get('/', checkAuth, getAll);

router.get('/user/:id', checkAuth, getById);

router.post('/user', checkAuth, addUser);

router.post('/user/:id', checkAuth, removeFriend);

router.get('/mySubscriptions', checkAuth, getMySubscriptions);

router.get('/mySubscribers', checkAuth, getMySubscribers);

router.get('/userSubscriptions/:id', checkAuth, getUserSubscriptions);

router.get('/userSubscribers/:id', checkAuth, getUserSubscribers);

router.put('/me/edit', checkAuth, updateMe);

export default router;