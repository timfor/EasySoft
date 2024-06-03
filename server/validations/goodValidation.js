import { body } from "express-validator";

export const createGoodValidation = [
  body().custom((value, { req }) => {
    const allowedKeys = [
      "name",
      "price",
      "description",
      "img",
      "good_status_id",
      "category_id",
    ];
    const keys = Object.keys(req.body);
    const invalidKeys = keys.filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(
        `Недопустимый ключ/и в запросе: ${invalidKeys.join(", ")}`
      );
    }
    return true;
  }),

  body("name")
    .notEmpty()
    .isString()
    .withMessage("Имя должно быть не пустой строкой"),
  body("price")
    .notEmpty()
    .isNumeric()
    .withMessage("Цена должна быть не пустым числом"),
  body("description")
    .optional()
    .isString()
    .withMessage("Описание должно быть не пустой строкой"),
  body("img")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error(
          "Если изображение загружается - оно должно быть файлом"
        );
      }
      return true;
    }),

  body("good_status_id")
    .notEmpty()
    .isInt()
    .isLength({ min: 1, max: 1 })
    .withMessage(
      "Id статуса товара не должно быть пустым и должно быть существующим int"
    ),
  body("category_id")
    .notEmpty()
    .isInt()
    .isLength({ min: 1, max: 2 })
    .withMessage(
      "Id категории товара не должно быть пустым и должно быть существующим int"
    ),
];

export const updateGoodValidation = [
  body().custom((value, { req }) => {
    const allowedKeys = [
      "name",
      "price",
      "description",
      "img",
      "good_status_id",
      "category_id",
    ];
    const keys = Object.keys(req.body);
    const invalidKeys = keys.filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(
        `Недопустимый ключ/и в запросе: ${invalidKeys.join(", ")}`
      );
    }
    return true;
  }),

  body("name")
    .optional()
    .notEmpty()
    .isString()
    .withMessage("Имя должно быть не пустой строкой"),
  body("price")
    .optional()
    .notEmpty()
    .isNumeric()
    .withMessage("Цена должна быть не пустым числом"),
  body("description")
    .optional()
    .isString()
    .withMessage("Описание должно быть не пустой строкой"),
  body("img")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error(
          "Если изображение загружается - оно должно быть файлом"
        );
      }
      return true;
    }),

  body("good_status_id")
    .optional()
    .notEmpty()
    .isInt()
    .isLength({ min: 1, max: 1 })
    .withMessage(
      "Id статуса товара не должно быть пустым и должно быть существующим int"
    ),
  body("category_id")
    .optional()
    .notEmpty()
    .isInt()
    .isLength({ min: 1, max: 2 })
    .withMessage(
      "Id категории товара не должно быть пустым и должно быть существующим int"
    ),
];
