import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/relations.js";
import { validationResult } from "express-validator";

dotenv.config();
const jwt_key = process.env.jwt;

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ success: false, errors: errorMessages });
    }

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (user != null) {
      return res
        .status(409)
        .json({ success: false, errors: ["Такой email уже занят"] });
    }

    const salt = bcrypt.genSaltSync(10); // генерим соль для
    const passOld = await req.body.password;
    const password = bcrypt.hashSync(passOld, salt);

    req.body.password = password;
    req.body.role_id = 1;
    req.body.img = "none";
    const createdUser = await User.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Регистрация успешна",
      user: {
        user_id: createdUser.user_id,
        email: createdUser.email,
        role_id: createdUser.role_id,
      },
    });
  } catch (err) {
    return res.status(400).json({ errors: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ success: false, errors: [errorMessages] });
    }

    const candidate = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (candidate == null) {
      return res
        .status(404)
        .json({ success: false, errors: ["Пользователь не найден"] });
    }

    //

    const passwordResult = await bcrypt.compare(
      req.body.password,
      candidate.password
    );
    if (passwordResult) {
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate.user_id,
          roleId: candidate.role_id,
          name: candidate.name,
        },
        jwt_key,
        { expiresIn: 60 * 60 }
      );
      res.status(200).json({ success: true, token: `Bearer ${token}` });
    } else {
      res.status(401).json({
        success: false,
        errors: ["пароли не совпадают, попробуйте снова"],
      });
    }
    //
  } catch (err) {
    return res.status(400).json({ success: false, errors: [err.message] });
  }
};
