import { body } from "express-validator";

export const updateUserValidation = [
  body().custom((value, { req }) => {
    const allowedKeys = ["name", "img"];
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
    .withMessage("Name should be a non-empty string"),
  body("img").optional().isBase64().withMessage("Image must be base64 encoded"),
];
