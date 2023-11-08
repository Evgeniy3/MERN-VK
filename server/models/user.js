import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        avatar: {type: String, default: ''},
        cover: {type: String, default: ''},
        city: {type: String, required: true},
        birthday: {type: String, required: true},
        posts: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
        }],
        subscriptions: [{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }],
        subscribers: [{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }],
        music: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Music',
        }],
        socket_id: {
            type: String
          },
        status: {
            type: String,
            enum: ["Online", "Offline"]
        }
    },
    {timestamps: true}
);

export default mongoose.model('User', UserSchema);