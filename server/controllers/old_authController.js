import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/Users.js";

dotenv.config();
const SQLITEURL = process.env.SQLITEURL;
const jwt_key = process.env.jwt;

const userModel = new UserModel(SQLITEURL);

export const login = async function (req, res) {
  const candidate = await userModel.getUserByParameter("email", req.body.email);
  if (candidate.err != null) {
    res.status(500).json({
      message: "Ошибка при получении пользователя по емейлу",
    });
  } else if (candidate.row != null) {
    const passwordResult = await bcrypt.compare(
      req.body.password,
      candidate.row.password
    );
    if (passwordResult) {
      const token = jwt.sign(
        {
          email: candidate.row.email,
          userId: candidate.row.user_id,
        },
        jwt_key,
        { expiresIn: 60 * 60 }
      );
      res.status(200).json({ token: `Bearer ${token}` });
    } else {
      res
        .status(401)
        .json({ message: "пароли не совпадают, попробуйте снова" });
    }
  } else {
    return res.status(404).json({
      message: "Пользователь не найден",
    });
  }
};
export const register = async function (req, res) {
  const user = await userModel.getUserByParameter("email", req.body.email);

  console.log(user);

  if (user.err != null) {
    res.status(500).json({
      message: "Ошибка при получении пользователя по емейлу",
    });
  } else if (user.row != null) {
    return res.status(409).json({
      message: "Такой email уже занят",
    });
  } else {
  }

  const salt = bcrypt.genSaltSync(10); // генерим соль для
  const passOld = await req.body.password;
  console.log(passOld);
  const password = bcrypt.hashSync(passOld, salt);
  console.log(password);

  const candidate = {
    email: req.body.email,
    password: password,
  };
  await userModel.createNewUser(
    candidate.email,
    candidate.password,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          message: "Ошибка при добавлении пользователя" + err,
        });
      } else {
        res.status(201).json(candidate);
      }
    }
  );
};
