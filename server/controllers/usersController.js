import { User, UserRole } from "../models/relations.js";
import { validationResult } from "express-validator";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: UserRole,
          as: "role",
        },
      ],
      attributes: ["user_id", "email", "password", "name", "img"],
    });

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users); // Отправляем список пользователей с ролями в формате JSON
  } catch (err) {
    res.status(400).json({ error: err.message });
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
      return res.status(404).json({ message: "User not found" });
    }
    await user.update(req.body);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
