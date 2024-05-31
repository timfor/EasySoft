import { DataTypes } from "sequelize";
import sequelize from "../database.js";

export const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true, // Встроенная валидация: поле не должно быть пустым
        isEmail: true, // Встроенная валидация: поле должно быть валидным email
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100], // Встроенная валидация: длина строки должна быть от 6 до 100 символов
        isValidPassword(value) {
          if (value.length < 8) {
            throw new Error("Password must be at least 8 characters long");
          }
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
  },
  {
    tableName: "users", // Явно указываем имя таблицы
    timestamps: false, // Отключение автоматического создания полей createdAt и updatedAt
  }
);

export const UserRole = sequelize.define(
  "Role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "roles", // Явно указываем имя таблицы
    timestamps: false, // Отключение автоматического создания полей createdAt и updatedAt
  }
);
