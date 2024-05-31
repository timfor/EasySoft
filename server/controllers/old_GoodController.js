import { GoodModel } from "../models/Goods.js";
import dotenv from "dotenv";

dotenv.config();
const SQLITEURL = process.env.SQLITEURL;

const goodModel = new GoodModel(SQLITEURL);

export const getAllGoodsController = (req, res) => {
  goodModel.getAllGoods((err, rows) => {
    if (err) {
      res
        .status(500)
        .send("Ошибка при получении списка товаров из базы данных");
    } else {
      console.log("все ок");
      rows.forEach((row) => {
        row.img = Buffer.from(row.img).toString("base64");
      });
      res.json(rows);
    }
  });
};
// export const getGoodByParameterController = (req, res) => {};

export const getGoodByGoodIdController = async (req, res) => {
  const good = await goodModel.getGoodByParameter(
    "good_id",
    req.params.good_id
  );
  if (good.row != null) {
    good.row.img = Buffer.from(good.row.img).toString("base64");
    res.status(200).json(good);
  } else if (good.err != null) {
    res
      .status(500)
      .json({ message: "Ошибка с базой данных. Попробуйте снова" });
  } else {
    res.status(404).json({ message: "Товар не найден по Id" });
  }
};

export const createGoodController = async (req, res) => {
  const goodToCreate = {
    Goodname: req.body.name,
    price: req.body.price,
    description: req.body.description,
    img: req.body.img,
    good_status_id: req.body.good_status_id,
    category_id: req.body.category_id,
  };

  await goodModel.createNewGood(goodToCreate, async (err, row) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Не удалось создать пользователя" + err,
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Успешно добавлен товар",
        goodToCreate,
      });
    }
  });
};

export const updateGoodController = async (req, res) => {
  const good = await goodModel.getGoodByParameter(
    "good_id",
    req.params.good_id
  );

  if (good.err != null) {
    res
      .status(500)
      .json({ message: "Ошибка с базой данных. Попробуйте снова" });
  } else if (good.row == null) {
    res.status(404).json({ message: "Товар не найден по Id" });
  }

  const columns = Object.keys(req.body);
  const values = Object.values(req.body);

  let placeholders = columns.map((column) => `${column} = ?`).join(", ");
  const isSuccess = await goodModel.updateGoodById(
    values,
    placeholders,
    req.params.good_id
  );

  if (isSuccess.row != null) {
    res.status(200).json({ success: true });
  } else if (isSuccess.err != null) {
    res.status(500).json({ success: false, message: err });
  } else {
    res.status(500).json({
      success: false,
      message: "Товар не найден роу не пришел??",
    });
  }
};
