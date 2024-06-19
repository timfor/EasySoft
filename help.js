// authenticate.js
import jwt from "jsonwebtoken";
import { User } from "../models/relations.js";

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.user_id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// authorize.js
export const authorize = (req, res, next) => {
  const { user_id } = req.params;
  if (req.user.role === "admin" || req.user.user_id === parseInt(user_id)) {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
};

//routes
import express from "express";
import {
  getAllOrders,
  getOrderById,
  getAllUserOrders,
  deleteOrder,
  createOrder,
  updateOrder,
} from "../controllers/ordersController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", authenticate, getAllOrders); // Получить все заказы
router.get("/user/:user_id", authenticate, authorize, getAllUserOrders); // Получить все заказы пользователя по user_id
router.get("/:order_id", authenticate, getOrderById); // Получить заказ по order_id
router.delete("/:order_id", authenticate, deleteOrder); // Удалить заказ по order_id
router.post("/create", authenticate, createOrder); // Создать новый заказ
router.patch("/:order_id", authenticate, updateOrder); // Обновить заказ по order_id

export default router;

// controllers

import {
  Order,
  OrderStatus,
  OrderItem,
  User,
  UserRole,
  Good,
} from "../models/relations.js";

export const getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 0;

    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "email", "name"],
          include: [
            {
              model: UserRole,
              as: "role",
            },
          ],
        },
        {
          model: OrderItem,
          as: "items",
          attributes: ["good_id"],
          include: [
            {
              model: Good,
              as: "good",
              attributes: ["good_id", "name"],
            },
          ],
        },
        {
          model: OrderStatus,
          as: "order_status",
          attributes: ["order_status_id", "name"],
        },
      ],
      attributes: ["order_id"],
      limit: limit,
      offset: page * limit,
    });
    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }
    return res.json(orders);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.order_id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "email", "name"],
          include: [
            {
              model: UserRole,
              as: "role",
            },
          ],
        },
        {
          model: OrderItem,
          as: "items",
          attributes: ["good_id"],
          include: [
            {
              model: Good,
              as: "good",
              attributes: ["good_id", "name"],
            },
          ],
        },
        {
          model: OrderStatus,
          as: "order_status",
          attributes: ["order_status_id", "name"],
        },
      ],
      attributes: ["order_id"],
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const getAllUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        user_id: req.params.user_id,
      },
      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: ["good_id"],
          include: [
            {
              model: Good,
              as: "good",
              attributes: ["good_id", "name"],
            },
          ],
        },
        {
          model: OrderStatus,
          as: "order_status",
          attributes: ["order_status_id", "name"],
        },
      ],
      attributes: ["order_id"],
    });
    if (!orders.length) {
      return res
        .status(404)
        .json({ success: false, message: "User has no orders" });
    }

    return res.status(200).json(orders);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await order.destroy();
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { user_id, items, status } = req.body;
    const order = await Order.create({
      user_id,
      status,
      items,
    });
    return res.status(201).json(order);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status, items } = req.body;
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    order.items = items;
    await order.save();
    return res.status(200).json(order);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
