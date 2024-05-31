import { Good, GoodStatus, Category } from "../models/relations.js";

export const getAllGoods = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1; // По умолчанию 5 записей
    const page = parseInt(req.query.page) || 3; // Номер страницы

    const goods = await Good.findAll({
      include: [
        {
          model: GoodStatus,
          as: "status",
        },
      ],

      // include: [
      //   {
      //     model: User,
      //     as: "user",
      //     attributes: ["user_id", "email", "name", "img"],
      //     include: [
      //       {
      //         model: UserRole,
      //         as: "role",
      //       },
      //     ],
      //   },
      //   {
      //     model: OrderItem,
      //     as: "items",
      //     attributes: ["good_id"],
      //     include: [
      //       {
      //         model: Good, // Модель Good, чтобы получить информацию о товаре
      //         as: "good", // Указываем алиас для связи
      //         attributes: ["good_id", "name"],
      //       },
      //     ],
      //   },
      //   {
      //     model: OrderStatus,
      //     as: "order_status",
      //     attributes: ["order_status_id", "name"],
      //   },
      // ],
      // attributes: ["order_id"],
      limit: limit,
      offset: page * limit,
    });

    goods.forEach((row) => {
      row.good_status_id;
      row.img = Buffer.from(row.img).toString("base64");
    });

    if (!goods) {
      return res.status(404).json({ message: "No   found" });
    }
    res.status(200).json(goods);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
