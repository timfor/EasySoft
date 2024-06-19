import { body } from "express-validator";

export const createOrderValidation = [
  body().custom((value, { req }) => {
    const allowedKeys = ["user_id", "items"];
    const keys = Object.keys(req.body);
    const invalidKeys = keys.filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(
        `Недопустимый ключ/и в запросе: ${invalidKeys.join(", ")}`
      );
    }
    return true;
  }),

  body("user_id")
    .notEmpty()
    .isInt()
    .withMessage(
      "Id пользователя не должно быть пустым и должно быть существующим int"
    ),
  body("items")
    .isArray({ min: 1 })
    .withMessage("Массив товаров не должен быть пустым.")
    .custom((items) => items.every((item) => item.good_id)) // && item.quantity - не обязательно пока
    .withMessage("Каждая позиция заказа должна содержать good_id."),
];
export const updateOrderValidation = [
  body().custom((value, { req }) => {
    const allowedKeys = ["order_status_id"];
    const keys = Object.keys(req.body);
    const invalidKeys = keys.filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(
        `Недопустимый ключ/и в запросе: ${invalidKeys.join(", ")}`
      );
    }
    return true;
  }),

  body("order_status_id")
    .notEmpty()
    .withMessage("ID статуса заказа обязателен.")
    .isIn([2, 3])
    .withMessage("ID статуса заказа должен быть 2 или 3."),
];
