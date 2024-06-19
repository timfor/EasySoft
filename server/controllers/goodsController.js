import { Good, GoodStatus, Category } from "../models/relations.js";
import { validationResult } from "express-validator";
import { Op } from "sequelize";

export const getAllGoods = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9999999999; // По умолчанию 5 записей
    const page = parseInt(req.query.page) || 0; // Номер страницы

    const search = req.query.search || "";
    const category = req.query.category || "";
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const sortByPrice = req.query.sortByPrice || ""; // 'asc' или 'desc'

    let whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category) {
      whereClause.category_id = category; // Предполагаем, что у Good есть поле categoryId
    }

    let orderClause = [];
    if (sortByPrice === "asc" || sortByPrice === "desc") {
      orderClause.push(["price", sortByPrice]);
    }

    const goods = await Good.findAll({
      where: whereClause,
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
      order: orderClause,
    });

    const totalCount = await Good.count({
      where: whereClause,
    });

    goods.forEach((row) => {
      row.img = Buffer.from(row.img).toString("base64");
    });

    if (!goods) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ totalGoods: totalCount, goods: goods });
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
export const getGoodStatuses = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const goodStatuses = await GoodStatus.findAll();
    if (!goodStatuses) {
      return res
        .status(404)
        .json({ success: false, message: "Статусы товаров не найдены" });
    }
    return res.status(201).json(goodStatuses);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const goodCategories = await Category.findAll();
    if (!goodCategories) {
      return res
        .status(404)
        .json({ success: false, message: "Категории товаров не найдены" });
    }

    return res.status(201).json(goodCategories);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   const errorMessages = errors.array().map((error) => error.msg);
    //   return res.status(400).json({ errors: errorMessages });
    // }

    const category = await Category.findOne({
      where: {
        name: req.body.name,
      },
    });
    if (category) {
      return res
        .status(404)
        .json({ success: false, message: "Категория уже существует" });
    }
    await Category.create(req.body);

    return res.status(201).json(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
