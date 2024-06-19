import {
  Order,
  OrderStatus,
  OrderItem,
  User,
  UserRole,
  Good,
  GoodStatus,
} from "../models/relations.js";
import sequelize from "../database.js";
import { validationResult } from "express-validator";

export const getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // По умолчанию 5 записей
    const page = parseInt(req.query.page) || 0; // Номер страницы

    // // Находим общее количество заказов
    // const totalOrders = await Order.count();
    // // Вычисляем количество страниц
    // const totalPages = Math.ceil(totalOrders / limit);

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
              model: Good, // Модель Good, чтобы получить информацию о товаре
              as: "good", // Указываем алиас для связи
              attributes: ["name", "price"],
              include: [
                {
                  model: GoodStatus,
                  as: "status",
                  attributes: ["good_status_id", "name"],
                },
              ],
            },
          ],
        },
        {
          model: OrderStatus,
          as: "order_status",
          attributes: ["order_status_id", "name"],
        },
      ],
      attributes: ["order_id", "createdAt", "updatedAt"],
      limit: limit,
      offset: page * limit,
    });
    if (!orders) {
      return res.status(404).json({ message: "Заказы не найдены" });
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
              model: Good, // Модель Good, чтобы получить информацию о товаре
              as: "good", // Указываем алиас для связи
              attributes: ["name", "price"],
              include: [
                {
                  model: GoodStatus,
                  as: "status",
                  attributes: ["good_status_id", "name"],
                },
              ],
            },
          ],
        },
        {
          model: OrderStatus,
          as: "order_status",
          attributes: ["order_status_id", "name"],
        },
      ],
      attributes: ["order_id", "createdAt", "updatedAt"],
    });
    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }
    res.json(order);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const getAllUserOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // По умолчанию 5 записей
    const page = parseInt(req.query.page) || 0; // Номер страницы

    const orders = await Order.findAll({
      where: {
        user_id: req.params.user_id,
      },
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
              model: Good, // Модель Good, чтобы получить информацию о товаре
              as: "good", // Указываем алиас для связи
              attributes: ["name", "price"],
              include: [
                {
                  model: GoodStatus,
                  as: "status",
                  attributes: ["good_status_id", "name"],
                },
              ],
            },
          ],
        },
        {
          model: OrderStatus,
          as: "order_status",
          attributes: ["order_status_id", "name"],
        },
      ],
      attributes: ["order_id", "createdAt", "updatedAt"],
      limit: limit,
      offset: page * limit,
    });

    if (!orders[0]) {
      return res.status(404).json({ success: false, message: "Нету заказов" });
    }

    return res.status(200).json(orders);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const order = await Order.create(
      {
        user_id: req.body.user_id,
        order_status_id: 1,
      },
      { transaction: t }
    );

    await Promise.all(
      req.body.items.map(async (item) => {
        await OrderItem.create(
          {
            order_id: order.order_id,
            good_id: item.good_id,
          },
          { transaction: t }
        );
      })
    );

    await t.commit();

    return res
      .status(201)
      .json({ success: true, message: "Заказ успешон создан", order });
  } catch (err) {
    await t.rollback();
    return res.status(400).json({ error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const order = await Order.findByPk(req.params.order_id);

    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    await order.update({ order_status_id: req.body.order_status_id });
    return res.status(200).json({
      success: true,
      message: "Статус заказа обновлен",
      order_status_id: req.body.order_status_id,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
