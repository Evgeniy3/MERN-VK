import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { Server } from "socket.io";
import { createServer } from 'node:http';

import User from './models/user.js';
import OneToOneMessage from './models/oneToOneMessage.js';


import authRoute from './routes/auth.js';
import postRoute from './routes/post.js';
import commentRoute from './routes/comment.js';
import userRoute from './routes/user.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
});

dotenv.config();

const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.static('uploads'));

app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);
app.use('/api/users', userRoute);

io.on("connection", async (socket) => {
    const userId = socket.handshake.query["userId"];
  
    console.log(`User connected ${socket.id}`);
  
    if (userId !== null && Boolean(userId)) {
      try {
        await User.findByIdAndUpdate(userId, {
          socket_id: socket.id,
          status: "Online",
        }, {new: true});
      } catch (e) {
        console.log(e);
      }
    }

    socket.on("get_direct_conversations", async ({ userId }, callback) => {
      const existing_conversations = await OneToOneMessage.find({
        participants: { $all: [userId] },
      }).populate("participants", "name lastName avatar _id email status");
  
      callback(existing_conversations);
    });

    socket.on("start_conversation", async (data) => {
      const { to, from } = data;
  
      const existing_conversations = await OneToOneMessage.find({
        participants: { $size: 2, $all: [to, from] },
      }).populate("participants", "name lastName _id email status");
  
      if (existing_conversations.length === 0) {
        let new_chat = await OneToOneMessage.create({
          participants: [to, from],
        });
  
        new_chat = await OneToOneMessage.findById(new_chat).populate(
          "participants",
          "name lastName _id email status"
        );
  
        socket.emit("start_chat", new_chat);
      }
      else {
        socket.emit("start_chat", existing_conversations[0]);
      }
    });

    
  socket.on("get_messages", async (data, callback) => {
    try {
      const { messages } = await OneToOneMessage.findById(
        data.conversation_id
      ).select("messages");
      console.log('messages',messages);
      callback(messages);
    } catch (error) {
      console.log(error);
    }
  });

    socket.on("text_message", async (data) => {
      console.log("Received message:", data);
  
      const { message, conversation_id, from, to } = data;
  
      const to_user = await User.findById(to);
      const from_user = await User.findById(from);
  
      const new_message = {
        to: to,
        from: from,
        created_at: Date.now(),
        text: message,
      };
  
      const chat = await OneToOneMessage.findById(conversation_id);
      chat?.messages.push(new_message);

      await chat.save({ new: true });
  
      io.to(to_user?.socket_id).emit("new_message", {
        conversation_id,
        message: new_message,
      });
  
      io.to(from_user?.socket_id).emit("new_message", {
        conversation_id,
        message: new_message,
      });
    });
  
    socket.on("end", async (data) => {
    
        if (data.userId) {
          await User.findByIdAndUpdate(data.userId, { status: "Offline" }, {new: true});
        }
    
        console.log("closing connection");
        socket.disconnect(0);
      });
  })

async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.wn8pzs0.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
        )

        server.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
    } catch (error) {
        console.log(error)
    }
};
start();





