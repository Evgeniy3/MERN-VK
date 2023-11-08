import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const register = async (req, res) => {
  try {
    const { name, lastName, email, password, city, birthday } = req.body;
    const isUsed = await User.findOne({ email });
    if (isUsed) {
      return res.json({ message: "Данный пользователь уже существует." });
    }
    
    let fileName = Date.now().toString() + req.files.image.name;
    let __dirname = dirname(fileURLToPath(import.meta.url));
    req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name,
      lastName,
      city,
      birthday,
      avatar: fileName,
      email,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    await newUser.save();

    res.json({
      token,
      newUser,
      message: "Регистрация прошла успешно.",
    });
    
  } catch (error) {
    console.log(error);
    res.json({ message: "Ошибка регистрации" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Такого пользователя не существует." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({
        message: "Неверный пароль.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user,
      message: "Вы вошли в систему.",
    });
  } catch (error) {
    res.json({ message: "Ошибка авторизации" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.json({
        message: "Такого пользователя не существует.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.json({ message: "Ошибка входа" });
  }
};
