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
          attributes: ["user_id", "email", "name", "img"],
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
      return res.status(404).json({ message: "No   found" });
    }
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
      return res.status(404).json({ message: "order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
