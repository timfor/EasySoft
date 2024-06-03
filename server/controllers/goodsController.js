import { Good, GoodStatus, Category } from "../models/relations.js";
import { validationResult } from "express-validator";

export const getAllGoods = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 35; // По умолчанию 5 записей
    const page = parseInt(req.query.page) || 0; // Номер страницы

    const goods = await Good.findAll({
      include: [
        {
          model: GoodStatus,
          as: "status",
          attributes: ["name"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
      limit: limit,
      offset: page * limit,
    });

    goods.forEach((row) => {
      row.img = Buffer.from(row.img).toString("base64");
    });

    if (!goods) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(goods);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const getGoodById = async (req, res) => {
  try {
    const good = await Good.findByPk(req.params.good_id, {
      include: [
        {
          model: GoodStatus,
          as: "status",
          attributes: ["name"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
    });
    if (!good) {
      return res.status(404).json({ message: "Not found" });
    }

    good.img = Buffer.from(good.img).toString("base64");
    return res.status(200).json(good);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const createGood = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const existingGood = await Good.findOne({
      where: {
        name: req.body.name,
      },
    });
    if (existingGood) {
      return res
        .status(409)
        .json({ message: "Товар с таким именем уже существует" });
    }

    if (!req.files || !req.files[0]) {
      req.body.img = "none";
    } else {
      req.body.img = req.files[0].buffer;
    }
    await Good.create(req.body);
    return res
      .status(201)
      .json({ success: true, message: "Успешно добавлен товар" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateGood = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const existingGood = await Good.findByPk(req.params.good_id);
    if (!existingGood) {
      return res.status(404).json({ message: "Товар с таким id не найден" });
    }

    if (!req.files || !req.files[0]) {
      req.body.img = "none";
    } else {
      req.body.img = req.files[0].buffer;
    }
    await existingGood.update(req.body);

    return res
      .status(201)
      .json({ success: true, message: "Товар успешно обновлен" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
