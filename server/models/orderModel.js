import { DataTypes } from "sequelize";
import sequelize from "../database.js";

export const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
    order_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
  },
  {
    tableName: "orders", // Явно указываем имя таблицы
    timestamps: true, // Отключение автоматического создания полей createdAt и updatedAt
  }
);

export const OrderItem = sequelize.define(
  "OrderItem",
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
    good_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
  },
  {
    tableName: "orderItems",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["order_id", "good_id"],
      },
    ],
  }
);

export const OrderStatus = sequelize.define(
  "OrderStatus",
  {
    order_status_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlphanumeric: true,
      },
    },
  },
  {
    tableName: "orderStatuses",
    timestamps: false,
  }
);
