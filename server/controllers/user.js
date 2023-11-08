import User from '../models/user.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export const getAll = async (req, res) => {
    try {
        const users = await User.find().sort('-createdAt')

        if (!users) {
            return res.json({ message: 'Пользователей нет!' })
        }

        res.json(users)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const getById = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id)

        res.json(user)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const addUser = async (req, res) => {
    try {
        const {friendId} = req.body;
        const user = await User.findById(friendId);
        const me = await User.findById(req.userId);

        await User.findByIdAndUpdate(req.userId, {
            $push: { subscriptions: user },
        }) 

        await User.findByIdAndUpdate(friendId, {
            $push: { subscribers: me },
        }) 

        return res.json({user, message: `${user.name} добавлен в друзья!`})
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const removeFriend = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id)

        if(!user) res.json({message: 'Такого пользователя не существует!'})

        await User.findByIdAndUpdate(req.userId, {
            $pull: {subscriptions: req.params.id}
        })

        await User.findByIdAndUpdate(req.params.id, {
            $pull: {subscribers: req.userId}
        })
        res.json({message: `${user.name} успешно удален из друзей!`})
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const getMySubscribers = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const mySubscribers = await Promise.all(
            user.subscribers.map((friend) => {
                return User.findById(friend._id)
            })
            
        )
    
        res.json(mySubscribers)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const getMySubscriptions = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const mySubscriptions = await Promise.all(
            user.subscriptions.map((friend) => {
                return User.findById(friend._id)
            })
        )
    
        res.json(mySubscriptions)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const getUserSubscribers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const userSubscribers = await Promise.all(
            user.subscribers.map((friend) => {
                return User.findById(friend._id)
            })
            
        )
    
        res.json(userSubscribers)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const getUserSubscriptions = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const userSubscriptions = await Promise.all(
            user.subscriptions.map((friend) => {
                return User.findById(friend._id)
            })
        )
    
        res.json(userSubscriptions)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const updateMe = async (req, res) => {
    try {
        const {name, lastName, city, birthday, id} = req.body;
        const user = await User.findById(id)

        if(req.files) {
            let fileName = Date.now().toString() + req.files.image.name;
            let __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
            user.avatar = fileName || '' 
        }

        user.name = name || user.name
        user.lastName = lastName || user.lastName
        user.city = city || user.city
        user.birthday = birthday || user.birthday

        await user.save()

        res.json(user)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}