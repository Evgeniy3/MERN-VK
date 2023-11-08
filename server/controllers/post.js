import User from '../models/user.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export const createPost = async (req, res) => {
    try {
        const { text } = req.body

        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name;
            let __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

            const newPostWithImage= new Post({
                text,
                imgUrl: fileName,
                author: req.userId
              });

            await newPostWithImage.save(); 

            await User.findByIdAndUpdate(req.userId, {
                $push: { posts: newPostWithImage },
            }) 

            return res.json({newPostWithImage, message: 'Пост успешно создан!'})
        }

        const newPostWithoutImage= new Post({
            text,
            imgUrl: '',
            author: req.userId
          });

        await newPostWithoutImage.save(); 

        await User.findByIdAndUpdate(req.userId, {
            $push: { posts: newPostWithoutImage },
        }) 

        return res.json({newPostWithoutImage, message: 'Пост успешно создан!'})
    } catch(error) {
        res.json({message: 'Что-то пошло не так!'})
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().sort('-createdAt')
        const popularPosts = await Post.find().limit(5).sort('-views')

        if (!posts) {
            return res.json({ message: 'Постов нет' })
        }

        res.json({ posts, popularPosts })
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const getById = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $inc: {views: 1}
        })

        res.json(post)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const removePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)

        if(!post) res.json({message: 'Такого поста не существует!'})

        await User.findByIdAndUpdate(req.userId, {
            $pull: {posts: req.params.id}
        })
        res.json({message: 'Пост успешно удален!'})
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { text, id } = req.body;
        const post = await Post.findById(id)

        if(req.files) {
            let fileName = Date.now().toString() + req.files.image.name;
            let __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
            post.imgUrl = fileName || ''
        }

        post.text = text

        await post.save()

        res.json(post)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        
        const myPosts = await Promise.all(
            user.posts.map((post) => {
                return Post.findById(post._id)
            })
        )

        res.json(myPosts)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        
        const userPosts = await Promise.all(
            user.posts.map((post) => {
                return Post.findById(post._id)
            })
        )

        res.json(userPosts)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так!' })
    }
}

export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const commentsList = await Promise.all(
            post.comments.map((comment) => {
                return Comment.findById(comment)
            }),
        )
        res.json(commentsList)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}


export const getLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.like.includes(req.userId)){
              await post.updateOne({$push:{like:req.userId}})
              return res.json({ message: 'Like поставлен' })
              
        }else{
              await post.updateOne({$pull:{like:req.userId}});
              return res.json({ message: 'Like убран' })
        }
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}