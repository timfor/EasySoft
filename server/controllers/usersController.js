import { User, UserRole } from "../models/relations.js";
import { validationResult } from "express-validator";

export const getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 35; // По умолчанию 5 записей
    const page = parseInt(req.query.page) || 0; // Номер страницы

    const users = await User.findAll({
      include: [
        {
          model: UserRole,
          as: "role",
        },
      ],
      limit: limit,
      offset: page * limit,
      attributes: ["user_id", "email", "password", "name", "img"],
    });

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    users.forEach((row) => {
      row.img = Buffer.from(row.img).toString("base64");
    });

    return res.status(200).json(users); // Отправляем список пользователей с ролями в формате JSON
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const user = await User.findByPk(req.params.user_id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    //
    if (!req.files || !req.files[0]) {
      await user.update({ name: req.body.name });
    } else {
      req.body.img = req.files[0].buffer;
      await user.update(req.body);
    }

    return res
      .status(200)
      .json({ success: true, message: "Данные пользователя обновлены" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const user = await User.findByPk(req.params.user_id, {
      include: [
        {
          model: UserRole,
          as: "role",
        },
      ],
      attributes: ["user_id", "email", "password", "name", "img"],
    });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    user.img = Buffer.from(user.img).toString("base64");

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    const user = await User.findByPk(req.params.user_id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    await user.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Пользователь успешно удален" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
