import { body } from "express-validator";

export const updateReviewValidation = [
  body().custom((value, { req }) => {
    const allowedKeys = ["text"];
    const keys = Object.keys(req.body);
    const invalidKeys = keys.filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(
        `Недопустимый ключ/и в запросе: ${invalidKeys.join(", ")}`
      );
    }
    return true;
  }),

  body("text")
    .notEmpty()
    .isString()
    .withMessage("Текст отзыва должно быть не пустой строкой"),
];
export const createReviewValidation = [
  body().custom((value, { req }) => {
    const allowedKeys = ["good_id", "user_id", "text"];
    const keys = Object.keys(req.body);
    const invalidKeys = keys.filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(
        `Недопустимый ключ/и в запросе: ${invalidKeys.join(", ")}`
      );
    }
    return true;
  }),

  body("good_id")
    .notEmpty()
    .isInt()
    .withMessage(
      "Id товара не должно быть пустым и должно быть существующим int"
    ),
  body("user_id")
    .notEmpty()
    .isInt()
    .withMessage(
      "Id пользователя не должно быть пустым и должно быть существующим int"
    ),
  body("text")
    .notEmpty()
    .isString()
    .withMessage("Текст отзыва должно быть не пустой строкой"),
];
